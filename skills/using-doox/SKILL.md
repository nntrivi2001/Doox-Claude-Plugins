---
name: using-doox
description: Conventions shared by every Doox skill — how a plan file's name encodes its market and project, and what to do when a file does not follow the convention. Use before reporting on, reminding from, or archiving a plan file, and whenever a Doox skill needs the market or project name.
---

# Using Doox

Shared conventions. Individual skills carry their own logic; anything more than one of them relies on
belongs here.

## Plan file naming

```
[Thị trường] - [Tên dự án].xlsx
```

Example — `Bo Bien Nga - Ke hoach xay dung tram sac EV.xlsx`:

| Field | Value |
|---|---|
| Thị trường | `Bo Bien Nga` |
| Tên dự án | `Ke hoach xay dung tram sac EV` |

Split on the **first** ` - ` — space, hyphen, space. Everything before it is the market, everything
after it (minus the extension) is the project name. Splitting on the first separator matters: a
project name may contain further hyphens, a market name will not.

The separator needs a space on both sides. A bare hyphen is part of a name, not a separator:
`HerioGreen-Vietnam.xlsx` has no separator at all and yields nothing.

Trim whitespace from both parts. Names carry no diacritics and follow no capitalisation rule — pass
them through exactly as written, do not "correct" `Bo Bien Nga` into `Bờ Biển Ngà`.

Ignore Excel lock files: `~$…` and `.~lock.…#`.

## The project README

The Cowork project folder — the one holding the plan files — carries a `README.md` describing what
is in it. **Read it before doing anything else**, and update it whenever the run turned up something
it does not yet say.

It holds what cannot be re-derived by looking at the files: which markets and projects are live and
which file each lives in, naming conventions in use, quirks of the customer's template found the
hard way, and decisions the user has settled. Not a changelog, not a run history, not a copy of the
data — a picture of the current state that a new session can be handed.

Update it when a run reveals:

- a new plan file, a renamed one, a new market or project;
- something about the data worth not rediscovering — a duplicated label, a status column that
  disagrees with a checkbox, a sheet that changed shape;
- a convention or rule the user has just settled.

Rewrite the affected lines rather than appending; a README that only grows stops being read. If the
folder has no `README.md`, create it.

This is the one file a Doox skill writes to. Plan files are read-only — several people co-author
them on SharePoint, and writing to one destroys someone else's edit.

## When a file does not match a convention

Ask the user. Never guess a market from a filename with no separator, and never fall back to the
whole filename — a report published under the wrong market is worse than one that stopped to ask.

## Say what was read

State the reading before acting on it, one line:

```
Thị trường: Bo Bien Nga | Dự án: Ke hoach xay dung tram sac EV (từ tên file)
```

A wrong reading then shows up immediately, instead of after a full report has been built on it.
