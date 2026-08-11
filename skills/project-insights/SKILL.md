---
name: project-insights
description: Read the plan files and produce the issue summary — open issues grouped by work area and by issue type, past issues with what they had in common, lessons drawn across the finished plans, and a progress forecast per market. Use when the user asks what is going wrong on a project, asks for a summary or classification of issues or incidents, asks which issues are blocking, asks what past or finished projects can teach, asks how far along a project is or when it will finish, or hands over a plan file whose tasks are all done.
---

# Project insights

## 1. When to use

The user asks what is stuck, what problems the project is hitting, for a summary/classification of
issues, what finished projects can teach, or how far along a project is. `progress-report` answers
"where does this market stand" and `reminder` answers "what has to happen today"; this skill answers
"what is going wrong, of what kind, what was done about the same kind before, and where this ends
up".

Three jobs, one report, four sections:

| Section | Question | Runs on |
|---|---|---|
| Mục 1 | which issues are open, of what kind | unfinished projects |
| Mục 2 | which issues already happened here, what they had in common | the same file |
| Mục 3 | what the finished projects taught | the archive, ≥2 finished plans |
| Mục 4 | how far along, and will it land on time | unfinished projects |

**Mục 3 also runs on its own**, without the user asking: when the PM hands over a plan file whose
tasks are all done, print mục 3 straight away — see section 9.

## 2. Input

Every plan file in the Cowork project folder whose project is **not finished** — a project with at
least one task not done, per `using-doox`. A finished project — every task done — is an archive file
and feeds mục 3 only, never mục 1, 2 or 4.

Use the `using-doox` skill first: read the project `README.md`, settle who is running this, then take
each spreadsheet following `[Thị trường] - [Tên dự án] - [Tên PM]` — extension optional, Google
Sheets included, per `using-doox` — ignoring lock files. The market
read from each filename fills the `Thị trường` column.

A `Project Manager` run covers only the files whose `Tên PM` matches them. A `Chuyên gia` run covers
every file, filtered to rows where their code is `Người phụ trách` or `Người hỗ trợ`.

## 3. Reading a plan file

Per `using-doox`, section "Reading a plan file" — the join by row position, the built STT, the
required columns, the section-heading rows to drop, which sheet each field comes from, and what
counts as done. Report the column mapping, one line per file, before printing anything.

## 4. Which rows are issues

**A row is an issue when `Vấn đề phát sinh` is non-empty. That one column decides it, and nothing
else does.** It is where the PM writes down what went wrong on a task, so a row it leaves blank has
no issue to report, however the other columns read.

The three neighbouring columns are printed beside it, never used to select a row:

| Column | What it holds |
|---|---|
| `Vấn đề phát sinh` | the issue itself — **the selector** |
| `Phương án giải quyết` → `Phương án xử lý` | the fix the PM proposes for it |
| `Cập nhật hiện trạng` → `Hiện trạng vấn đề` | where the task stands right now |
| `Ghi chú` | anything else the PM noted |

`Cập nhật hiện trạng` mostly reads `Đã duyệt`, `Đang triển khai, trạng thái ổn định` — progress, not
a problem. A row carrying one of those and an empty `Vấn đề phát sinh` stays out of the report; on
the reference file that rule is the difference between 1 issue and 11. A task merely running late is
the `reminder`'s business, not an issue.

| Mục | Rows |
|---|---|
| 1 — đang diễn ra | issue rows **not done** |
| 2 — đã từng xảy ra | issue rows **done** |

Done is the `using-doox` definition and nothing looser: **checkbox TRUE and the text column reading
`Hoàn thành`, both**. A tick on its own does not close a task, so it does not close an issue either.

On real files the two disagree often — 9 rows of the reference file are ticked while the text still
says `Đang triển khai`. Those rows stay in mục 1, and each one is listed once after mục 2, under
`Cần cập nhật cột trạng thái`, with both values, so the PM can fix the file:

```
### Cần cập nhật cột trạng thái
- I.1.1 Xác nhận thông tin nhân sự và deal lương — đã tick, cột chữ ghi `Đang triển khai`
```

An empty list is dropped, not printed.

On the reference file exactly one row carries a `Vấn đề phát sinh`. That is the normal shape: print
what is there, print `_(không có)_` for the rest, never invent a row.

## 5. Classification

Two levels, and they are different things:

- **Nhóm việc** — the work area. It is not invented: it is the nearest section heading above the row
  in the detail sheet, the same row `using-doox` drops from the tables and takes the STT prefix from
  (`A. Thông tin chung`, `B. Pháp lý`…). Use its `Danh mục CV` text as the group name. Grouping by
  it is what separates one specialty from another.
