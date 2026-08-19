#!/usr/bin/env node
// Doox forms server — exposes one tool, `doox_form`, whose only job is to turn a field list into an
// MCP `elicitation/create` request. A skill is markdown and cannot send that request itself; this
// server can, so skills call the tool and the client renders a real form.
//
// Zero dependencies on purpose: stdio JSON-RPC is newline-delimited JSON, and the surface used here
// is small enough that pulling the SDK in would cost an install step for no gain.

const PROTOCOL_VERSION = '2025-06-18';

/** Field list from a skill -> the restricted JSON Schema subset elicitation accepts. */
export function buildRequestedSchema(fields) {
  const properties = {};
  const required = [];

  for (const field of fields) {
    const { name, label, type = 'text', options, optional } = field;
    if (!name) throw new Error('every field needs a name');

    switch (type) {
      case 'text':
        properties[name] = { type: 'string', title: label, description: field.hint };
        break;
      case 'email':
        properties[name] = { type: 'string', format: 'email', title: label, description: field.hint };
        break;
      case 'choice':
        if (!options?.length) throw new Error(`field ${name}: choice needs options`);
        properties[name] = { type: 'string', title: label, enum: options };
        break;
      case 'checkbox':
        properties[name] = { type: 'boolean', title: label, default: false };
        break;
      default:
        throw new Error(`field ${name}: unknown type ${type}`);
    }

    // Elicitation schemas are flat primitives only — a checkbox left alone is `false`, never absent,
    // so requiring it would block a form the user legitimately ticked nothing on.
    if (!optional && type !== 'checkbox') required.push(name);
  }

  return { type: 'object', properties, required };
}

const TOOL = {
  name: 'doox_form',
  description:
    'Ask the user several things at once in one real form. Sends an MCP elicitation and returns what ' +
    'the user filled in. Use instead of a one-question-at-a-time picker whenever a Doox skill needs ' +
    'more than one fact. Returns the filled values, or the reason the form was not answered.',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Form title, e.g. "Nghiên cứu thị trường"' },
      fields: {
        type: 'array',
        description: 'One entry per thing to ask. Order is preserved.',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Key the answer comes back under' },
            label: { type: 'string', description: 'Label the user reads' },
            type: { type: 'string', enum: ['text', 'email', 'choice', 'checkbox'] },
            options: { type: 'array', items: { type: 'string' }, description: 'Required for type=choice' },
            hint: { type: 'string', description: 'Placeholder shown in the field' },
            optional: { type: 'boolean' },
          },
          required: ['name', 'label', 'type'],
        },
      },
    },
    required: ['title', 'fields'],
  },
};

// --- transport ---------------------------------------------------------------

const pending = new Map();
let nextId = 1;
let clientSupportsElicitation = false;

function write(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

/** Send a request to the client and wait for its response. */
function callClient(method, params) {
  const id = `doox-${nextId++}`;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    write({ jsonrpc: '2.0', id, method, params });
  });
}

async function elicit(title, fields) {
  if (!clientSupportsElicitation) {
    return {
      ok: false,
      reason:
        'This client did not declare the `elicitation` capability, so no form can be shown. Ask the ' +
        'questions with the harness\'s own structured-question tool instead, all of them in one call.',
    };
  }

  const response = await callClient('elicitation/create', {
    message: title,
    title, // Cowork rejects the call without it
    requestedSchema: buildRequestedSchema(fields),
  });

  if (response.action !== 'accept') {
    return { ok: false, reason: `user did not answer the form (action: ${response.action})` };
  }
  return { ok: true, answers: response.content ?? {} };
}

async function handleRequest(message) {
  const { id, method, params } = message;

  switch (method) {
    case 'initialize':
      clientSupportsElicitation = Boolean(params?.capabilities?.elicitation);
      return {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'doox-forms', version: '1.0.0' },
      };

    case 'tools/list':
      return { tools: [TOOL] };

    case 'tools/call': {
      if (params?.name !== TOOL.name) throw new Error(`unknown tool ${params?.name}`);
      const { title, fields } = params.arguments ?? {};
      if (!title) throw new Error('title is required');
      if (!Array.isArray(fields) || fields.length === 0) throw new Error('fields must be a non-empty array');

      const result = await elicit(title, fields);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        isError: !result.ok,
      };
    }

    case 'ping':
      return {};

    default:
      throw Object.assign(new Error(`method not found: ${method}`), { code: -32601 });
  }
}

function handleLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return; // not our problem; a malformed frame is dropped rather than crashing the server
  }

  // A response to something we asked the client.
  if (message.method === undefined && message.id !== undefined) {
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message ?? 'client error'));
    else waiter.resolve(message.result);
    return;
  }

  // A notification — nothing to answer.
  if (message.id === undefined) return;

  handleRequest(message).then(
    (result) => write({ jsonrpc: '2.0', id: message.id, result }),
    (error) => write({
      jsonrpc: '2.0',
      id: message.id,
      error: { code: error.code ?? -32603, message: error.message },
    }),
  );
}

export function listen() {
  let buffer = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let cut;
    while ((cut = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, cut).trim();
      buffer = buffer.slice(cut + 1);
      if (line) handleLine(line);
    }
  });
  process.stdin.on('end', () => process.exit(0));
}

if (import.meta.url === `file://${process.argv[1]}`) listen();
