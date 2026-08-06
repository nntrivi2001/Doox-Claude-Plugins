---
name: plan-file-naming
description: Read the market and the project name out of a plan file's filename, which follows `[Thị trường] - [Tên dự án].xlsx`. Use before reporting on, reminding from, or archiving a plan file, whenever the market or project name is needed and the user has not stated it.
---

# Plan file naming

## Convention

```
[Thị trường] - [Tên dự án].xlsx
```

Example — `Bo Bien Nga - Ke hoach xay dung tram sac EV.xlsx`:

| Field | Value |
|---|---|
| Thị trường | `Bo Bien Nga` |
| Tên dự án | `Ke hoach xay dung tram sac EV` |

## Rules

Split on the **first** ` - ` — space, hyphen, space. Everything before it is the market, everything
after it (minus the extension) is the project name. Splitting on the first separator matters:
a project name may contain further hyphens, a market name will not.

The separator must have a space on both sides. A bare hyphen is part of a name, not a separator:
`HerioGreen-Vietnam.xlsx` has no separator at all and yields nothing.

Trim whitespace from both parts. Names carry no diacritics and no capitalisation rule — pass them
through exactly as written, do not "correct" `Bo Bien Nga` into `Bờ Biển Ngà`.

Ignore Excel lock files (`~$…`, `.~lock.…#`).

## When the name does not match

Ask the user for the market and the project name. Never guess from a filename that lacks the
separator, and never fall back to the whole filename as the market — a report published under the
wrong market is worse than one that stopped to ask.

## Output

State what was read before using it, e.g.:

```
Thị trường: Bo Bien Nga | Dự án: Ke hoach xay dung tram sac EV (từ tên file)
```

One line, so a wrong reading is visible immediately rather than after the whole report.
