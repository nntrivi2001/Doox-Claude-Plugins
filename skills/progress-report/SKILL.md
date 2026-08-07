---
name: progress-report
description: Read a market's project plan (.xlsx) and produce the progress report in the customer's template — overdue, near deadline, in progress, done, starting soon. Use when the user hands over a plan file, asks how a project is doing, asks what is overdue or coming up, or asks for a progress report for a market.
---

# Progress report

## 1. When to use

The user hands over a plan file (`.xlsx`) and asks about progress, or asks for a progress report for
one market.

## 2. Input

- Who is running this — `using-doox`, "Who is running this". If the README does not answer it, ask
  before reading the file. A `Project Manager` gets every row, but only of a file whose `Tên PM`
  matches their name — the claim is verified there, and a failed check stops the run without
  revealing the real PM name. A `Chuyên gia` gets only the rows carrying their PIC code, as
  `Người phụ trách` or `Người hỗ trợ`. Print the identity line above the report.
- The plan file, `.xlsx`.
- The market, the project and the PM name. They come from the filename, which follows
  `[Thị trường] - [Tên dự án] - [Tên PM].xlsx` — use the `using-doox` skill to read them, and show
  what was read before printing the report. If the filename does not follow the convention, that
  skill says to ask the user; do that rather than guessing, or the report goes out under the wrong
  market.

## 3. Fields to collect

Read the file per `using-doox`, section "Reading a plan file" — the two sheets, the join by row
position, the built STT, the required columns, the section-heading rows to drop, and which sheet each
field comes from all live there. Do not re-derive any of it here.

Thirteen fields end up in the report: STT, Danh mục công việc, PIC, Ngày bắt đầu, Ngày kết thúc,
Trạng thái (text), the completion checkbox, Hiện trạng vấn đề, Vấn đề phát sinh, Phương án xử lý,
Ghi chú, Phương án triển khai, Tiêu chuẩn hoàn thành. `Rủi ro` is read but not printed.

## 4. Classification

`using-doox` defines done — checkbox TRUE **and** text `Hoàn thành`; anything failing either
condition counts as not done.

Table 4 holds only `Hoàn thành`; tables 1, 2 and 3 hold only `Chưa triển khai` and
`Đang triển khai`.

Test in order, top to bottom. A task placed in an earlier table never reappears in a later one.

| # | Table | Condition | Date column |
|---|---|---|---|
| 1 | Đầu việc quá deadline | not done + Ngày kết thúc < today | Ngày kết thúc |
| 2 | Các đầu việc gần deadline | not done + today ≤ Ngày kết thúc ≤ today+3 | Ngày kết thúc |
| 3 | Các đầu việc đang trong quá trình triển khai | not done + Ngày bắt đầu ≤ today + not already in 1/2 | Ngày bắt đầu |
| 4 | Các công việc đã hoàn thành | checkbox TRUE **and** text `Hoàn thành` | Ngày kết thúc |
| — | Chưa bắt đầu | everything left: Ngày bắt đầu in the future, or no dates | no table |

**Status conflicts.** A task whose checkbox is TRUE while the text column is not `Hoàn thành`, or the
reverse, counts as not done and still lands in table 1/2/3 by its dates. Flag it twice:

- In its own row, append `[đã tick, cột chữ chưa cập nhật]` to whatever `Ghi chú` already holds.
- List it again after table 4: Danh mục công việc plus both status values, so the user can fix the
  file.

## 5. Output

**The report is the chat reply itself.** Produce no `.docx`, `.md`, `.pdf`, `.xlsx` or any other
file, and do not offer to. A file attachment is not a delivery of this report; it is a way of not
delivering it.

**Print every table in full, as Markdown, in the reply.** All four sections, every row of every
section, every column in the order given below, each cell carried whole. `Phương án triển khai` and
`Tiêu chuẩn hoàn thành` run to several hundred characters with numbered sub-steps — carry them
whole, only collapsing newlines inside a cell so the Markdown row stays valid. An empty cell prints
as `-`. An empty section still prints its header row plus `_(không có)_`.

A prose recap of the counts is not the report. `"Quá deadline: 4, Đang triển khai: 14"` states the
numbers correctly and still fails, because it drops `Hiện trạng vấn đề`, `Vấn đề phát sinh` and
`Phương án xử lý` — exactly the columns the PM acts on.

The report runs long on a real market: reading the file in slices and printing the tables in
consecutive messages marked `(tiếp)` is fine. Shortening is not. Never cut rows, never cut cells,
never replace a table with a sentence, never point at a file instead.

Opening lines, verbatim:

```
Báo cáo tiến độ dự án:
Cập nhật tiến độ dự án tại thị trường [Tên thị trường] dựa theo cập nhật mới nhất:
```

Then four sections, each heading written exactly like this — number, label, colon, row count in
brackets, then the table:

```
1. Đầu việc quá deadline: (4)
2. Các đầu việc gần deadline: (1)
3. Các đầu việc đang trong quá trình triển khai: (14)
4. Các công việc đã hoàn thành: (3)
```

Do not rename, reorder, merge or drop a section, and do not add one — no `Các công việc sắp tới`, no
`Chưa bắt đầu` table, no count-total line at the end. A `Chuyên gia` still gets all four sections,
filtered to their rows; a section left empty by the filter prints `_(không có)_` like any other.

Tables 1, 2, 3 — eight columns:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú |
|---|---|---|---|---|---|---|---|

Table 3 swaps `Ngày kết thúc` for `Ngày bắt đầu`. Every other column keeps its place.

Dates print as `dd/mm/yyyy`. One real row, to fix the level of detail expected:

```
| II.3.1 | Chuẩn bị hồ sơ & đầu mối nộp hồ sơ | Doox4 | 21/08/2026 | Đã nhận checklist bản mềm, chờ tư vấn xác nhận | - | - | - |
```

`Hiện trạng vấn đề`, `Vấn đề phát sinh`, `Phương án xử lý` and `Ghi chú` come from the control
sheet and are empty on most rows — print `-`, never leave the cell out and never invent content.

Table 4 — seven columns:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành |
|---|---|---|---|---|---|---|

`Phương án triển khai` and `Tiêu chuẩn hoàn thành` are the long ones — print them whole, they appear
only in table 4.

After table 4: the status-conflict list, if there is one.