- **Nhóm vấn đề** — the issue type, and this one **is** named by you, from what the issue texts have
  in common: `Hồ sơ pháp lý thiếu`, `Chờ đối tác phản hồi`, `Sai lệch thiết kế`, `Thiếu nhân sự`.
  Short noun phrase, Vietnamese, reused verbatim across every row that fits it — a name used once per
  row is not a classification. A single issue that resembles nothing else gets its own name; do not
  force it into a group to make the list shorter.

## 6. Deadline state

Computed against **today at run time**, on the `Ngày kết thúc` of the row, and printed inside that
cell:

| State | Cell |
|---|---|
| Ngày kết thúc < today | `21/08/2026 (quá hạn 3 ngày)` |
| today ≤ Ngày kết thúc ≤ today+3 | `27/08/2026 (còn 2 ngày)` |
| later, or no date | `27/08/2026`, or `-` |

Mục 1 rows sort by `Ngày kết thúc` ascending inside their group, so the overdue ones read first.

## 7. Output

**The report is the chat reply itself.** Produce no `.docx`, `.md`, `.pdf` or `.xlsx`, and do not
offer to. Every row, every column, each cell carried whole — only collapsing newlines inside a cell
so the Markdown row stays valid. An empty cell prints `-`. Dates print `dd/mm/yyyy`. Print the
identity line from `using-doox` first.

Opening line, verbatim:

```
Tổng hợp & phân loại vấn đề:
```

Then the four sections, headings written exactly, in this order, none renamed, none dropped:

```
1. Tổng hợp vấn đề trong quá trình triển khai dự án
2. Tổng hợp vấn đề đã từng xảy ra
3. Đúc kết từ các dự án đã hoàn thành
4. Dự báo tiến độ
```

A section with nothing to say still prints its heading and its own empty line — `_(không có)_` for
1 and 2, the `Chưa đủ dữ liệu` line for 3. A missing section reads as a broken run.

### Mục 1

One table per **Nhóm việc**, the group name as a `###` heading above it, so each specialty can be cut
out and sent on its own. Nine columns:

| Thị trường | STT | Danh mục công việc | PIC | Nhóm vấn đề | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ngày kết thúc |
|---|---|---|---|---|---|---|---|---|

Then, below the tables, the two long columns for the same rows — they run to several hundred
characters and would make the table unreadable, so they get their own block, one entry per row, keyed
by STT:

```
- II.3.1 — Chuẩn bị hồ sơ & đầu mối nộp hồ sơ
  Phương án triển khai: …
  Tiêu chuẩn hoàn thành: …
```

No issue anywhere: the heading, then `_(không có)_`, and mục 2 still prints.

### Mục 2

One table across all markets — past issues are read for the pattern, not per work area:

| Thị trường | Danh mục công việc | Nhóm vấn đề | Vấn đề phát sinh | Phương án xử lý | Phương án triển khai | Tiêu chuẩn hoàn thành |
|---|---|---|---|---|---|---|

Then two blocks, in this order and under these headings:

```
### Điểm chung
### Gợi ý phương án
```

**Điểm chung** — what the past issues share: which Nhóm vấn đề recurs, in which Nhóm việc, at which
stage of the project, whether the same PIC or the same partner is involved. One bullet per pattern,
each naming the rows it was drawn from. A pattern seen once is not a pattern — say so rather than
promoting it.

**Gợi ý phương án** — for each open issue in mục 1 whose `Nhóm vấn đề` also appears in mục 2, the
`Phương án xử lý` and `Phương án triển khai` that closed the past one, offered as the suggestion:

```
- II.3.1 (Hồ sơ pháp lý thiếu) — lần trước tại [Thị trường], [Danh mục công việc] xử lý bằng: …
```

**Mark it as a suggestion and keep it traceable to its source row.** Never write a recommendation
that is not carried by a past row, and never present one as a decision. An open issue whose group has
no precedent gets no bullet — an empty block prints `_(không có)_`.

### Mục 3 — Đúc kết từ các dự án đã hoàn thành

Heading, verbatim: `3. Đúc kết từ các dự án đã hoàn thành`. Built from the archive, per section 9.

**Fewer than two archived plans: print the heading and `Chưa đủ dữ liệu (cần từ 2 kế hoạch hoàn
thành trở lên).`** and nothing else. One finished project is one project's habits, not a lesson — the
two-file floor is the whole point of the section and is not waived because the single file looks
interesting.

