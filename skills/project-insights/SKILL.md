---
name: project-insights
description: Read the plan files of the markets still running and produce the issue summary — open issues grouped by work area and by issue type, past issues with what they had in common, and suggested fixes drawn from how similar ones were handled. Use when the user asks what is going wrong on a project, asks for a summary or classification of issues or incidents, asks which issues are blocking, or asks what past issues can teach.
---

# Project insights

## 1. When to use

The user asks what is stuck, what problems the project is hitting, or for a summary/classification of
issues. `progress-report` answers "where does this market stand" and `reminder` answers "what has to
happen today"; this skill answers "what is going wrong, of what kind, and what was done about the
same kind before".

## 2. Input

Every plan file in the Cowork project folder whose project is **not finished** — a project with at
least one task not done, per `using-doox`. A project whose every task is done contributes to mục 2
only.

Use the `using-doox` skill first: read the project `README.md`, settle who is running this, then take
each `.xlsx` following `[Thị trường] - [Tên dự án] - [Tên PM].xlsx`, ignoring lock files. The market
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
| 1 — đang diễn ra | issue rows **not yet ticked** — the control-sheet checkbox is not TRUE |
| 2 — đã từng xảy ra | issue rows **already ticked** — the checkbox is TRUE |

**Here the checkbox alone decides, not the `using-doox` definition of done.** That definition needs
the text column to read `Hoàn thành` as well, and on real files it often lags behind the tick — 9
rows of the reference file are ticked while the text still says `Đang triển khai`. Holding mục 2 to
it would file a closed issue as still open and leave the section permanently empty. The stricter
definition still rules everywhere else; this is the one place it does not.

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

Then the two sections, headings written exactly:

```
1. Tổng hợp vấn đề trong quá trình triển khai dự án
2. Tổng hợp vấn đề đã từng xảy ra
```

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

## 8. No mail

**This skill sends no mail and drafts none — on any role, including a `Project Manager` run.** The
report is read in the chat reply and that is the whole delivery. Do not offer to draft or send one
either; the user asks `reminder` when they want mail out.

## 9. Boundaries

Plan files are read-only. The one file a Doox skill writes is the project `README.md`, per
`using-doox`.
