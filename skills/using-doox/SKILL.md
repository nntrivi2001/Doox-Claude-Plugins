---
name: using-doox
description: Conventions shared by every Doox skill — which Doox skill answers which request, the first-run questions to ask when the project folder has no README yet, how a plan file's name encodes its market and project, how to read and join the two sheets of a plan file, where each field comes from, and what counts as done. Use before reporting on, reminding from, or archiving a plan file, and whenever a Doox skill needs the market name or a field out of the file.
---

# Using Doox

Shared conventions. Individual skills carry their own logic; anything more than one of them relies on
belongs here.

## Which skill does what

| Skill | Use it when | Output |
|---|---|---|
| `using-doox` | always, before the others | nothing — conventions only |
| `progress-report` | the user asks how one market's project is doing, or hands over a plan file and asks for the report | 4 tables in the customer's template, in the chat reply |
| `reminder` | the user asks what has to be handled today, asks to remind the PICs, or the 9am run fires | one table per PIC + one PM table across every market, plus a Gmail draft per PIC |

`progress-report` reads **one** file and answers "where does this market stand"; `reminder` reads
**every** file in the project folder and answers "what has to happen today". Do not use one to
approximate the other — a reminder is not a shortened progress report, and a progress report of one
market does not tell a PIC what is due.

## Plan file naming

```
[Thị trường] - [Tên dự án] - [Tên PM].xlsx
```

Example — `Bo Bien Nga - Ke hoach xay dung tram sac EV - Nguyen Van A.xlsx`:

| Field | Value |
|---|---|
| Thị trường | `Bo Bien Nga` |
| Tên dự án | `Ke hoach xay dung tram sac EV` |
| Tên PM | `Nguyen Van A` |

Split on ` - ` — space, hyphen, space. **Everything before the first separator is the market,
everything after the last is the PM, everything between them is the project name.** Taking the outer
two first matters: a project name may hold further ` - ` separators, a market name and a PM name will
not.

The separator needs a space on both sides. A bare hyphen is part of a name, not a separator:
`HerioGreen-Vietnam.xlsx` has no separator at all and yields nothing.

Fewer than two separators means the name does not follow the convention — ask the user, do not
treat the last part as a PM name that happens to be a project name.

Trim whitespace from all three parts. Names carry no diacritics and follow no capitalisation rule —
pass them through exactly as written, do not "correct" `Bo Bien Nga` into `Bờ Biển Ngà`.

Ignore Excel lock files: `~$…` and `.~lock.…#`.

## Reading a plan file

Every skill reads a plan file the same way. This section is the only description of it — a skill
that needs a field takes it from here.

The data lives in two sheets and has to be joined:

- The plan detail sheet — Danh mục CV, Phương án triển khai, Tiêu chí hoàn thành, Người phụ trách,
  Người hỗ trợ, Ngày bắt đầu, Ngày kết thúc, **Trạng thái (text)**, Rủi ro, Ghi chú.
- The control sheet — Cập nhật hiện trạng, Vấn đề phát sinh, **Trạng thái (checkbox TRUE/FALSE)**,
  Phương án giải quyết.

**Join the two sheets by row position** — row *n* of the detail sheet is row *n* of the control
sheet. Both other keys are broken on real files: STT restarts at every section, and `Danh mục CV`
repeats (on the reference file 4 labels cover 14 rows, e.g. `Nghiệm thu giấy phép` appears 4 times,
so joining by label silently merges four different tasks into one).

Before joining, check the two sheets have the same row count and that `Danh mục CV` matches row by
row. If they diverge, stop and report it — a shifted join produces output that looks fine and is
wrong throughout.

Five required columns: **Danh mục công việc**, **Trạng thái (text)**, the **checkbox**, **Ngày bắt
đầu**, **Ngày kết thúc**. If any one of them is missing, stop and ask the user — do not guess.

Report which columns were matched before printing anything, e.g. `sheet 'KH Bảng 3 - Chi tiết' cột
J = Ngày kết thúc`. One line per file.

A row with no Danh mục CV, or with a Danh mục but both date cells empty, is a section heading
(`A`, `1`, `2`…). It is not a task: drop it from every table and from every count.

**Where each field comes from.** The two sheets both carry `Ngày bắt đầu`, `Ngày kết thúc`,
`Trạng thái` and `Ghi chú` under the same name — take each from the sheet named here, not from
whichever one is found first:

| Field | Sheet | Source column |
|---|---|---|
| STT | detail | built, see below |
| Danh mục công việc | detail | `Danh mục CV` |
| PIC | detail | `Người phụ trách` |
| Ngày bắt đầu / Ngày kết thúc | detail | same names |
| Phương án triển khai | detail | `Phương án triển khai` |
| Tiêu chuẩn hoàn thành | detail | `Tiêu chí hoàn thành/ bằng chứng xác nhận` |
| Rủi ro | detail | `Rủi ro` |
| Trạng thái (text) | detail | `Trạng thái` |
| Hiện trạng vấn đề | control | `Cập nhật hiện trạng` |
| Vấn đề phát sinh | control | `Vấn đề phát sinh` |
| Phương án xử lý | control | `Phương án giải quyết` |
| Ghi chú | control | `Ghi chú` |
| checkbox | control | `Trạng thái` |

**STT is built, not copied.** The numbering sits in several columns — a section marker (`A`, `B`,
`I`, `II`…), then level-2 numbers (`3.1`), then level-3 (`5.1.2`). Print the nearest section marker
above the row, a dot, then the row's own number: `II` + `3.1` = `II.3.1`. Only letters and Roman
numerals are section markers; a purely numeric heading (`1`, `2`, `3`) is a sub-group, not a section.
Without the prefix, `3.1` appears many times over and no row can be identified.

