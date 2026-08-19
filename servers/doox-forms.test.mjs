#!/usr/bin/env node
// Run: node servers/doox-forms.test.mjs
// Covers the two things that actually break: the schema built from a field list, and the round trip
// through stdio — initialize, tools/call, the elicitation request going out, the answers coming back.

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { buildRequestedSchema } from './doox-forms.mjs';

// --- schema ------------------------------------------------------------------

const schema = buildRequestedSchema([
  { name: 'thiTruong', label: 'Thị trường', type: 'text', hint: 'Toronto, Canada' },
  { name: 'mtChonSite', label: 'Chọn site', type: 'checkbox' },
  { name: 'doSau', label: 'Độ sâu', type: 'choice', options: ['Nhanh', 'Sâu'] },
  { name: 'email', label: 'Email', type: 'email' },
]);

assert.equal(schema.type, 'object');
assert.deepEqual(schema.properties.thiTruong, {
  type: 'string',
  title: 'Thị trường',
  description: 'Toronto, Canada',
});
assert.deepEqual(schema.properties.mtChonSite, { type: 'boolean', title: 'Chọn site', default: false });
assert.deepEqual(schema.properties.doSau, { type: 'string', title: 'Độ sâu', enum: ['Nhanh', 'Sâu'] });
assert.equal(schema.properties.email.format, 'email');

// Checkboxes are never required — a form with nothing ticked must still submit.
assert.deepEqual(schema.required, ['thiTruong', 'doSau', 'email']);

// Every property is a flat primitive: elicitation rejects anything else.
for (const [name, property] of Object.entries(schema.properties)) {
  assert.ok(['string', 'number', 'integer', 'boolean'].includes(property.type), `${name} is not primitive`);
}

assert.throws(() => buildRequestedSchema([{ name: 'x', label: 'X', type: 'choice' }]), /needs options/);
assert.throws(() => buildRequestedSchema([{ name: 'x', label: 'X', type: 'slider' }]), /unknown type/);

// --- stdio round trip --------------------------------------------------------

const server = join(dirname(fileURLToPath(import.meta.url)), 'doox-forms.mjs');

function talk(clientCapabilities, onElicitation) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [server], { stdio: ['pipe', 'pipe', 'inherit'] });
    const seen = [];
    let buffer = '';

    const send = (message) => child.stdin.write(JSON.stringify(message) + '\n');

    child.stdout.on('data', (chunk) => {
      buffer += chunk;
      let cut;
      while ((cut = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, cut).trim();
        buffer = buffer.slice(cut + 1);
        if (!line) continue;
        const message = JSON.parse(line);
        seen.push(message);

        if (message.method === 'elicitation/create') {
          send({ jsonrpc: '2.0', id: message.id, result: onElicitation(message.params) });
        } else if (message.id === 2) {
          child.kill();
          resolve({ seen, callResult: message.result });
        }
      }
    });

    child.on('error', reject);

    send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: clientCapabilities, clientInfo: { name: 't', version: '0' } },
    });
    send({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'doox_form',
        arguments: {
          title: 'Nghiên cứu thị trường',
          fields: [
            { name: 'thiTruong', label: 'Thị trường', type: 'text' },
            { name: 'mtChonSite', label: 'Chọn site', type: 'checkbox' },
          ],
        },
      },
    });
  });
}

// A client that supports elicitation gets a form, and the answers reach the caller.
{
  const { seen, callResult } = await talk({ elicitation: {} }, (params) => {
    assert.equal(params.title, 'Nghiên cứu thị trường', 'title must be sent — Cowork rejects the call without it');
    assert.equal(params.requestedSchema.properties.thiTruong.type, 'string');
    return { action: 'accept', content: { thiTruong: 'Toronto', mtChonSite: true } };
  });

  assert.ok(seen.some((m) => m.method === 'elicitation/create'), 'no elicitation was sent');
  const payload = JSON.parse(callResult.content[0].text);
  assert.deepEqual(payload, { ok: true, answers: { thiTruong: 'Toronto', mtChonSite: true } });
  assert.ok(!callResult.isError);
}

// A client without the capability is told to fall back, and no form is attempted.
{
  const { seen, callResult } = await talk({}, () => assert.fail('must not elicit without the capability'));

  assert.ok(!seen.some((m) => m.method === 'elicitation/create'));
  const payload = JSON.parse(callResult.content[0].text);
  assert.equal(payload.ok, false);
  assert.match(payload.reason, /did not declare the `elicitation` capability/);
  assert.ok(callResult.isError);
}

// A declined form is not silently read as empty answers.
{
  const { callResult } = await talk({ elicitation: {} }, () => ({ action: 'decline' }));
  const payload = JSON.parse(callResult.content[0].text);
  assert.equal(payload.ok, false);
  assert.match(payload.reason, /decline/);
}

console.log('doox-forms: all checks passed');