With two or more, group by `Danh mục công việc` — the same task label across markets is the unit
being compared, and this is the one place `using-doox`'s warning about duplicate labels does not
apply, because comparing them is the job. One block per task label that appears in at least two
archived plans and carried an issue in at least one:

```
### Chuẩn bị hồ sơ & đầu mối nộp hồ sơ  (3 thị trường)
| Thị trường | Vấn đề phát sinh | Phương án xử lý | Hiện trạng vấn đề |
|---|---|---|---|
Phương án triển khai đã dùng: … (Bo Bien Nga) | … (HerioGreen)
Tiêu chuẩn hoàn thành đã dùng: …
→ Cần chú ý: …
```

`→ Cần chú ý` is the point of the block: **which `Phương án triển khai` and `Tiêu chuẩn hoàn thành`
went with the runs that hit no issue, and which went with the runs that did.** That link — issue ↔
fix ↔ method ↔ acceptance standard — is what the section exists to draw. State it as an observation
carrying its markets (`2/3 thị trường vấp hồ sơ chủ sở hữu khi Tiêu chuẩn hoàn thành không yêu cầu
biên nhận cơ quan`), never as a rule of thumb with no rows behind it.

A task label appearing in only one archived plan gets no block. Say how many archived plans were read
and which markets they cover, one line, above the blocks.

### Mục 4 — Dự báo tiến độ

Heading, verbatim: `4. Dự báo tiến độ`. One table, one row per unfinished market:

| Thị trường | % hoàn thành | % theo kế hoạch | Chênh lệch | Dự báo ngày kết thúc | Hạn cuối theo kế hoạch |
|---|---|---|---|---|---|

- **% hoàn thành** = done tasks ÷ all tasks, section-heading rows excluded, **each task counted as
  one**. The plan carries no effort estimate, so weighting one task above another would invent data;
  say which count it came from — `38% (31/81 đầu việc)`.
- **% theo kế hoạch** = tasks whose `Ngày kết thúc` ≤ today ÷ all tasks. Where the plan says the
  project should be by now.
- **Chênh lệch** = the first minus the second, signed: `-12% (chậm)`, `+4% (sớm)`, `0%`.
- **Dự báo ngày kết thúc** — velocity from the project's own history: `done ÷ days elapsed` since the
  earliest `Ngày bắt đầu`, then `remaining ÷ velocity` days from today. Round up to a date.
- **Hạn cuối theo kế hoạch** = the latest `Ngày kết thúc` in the file.

Below the table, one line per market that is behind, naming what is holding it: the overdue tasks
and the Nhóm việc they sit in.

**Two things this forecast cannot do, and both get said rather than guessed.** Velocity assumes the
rest of the project moves at the pace of what is done so far, which a project that has only finished
its easy tasks will beat by a wide margin — print the forecast date with `(theo tốc độ hiện tại)`
attached. And a project with no completed task at all has no velocity: print `-`, not a date.

**Per-station progress (`% tiến độ trạm/trụ`) needs a column naming the station**, and the reference
file has none — its tasks are market-wide. When no such column exists, print the market rows and add
one line: `Không có cột định danh trạm/trụ trong file — chưa tính được tiến độ theo trạm.` Never
carve stations out of task labels to fill the section.

## 8. No mail

**This skill sends no mail and drafts none — on any role, including a `Project Manager` run.** The
report is read in the chat reply and that is the whole delivery. Do not offer to draft or send one
either; the user asks `reminder` when they want mail out.

## 9. The archive

**A plan file is archived when every one of its tasks is done** — the `using-doox` definition,
checkbox and text column both. Nothing else marks it: no separate index, no copy of the data, no
status file. The archive is simply the finished plan files sitting in the project folder, and mục 3
reads them where they lie.

Record each one in the project `README.md` as it is found, one line under `## Kế hoạch đã hoàn
thành` — market, project, the date it was found complete. That list is what tells the next run how
many archived plans exist without re-reading every file.

**When the PM hands over a plan file whose tasks are all done, run mục 3 without being asked.** That
is the moment the archive grew and the synthesis changed; print the full report anyway (mục 1, 2 and
4 will cover the remaining unfinished markets), and lead with mục 3. If the new file brings the count
to one, say so and print the `Chưa đủ dữ liệu` line — an archive of one is still worth confirming
received.

Never move, rename, copy or write to a plan file to archive it. This skill writes to no plan file, and a
"finished" one is still someone's record.

## 10. Boundaries

This skill writes to no plan file — only `project-update` does. The one file it writes is the project `README.md`, per
`using-doox`.
