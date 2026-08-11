---
name: reminder
description: Read every market's plan file (.xlsx) in the project folder and produce the daily reminder — the PM's full table, or a specialist's own tasks — and on a PM run draft one Gmail per PIC. Use when the user asks what has to be done today, asks to remind the team, or runs the 9am reminder.
---

# Reminder

## 1. When to use

The user asks what has to be handled today, asks to remind the PICs, or the 9am scheduled run fires.

## 2. Input

Every plan file in the Cowork project folder, not one file. Use the `using-doox` skill: read the
project `README.md` first, settle who is running this, then take each `.xlsx` whose name follows
`[Thị trường] - [Tên dự án] - [Tên PM].xlsx`, ignoring lock files (`~$…`, `.~lock.…#`). The market
read from each filename fills the `Thị trường` column, so every row can be traced back to its file.

A `Project Manager` run covers only the files whose `Tên PM` matches them. A `Chuyên gia` run covers
every file, filtered to their own rows.

A file that does not follow the convention is not silently skipped and not guessed at — ask the user
about it, then carry on with the rest.

## 3. Reading a plan file

Per `using-doox`, section "Reading a plan file" — the join by row position, the built STT, the
required columns, the section-heading rows to drop, which sheet each field comes from, and what
counts as done. Follow it rather than inventing a second reading, and report the column mapping one
line per file before printing anything.

The reminder prints no STT column, but still build it: it is the only key that identifies a row when
the user asks about one.

## 4. Which tasks appear

A task appears when it is **not done** — per `using-doox` — and at least one of:

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

Needed on a `Project Manager` run only — that is the only run that writes mail. Skip this section
entirely on a `Chuyên gia` run.

The PIC cell holds an anonymised code — `Doox1`–`Doox10`, `Qn1`–`Qn10`, `Thầu`. The email address is
typed **once, on one row**, next to its code; every other row carries the bare code.

So build the directory before drafting: scan every row of every file, collect each `code → email`
pair found, and apply it to all rows carrying that code. The cell separates code from email four
different ways — a newline, an en dash `–` (U+2013, not the ASCII `-`), parentheses, or nothing but a
space. Handle all four; matching only the ASCII hyphen drops most of the file.

`Thầu` is a contractor, not a person, and has no personal address. Its rows appear in the PM table
and get no mail. A `Chuyên gia` therefore never sees `Thầu` rows unless their own code supports one.

A code with no email anywhere in the files still has its rows in the PM table. It gets no draft, and
it is listed at the end of the report so the user can fill the address in. Never guess an address.

## 6. Output

**The report is the chat reply itself.** Produce no `.docx`, `.md`, `.pdf` or `.xlsx`, and do not
offer to. Print both sections in full, every row, every column, each cell carried whole — only
collapsing newlines inside a cell so the Markdown row stays valid. An empty cell prints as `-`.
Dates print as `dd/mm/yyyy`.

Opening line, verbatim:

```
Các công việc cần xử lý trong ngày:
```

Then the heading for the one section this run prints, written exactly as one of:

```
1. Đối với PIC:
2. Đối với PM:
```

Keep the number that belongs to the section — a PM run prints `2. Đối với PM:` and no `1.`.

**A run prints one of the two sections, never both** — which one comes from `using-doox`, "Who is
running this". Print the identity line first, then:

- `Project Manager` — **mục 2 only**: the single twelve-column table below, every row of every file
  whose `Tên PM` matches them, `Thầu` included. No mục 1, no per-PIC tables.
- `Chuyên gia` — **mục 1 only**: their own table (rows where their code is `Người phụ trách`) and,
  below it, a second table headed `Hỗ trợ` for rows where their code is `Người hỗ trợ`. No other
  code's table, and no mục 2 — the PM view is not theirs to read.

An empty `Hỗ trợ` table is dropped rather than printed as `_(không có)_`; a specialist supporting
nobody today does not need to be told so twice.

Mục 1, eleven columns — no `PIC` column, the heading already says whose table it is:

| Thị trường | Danh mục công việc | Ngày bắt đầu | Ngày kết thúc | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|---|

Mục 2, twelve columns — every row of the PM's markets, `Thầu` included, `PIC` inserted third:

| Thị trường | Danh mục công việc | PIC | Ngày bắt đầu | Ngày kết thúc | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|---|---|

`Phương án triển khai`, `Tiêu chuẩn hoàn thành` and `Rủi ro` run to several hundred characters —
print them whole. `Hiện trạng vấn đề`, `Vấn đề phát sinh`, `Phương án xử lý` and `Ghi chú` come from
the control sheet and are empty on most rows — print `-`, never invent content.

**Print the report even when nothing is due.** The heading, then `_(không có)_`. The 9am run is
unattended and Cowork does not report a failed task, so a morning with no message has to mean the run
broke, never "nothing to do today".

On a PM run, after mục 2: the list of PIC codes with no email, if there are any. A specialist sees
only their own address status, not the team's.

## 7. Mail

**Only a `Project Manager` run writes mail.** One Gmail **draft** per PIC code that has an email and
at least one row due: recipient that address, body that code's table in the mục 1 layout (eleven
columns, no `PIC` column), subject `Nhắc việc [dd/mm/yyyy]`.

Building those per-code tables is the one thing a PM run does beyond printing mục 2 — the report
stays a single table, the mail does not.

**Draft, never send.** The run stops at the drafts every time, including the unattended 9am one. A
draft costs a click; a wrong mail already in a PIC's inbox cannot be recalled.

**Send only when the PM asks for it in that turn** — `gửi đi`, `gửi mail cho PIC` and the like.
Then send the drafts already built, and only those: no re-reading, no new recipient, no address that
was not read out of a plan file, nothing to `Thầu` or to a code whose email is missing. An
instruction to send given in an earlier turn does not carry over to the next run — the request is per
run, and silence is not a request.

**A `Chuyên gia` run writes no mail at all.** No draft to the team, none to themselves. They read
their tables in the chat reply and that is the whole delivery. Do not offer to draft one either, and
a `Chuyên gia` asking to send is refused: mail on this project goes out from the PM.

No draft for the mục 2 table, none for `Thầu`, none for a code with no address.

Say how many drafts were created and to which addresses, after the report — and after a send, say
what went out and to whom.

## 8. Boundaries

Plan files are read-only — several people co-author them on SharePoint, and a write destroys someone
else's edit. The one file a Doox skill writes is the project `README.md`, per `using-doox`.