Some level-3 numbers are typed with commas instead of dots — `3,1,1` where `3.1.1` was meant (8 of 28
on the reference file). Normalise commas to dots, so the printed STT reads `II.3.1.1`.

**Done = the checkbox is TRUE *and* the text column reads `Hoàn thành`.** The checkbox alone is not
enough, and a past end date is not a completion signal at all. Anything failing either condition
counts as not done. The text column holds three values: `Chưa triển khai`, `Đang triển khai`,
`Hoàn thành`.

Dates print as `dd/mm/yyyy` everywhere.

## The project README

The Cowork project folder — the one holding the plan files — carries a `README.md` describing what
is in it. **Read it before doing anything else**, and update it whenever the run turned up something
it does not yet say. If there is no `README.md` at all, see "Who is running this" below before
anything else.

It holds what cannot be re-derived by looking at the files: which markets and projects are live and
which file each lives in, naming conventions in use, quirks of the customer's template found the
hard way, and decisions the user has settled. Not a changelog, not a run history, not a copy of the
data — a picture of the current state that a new session can be handed.

Update it when a run reveals:

- a new plan file, a renamed one, a new market or project;
- something about the data worth not rediscovering — a duplicated label, a status column that
  disagrees with a checkbox, a sheet that changed shape;
- a convention or rule the user has just settled.

Rewrite the affected lines rather than appending; a README that only grows stops being read.

This is the one file a Doox skill writes to. Plan files are read-only — several people co-author
them on SharePoint, and writing to one destroys someone else's edit.

## Who is running this

Every Doox skill shows the user their own work, not everyone's. That needs three facts, and they
live in the README:

```markdown
## Người dùng
- Tên: Nguyễn Văn A
- Email: a.nguyen@example.com
- Vai trò: Project Manager
- Mã PIC: Doox3          <!-- chỉ với vai trò Chuyên gia -->
```

**Missing the section, or missing any one of those lines, means asking — no matter which run this
is.** No `README.md` at all, a README with no `## Người dùng`, a section with a name but no email:
all the same case. Stop before reading a plan file, before printing anything, before drafting mail.

**Ask one question at a time.** Put the question, wait for the answer, then ask the next. Do not
batch them into one message and do not carry on with a partial set.

1. Tên của bạn là gì?
2. Email của bạn là gì?
3. Vai trò/chức vụ của bạn — `Project Manager` hay `Chuyên gia`?

Question 3 is a choice between exactly those two; do not offer a third and do not infer the answer
from anything else. Ask only the lines that are missing — a README holding the name and email but no
role gets one question, not three.

Write the answers into the README, then carry on with the run that was interrupted.

### Matching the user to a PIC code

The plan file names people by anonymised code (`Doox1`–`Doox10`, `Qn1`–`Qn10`, `Thầu`), sometimes
with a name or an email beside the code. For a user whose role is `Chuyên gia`, find their code:
match their email first, their name second, against every PIC cell in every file.

Found — record it as `Mã PIC` in the README and stop matching on later runs.

Not found — **stop and ask which code is theirs**, offering the codes that actually occur in the
files. Do not fall back to showing everything, and do not guess from a partial name match: `Doox1`
and `Doox10` are different people. Record the answer.

A `Project Manager` has no `Mã PIC` line and needs no match — but the claim itself gets checked, see
below.

### Verifying a claimed Project Manager

The real PM's name is in the filename, the third part of `[Thị trường] - [Tên dự án] - [Tên PM]`. A
user who answers `Project Manager` is checked against it before they are shown anything.

Compare their `Tên` with the `Tên PM` of the files they are asking about. Ignore case, ignore
diacritics, ignore repeated whitespace; require the rest to match. Matching one file grants the PM
view of that file only — a PM of the Bo Bien Nga market is not the PM of every market, so the
reminder covers just the files where the name matches.

**No match anywhere — refuse, and reveal nothing:**

> Tên bạn khai không khớp với PM của file kế hoạch. Vui lòng khai báo lại thông tin hoặc chọn lại vai
> trò.

**Never print, quote, hint at, or partially reveal the real PM name in this situation** — not the
name, not its initials, not its length, not "gần đúng", not a list of the PM names available to pick
from, not the filename that contains it. Someone who can guess names and read the failure messages
must learn nothing about which guess was closer. State only that the claim did not match.

Then ask again, one question at a time, exactly as above: the user re-enters their name, or picks
`Chuyên gia` instead. Do not proceed to a report, a reminder, or a draft in the meantime, and do not
fall back to showing a specialist's view of data they have not been matched to. A failed check that
still prints something is not a check.

Write nothing to the README until a check passes — a rejected claim must not be recorded as fact and
must not persist into the next run.

### What each role sees

| Role | Sees |
|---|---|
| `Project Manager` | every row of the files whose `Tên PM` matches their name |
| `Chuyên gia` | only rows where their code is `Người phụ trách`, plus rows where it is `Người hỗ trợ`, kept in a separate table |

This applies to every Doox skill, not just the reminder. State the identity in use before printing,
one line, so a wrong match shows up immediately:

```
Người dùng: Nguyễn Văn A (a.nguyen@example.com) | Vai trò: Chuyên gia | Mã PIC: Doox3
```

## When a file does not match a convention

Ask the user. Never guess a market from a filename with no separator, and never fall back to the
whole filename — a report published under the wrong market is worse than one that stopped to ask.

## Say what was read

State the reading before acting on it, one line:

```
Thị trường: Bo Bien Nga | Dự án: Ke hoach xay dung tram sac EV (từ tên file)
```

A wrong reading then shows up immediately, instead of after a full report has been built on it.
