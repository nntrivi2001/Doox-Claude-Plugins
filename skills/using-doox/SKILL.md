---
name: using-doox
description: Conventions shared by every Doox skill — which Doox skill answers which request, the first-run questions to ask when the user's identity is not yet known, how a plan file's name encodes its market and project, how to read and join the two sheets of a plan file, where each field comes from, and what counts as done. Use before reporting on, reminding from, or archiving a plan file, and whenever a Doox skill needs the market name or a field out of the file.
---

# Using Doox

Shared conventions. Individual skills carry their own logic; anything more than one of them relies on
belongs here.

## Which skill does what

| Skill | Use it when | Output |
|---|---|---|
| `using-doox` | always, before the others | nothing — conventions only |
| `project-report` | the user asks how one market's project is doing, or hands over a plan file and asks for the report | 4 tables in the customer's template, in the chat reply |
| `reminder` | the user asks what has to be handled today, asks to remind the PICs, or the 9am run fires | PM: one table across their markets + a Gmail draft per PIC (gửi khi PM yêu cầu). Chuyên gia: their own tables, no mail |
| `market-research` | the user names a target market and asks to research it, or asks for a market report | a new `.xlsx` built from the saved report framework, filled, every figure sourced |
| `project-update` | the user reports a change to a task — done, pending, slipped, blocked, deadline moved | the confirmed cells written into the plan files, and a report of what changed. The only skill that writes to a plan file |
| `project-insights` | the user asks what is stuck or going wrong, asks to summarise/classify issues, asks what finished projects taught, asks how far along a project is, or hands over a plan file with every task done | 4 sections in the chat reply — open issues by work area and issue type, past issues and their patterns, lessons across the archived plans, progress forecast. No mail, ever |

`project-report` reads **one** file and answers "where does this market stand"; `reminder` reads
**every** file in the project folder and answers "what has to happen today"; `project-insights` reads
every file too and answers "what is going wrong, of what kind, what was done about the same kind
before, and where this ends up"; `project-update` is the only one that **writes** — it changes the
cells the user named, after confirming them. Do not use one to approximate the other — a reminder is
not a shortened progress report, a progress report of one market does not tell a PIC what is due,
neither of them classifies an issue or forecasts anything, and none of them edits a cell.

## Plan file naming

```
[Thị trường] - [Tên dự án] - [Tên PM]
```

**The extension is optional and is not part of the convention.** A native Google Sheets file has no
extension at all — `Bo Bien Nga - Ke hoach lap dat tram sac - Do Hoang Tung` is a plan file, and
requiring `.xlsx` is what makes a run report "no plan file found" while the file sits in the folder.
Strip a trailing `.xlsx`/`.xls`/`.xlsm` if there is one, then split. A plan file is any spreadsheet
whose name splits into the three parts — Google Sheets
(`application/vnd.google-apps.spreadsheet`) and Excel alike.

Example — `Bo Bien Nga - Ke hoach xay dung tram sac EV - Nguyen Van A`:

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

Before joining, check the two sheets line up by **comparing the STT columns — the raw numbering cells
(`A`, `II`, `3.1`, `5.1.2`…) of one sheet against the other, row index by row index, over the full
sheet.** STT is not usable as a join key, but as an alignment check it is the right column: it is
present on section rows and stub rows alike, it is short, and a shift shows up at the first row
where the two disagree.

**Do not compare "how many rows have data".** Each sheet carries its own columns, filled to its own
extent — a stub row may be blank in the detail sheet and hold a `FALSE` checkbox in the control one,
and either sheet may run further with formatting or stray cells. Counting rows that way gives two
different numbers for sheets that are perfectly aligned, and reports a mismatch that is not there.

**An STT cell filled on one sheet and empty on the other is not a mismatch.** The control sheet
leaves the level-3 numbering out on the rows where the detail sheet types it (8 rows of the reference
file, `3,1,1` through `4,1,4`) — the two sheets are perfectly aligned there and `Danh mục CV` on both
rows proves it. Compare only the row indexes where **both** sheets carry a value; treat a blank on
either side as agreement.

If the STT cells differ at some row index, the sheets are shifted — stop and report it, naming the
first row index that differs and quoting both values. A shifted join produces output that looks
fine and is wrong throughout. If every STT matches, the sheets are aligned: carry on and produce the
report. Never claim one sheet "has extra task rows" without that first differing row index.

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

## Writing a plan file

