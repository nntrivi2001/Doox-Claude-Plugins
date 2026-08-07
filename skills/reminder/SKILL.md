---
name: reminder
description: Read every market's plan file (.xlsx) in the project folder and produce the daily reminder — what each PIC has to handle today, plus the PM's full view — then draft one Gmail per PIC. Use when the user asks what has to be done today, asks to remind the team, or runs the 9am reminder.
---

# Reminder

## 1. When to use

The user asks what has to be handled today, asks to remind the PICs, or the 9am scheduled run fires.

## 2. Input

Every plan file in the Cowork project folder, not one file. Use the `using-doox` skill: read the
project `README.md` first, take each `.xlsx` whose name follows `[Thị trường] - [Tên dự án].xlsx`,
ignore lock files (`~$…`, `.~lock.…#`). The market read from each filename fills the `Thị trường`
column, so every row can be traced back to its file.

A file that does not follow the convention is not silently skipped and not guessed at — ask the user
about it, then carry on with the rest.

## 3. Reading a plan file

Identical to the `progress-report` skill, section 3 — read it and follow it rather than inventing a
second reading. In particular: join the two sheets **by row position**, build STT from the nearest
section marker (`II` + `3.1` = `II.3.1`, commas normalised to dots), and drop section-heading rows
from every table and every count.

Report the column mapping per file before printing anything, one line each.

## 4. Which tasks appear

A task appears when it is **not done** — failing `checkbox TRUE` **and** text `Hoàn thành`, the same
rule as `progress-report` — and at least one of:

| Case | Condition |
|---|---|
| Quá hạn | Ngày kết thúc < today |
| Sắp đến hạn | today ≤ Ngày kết thúc ≤ today+3 |
| Bắt đầu hôm nay | Ngày bắt đầu = today |

Nothing else. A task that started last week and is due next month is being worked on, not something
the reminder has to raise; it would repeat every morning until the day it matters and train the
reader to stop opening the mail.

Order the rows: quá hạn first, then by `Ngày kết thúc` ascending, then by `Thị trường`.

The 3-day threshold comes from `idea.txt` (`ngày hoàn thành - 3 ngày`).

## 5. PIC codes and their emails

The PIC cell holds an anonymised code — `Doox1`–`Doox10`, `Qn1`–`Qn10`, `Thầu`. The email address is
typed **once, on one row**, next to its code; every other row carries the bare code.

So build the directory before printing: scan every row of every file, collect each `code → email`
pair found, and apply it to all rows carrying that code. The cell separates code from email four
different ways — a newline, an en dash `–` (U+2013, not the ASCII `-`), parentheses, or nothing but a
space. Handle all four; matching only the ASCII hyphen drops most of the file.

`Thầu` is a contractor, not a person, and has no personal address. Its rows go into the PM table
only — no `Thầu` section under mục 1, no mail.

A code with no email anywhere in the files still gets its section in mục 1 and still appears in the
PM table. It gets no draft, and it is listed at the end of the report so the user can fill the
address in. Never guess an address.

## 6. Output

**The report is the chat reply itself.** Produce no `.docx`, `.md`, `.pdf` or `.xlsx`, and do not
offer to. Print both sections in full, every row, every column, each cell carried whole — only
collapsing newlines inside a cell so the Markdown row stays valid. An empty cell prints as `-`.
Dates print as `dd/mm/yyyy`.

Opening line, verbatim:

```
Các công việc cần xử lý trong ngày:
```

Then two sections:

```
1. Đối với PIC:
2. Đối với PM:
```

**Mục 1 repeats per PIC code** — one heading holding the code, then that code's table. A code with
matching rows always gets a section; codes are ordered as they first appear in the files.

Mục 1, eleven columns — no `PIC` column, the heading already says whose table it is:

| Thị trường | Danh mục công việc | Ngày bắt đầu | Ngày kết thúc | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|---|

Mục 2, twelve columns — every row from every market, `Thầu` included, `PIC` inserted third:

| Thị trường | Danh mục công việc | PIC | Ngày bắt đầu | Ngày kết thúc | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|---|---|

`Phương án triển khai`, `Tiêu chuẩn hoàn thành` and `Rủi ro` run to several hundred characters —
print them whole. `Hiện trạng vấn đề`, `Vấn đề phát sinh`, `Phương án xử lý` and `Ghi chú` come from
the control sheet and are empty on most rows — print `-`, never invent content.

**Print the report even when nothing is due.** Both headings, each with `_(không có)_`. The 9am run
is unattended and Cowork does not report a failed task, so a morning with no message has to mean the
run broke, never "nothing to do today".

After mục 2: the list of PIC codes with no email, if there are any.

## 7. Mail

One Gmail **draft** per PIC code that has an email and at least one row — recipient that address,
body that code's mục 1 table, subject `Nhắc việc [dd/mm/yyyy]`. Do not send. The user reads the
drafts and sends them; automatic sending waits until the content has been signed off.

No draft for the PM table, none for `Thầu`, none for a code with no address.

Say how many drafts were created and to which addresses, after the report.

## 8. Boundaries

Plan files are read-only — several people co-author them on SharePoint, and a write destroys someone
else's edit. The one file a Doox skill writes is the project `README.md`, per `using-doox`.