**`project-update` is the only skill that writes to a plan file. Every other skill is read-only** —
`reminder`, `project-report` and `project-insights` read and print, never touch a cell. A report
that "fixed a wrong date while it was in there" is a bug in that skill, not a service.

Plan files are co-authored — Google Drive, OneDrive, SharePoint — so a write lands in someone else's
file the moment it is saved. The rules that make it safe live in `project-update`, and hold for
anything that writes: write only the cells the user named and confirmed, keep the two sheets in step,
never rewrite a cell to "tidy" it.

**Where the write can land.** A file open through the local project folder — including a Drive /
OneDrive / SharePoint folder synced onto local disk — is written in place, and the sync carries it
up. A file reachable **only** through a connector cannot be written: the Drive connector reads,
searches, creates and copies, it has no cell-level update. Never fake it by creating a second file or
uploading a "corrected" copy — that splits the project across two files and the team keeps editing
the old one. Print the confirmed change-set for the user to apply by hand instead, and say plainly
that the file was not written.

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

Besides a plan file under `project-update`, this is the only file a Doox skill writes to.

### The README lives locally, never on a connector

**Absolute rule: never create, upload, copy, sync or update a `README.md` through a connector.** Not
Google Drive, not SharePoint, not OneDrive, not Dropbox, not Box, not a Gmail attachment, not any
other remote store reached through a connector or MCP server — whatever the connector is called and
however convenient it looks. The README is a local file in the local working folder, and that is the
only place it exists.

This holds even though `project-update` may write to a plan file: the plan file is the team's, the
README is not. A run that reads a plan file off Drive still keeps its README on the local disk. Never "put the README next to the plan file so the team can see it" — the identity fields it
carries decide what each person is allowed to see, and a copy on a shared drive is a copy anyone
there can edit.

No local disk to write to means writing nothing — keep it in the session and ask again next time.
Never fall back to a connector for lack of anywhere else.

**The README is internal. Never mention it to the user — not in any skill, not at any point.** Not
its name, not that one exists, not that one is missing, not that it is being read, written, or
searched for, not the identity fields kept in it. Lines like `Giờ tôi cần tìm folder dự án và file
README trên Google Drive trước khi đọc file kế hoạch` are the bug: they name an internal file, tell
the user where the identity check gets its answers, and point at a file they could edit to hand
themselves a role.

Say what is being done in terms of the user's own request instead — `Đang đọc file kế hoạch của thị
trường Bo Bien Nga` — or say nothing. Reading and updating the README happens silently, with no
narration before, during, or after. The same holds for tool-call narration: do not announce the
folder listing or the file read that finds it.

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
all the same case.

**This is the first step of every run that touches a plan file, and it is a gate.**
`market-research` is the exception: it reads no plan file and shows nobody's rows, so it runs without
the gate, for either role. Settle who is running this before
anything else happens — before listing the project folder, before opening a plan file, before
parsing a sheet, before counting a task, before printing a table, before drafting mail. Nothing about
a plan file is read or shown while any of the three facts is missing, and a `Chuyên gia` has no rows
selected for them until their PIC is settled too. Do not "get a head start" on the file while waiting
for the answer: work done before the identity is known is work that may belong to someone else, and a
report printed first cannot be un-shown once the role turns out to be wrong.

Once the answers are in and the role has passed its check, carry on with the run that was
interrupted, from the beginning.

**How to ask depends on the harness.** Never a numbered list of questions in prose, in either case.

**Cowork — one form, all three fields.** Cowork has MCP elicitation and must use it (it asks nothing
in prose). Pass `title` explicitly on the call, set to `Người dùng` — it is a required parameter and
leaving it out fails validation, so the form never reaches the user. Put every missing fact in that
single form, then wait for it to come back filled:

| Field | Type | Placeholder / options |
|---|---|---|
| Họ và tên của bạn | free text | `Nguyễn Văn A` |
| Email của bạn | free text | `ban@example.com` |
| Vai trò / chức vụ của bạn? | choice | `Project Manager`, `Chuyên gia` |

That order is fixed: the role goes last, after the two text fields — not first.

**All three fields go in, in that order.** Email is a field of its own and is dropped the most often
— a form showing `Họ và tên` and `Vai trò` but no `Email` is broken and has to be asked again. Count
the fields against the table before sending the form.

**Chat (claude.ai, Claude Code) — two steps.** No form holding text fields and a choice together, so
split it.

Step 1 — the role, always through a picker: `AskUserQuestion` in Claude Code, the picker on
claude.ai. The question is `Vai trò / chức vụ của bạn?`, with exactly two options:

- `Project Manager`
- `Chuyên gia`

Do not type the two options out as text for the user to answer in a sentence. A role asked without a
picker is a bug. Wait for the pick before asking anything else.

Step 2 — name and email, only after the role came back, as plain text in exactly this wording and
nothing else:

```
Mình cần thêm một số thông tin sau:
  Họ và tên của bạn:
  Email của bạn:
Bạn vui lòng cung cấp thêm các thông tin trên để tiếp tục nhé.
```

In both cases: the role is a choice between exactly those two options — do not offer a third and do
not infer it from anything else. Include only what is missing. A README holding the name and email
but no role is the role question alone; one holding the role but no email is the text question alone,
with just the missing line.

Do not carry on with a partial set. An answer that leaves a field blank is asked again, holding just
that field.

**Ask the questions bare.** One line may go before the form, and it is exactly this one:

```
Cho mình xin thông tin của bạn trước khi bắt đầu nhé
```

Nothing else — no explanation of why the information is needed, no mention of a missing README or of
a Doox convention, no line after the form telling the user to fill it in. Print no preamble, no
parenthetical, no footnote explaining what the answers are for:

- Never say the name will be checked against anything, never mention that the filename carries a PM
  name, never hint that a wrong name will be caught.
- Never describe what each role gets to see. "PM thấy toàn bộ, Chuyên gia chỉ thấy dòng của mình" is
  an instruction on which answer unlocks more.
- Never offer to look a PIC code up from a name or email at this point, and never list the codes
  found in the files.

A user who is told the name is verified against the file learns exactly which name to type, and the
check stops being a check.

Write the answers into the README, then carry on with the run that was interrupted.

### Matching the user to a PIC

The plan file names people in `Người phụ trách` / `Người hỗ trợ` by a short name — `Doox1`–`Doox10`,
`Qn1`–`Qn10`, `Thầu`, sometimes a real person's name. It is a name, not an opaque code, and it is
usually derivable from what the user just typed. For a role of `Chuyên gia`, **match it yourself
first; asking is the fallback, not the first move.**

Collect every distinct PIC value across all files, then try these in order, all comparisons ignoring
case, diacritics, spaces, dots and hyphens:

1. **Email local part** — the part before `@`. `doox1@gmail.com` → `doox1` → PIC `Doox1`.
2. **Email or name written beside the PIC** in the same cell, where the file carries one.
3. **The user's name** against the PIC value — both the full name and its last word
   (`Đỗ Hoàng Tùng` → `tung`).

**Every one of these requires the whole value to be equal, never a prefix.** `doox1` matches `Doox1`
and nothing else — `Doox10` is a different person, and a prefix match hands one specialist another's
rows.

Exactly one PIC matched — take it, record it as `Mã PIC` in the README, say nothing about how it was
found, and stop matching on later runs.

Two or more matched, or none did — ask, with a picker.

**The picker offers the likeliest candidates, not the whole list.** Rank by how close each PIC is to
the email local part and the name — shared prefix, shared digits, edit distance — and offer the top
few, plus the harness's own free-text escape. Only when nothing resembles the user at all does the
picker fall back to every PIC found in the files.

The question is bare: `PIC của bạn là gì?` — and in Cowork this picker is an elicitation call too,
so it carries a `title` of `Người dùng` like the identity form. Do not explain why the automatic
match failed, do not
say the file carries no email or name beside the PIC, do not describe what was searched — that
narrates the file's structure and tells the user which answer would have worked.

Record the answer.

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

Then ask again the same way the harness asks: in Cowork, one form holding the role and the name; in
chat, the role picker first — so the user can pick `Chuyên gia` instead — then the name line if they
stay on `Project Manager`. Do not proceed to a report, a reminder, or a draft in the meantime, and do not
fall back to showing a specialist's view of data they have not been matched to. A failed check that
still prints something is not a check.

Write nothing to the README until a check passes — a rejected claim must not be recorded as fact and
must not persist into the next run.

### What each role sees

Internal — this table decides what to print. Do not recite it to the user, least of all while asking
for their role.

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

**The third part of the filename stays out of that line, and out of every other line printed before
the user has been verified.** Market and project only. Do not print the raw filename either — it
carries the PM name, and a line that quotes the filename hands over the answer to the check the
skill is about to run. After a `Project Manager` has matched, their own name is theirs to see; a
`Chuyên gia` never needs it.
