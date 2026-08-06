---
name: progress-report
description: Read a market's project plan (.xlsx) and produce the progress report in the customer's template — overdue, near deadline, in progress, done, starting soon. Use when the user hands over a plan file, asks how a project is doing, asks what is overdue or coming up, or asks for a progress report for a market.
---

# Progress report

## 1. When to use

The user hands over a plan file (`.xlsx`) and asks about progress, or asks for a progress report for
one market.

## 2. Input

- The plan file, `.xlsx`.
- The market name and the project name. They come from the filename, which follows
  `[Thị trường] - [Tên dự án].xlsx` — use the `using-doox` skill to read them, and show what was read
  before printing the report. If the filename does not follow the convention, that skill says to ask
  the user; do that rather than guessing, or the report goes out under the wrong market.

## 3. Fields to collect

Fourteen: STT, Danh mục công việc, PIC, Ngày bắt đầu, Ngày kết thúc, Trạng thái (text), the
completion checkbox, Hiện trạng vấn đề, Vấn đề phát sinh, Phương án xử lý, Ghi chú, Phương án triển
khai, Tiêu chuẩn hoàn thành, Rủi ro.

They live in two sheets and have to be joined:

- The plan detail sheet — Danh mục CV, Phương án triển khai, Tiêu chí hoàn thành, Người phụ trách,
  Người hỗ trợ, Ngày bắt đầu, Ngày kết thúc, **Trạng thái (text)**, Rủi ro, Ghi chú.
- The control sheet — Cập nhật hiện trạng, Vấn đề phát sinh, **Trạng thái (checkbox TRUE/FALSE)**,
  Phương án giải quyết.

**Join the two sheets by row position** — row *n* of the detail sheet is row *n* of the control
sheet. Both other keys are broken on real files: STT restarts at every section, and `Danh mục CV`
repeats (on the reference file 4 labels cover 14 rows, e.g. `Nghiệm thu giấy phép` appears 4 times,
so joining by label silently merges four different tasks into one).

Before joining, check the two sheets have the same row count and that `Danh mục CV` matches row by
row. If they diverge, stop and report it — a shifted join produces a report that looks fine and is
wrong throughout.

Five required columns: **Danh mục công việc**, **Trạng thái (text)**, the **checkbox**, **Ngày bắt
đầu**, **Ngày kết thúc**. If any one of them is missing, stop and ask the user — do not guess.

Report which columns were matched before printing anything, e.g. `sheet 'KH Bảng 3 - Chi tiết' cột
J = Ngày kết thúc`.

A row with no Danh mục CV, or with a Danh mục but both date cells empty, is a section heading
(`A`, `1`, `2`…). It is not a task: drop it from every table and from the counts.

**Where each report column comes from.** The two sheets both carry `Ngày bắt đầu`, `Ngày kết thúc`,
`Trạng thái` and `Ghi chú` under the same name — take each from the sheet named here, not from
whichever one is found first:

| Report column | Sheet | Source column |
|---|---|---|
| STT | detail | see below |
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

## 4. Classification

**Done = the checkbox is TRUE *and* the text column reads `Hoàn thành`.** The checkbox alone is not
enough, and a past end date is not a completion signal at all. Anything failing either condition
counts as not done.

The text column holds three values: `Chưa triển khai`, `Đang triển khai`, `Hoàn thành`. Table 4 holds
only `Hoàn thành`; tables 1, 2, 3 and 5 hold only `Chưa triển khai` and `Đang triển khai`.

Test in order, top to bottom. A task placed in an earlier table never reappears in a later one.

| # | Table | Condition | Date column |
|---|---|---|---|
| 1 | Đầu việc quá deadline | not done + Ngày kết thúc < today | Ngày kết thúc |
| 2 | Các đầu việc gần deadline | not done + today ≤ Ngày kết thúc ≤ today+3 | Ngày kết thúc |
| 3 | Các đầu việc đang trong quá trình triển khai | not done + Ngày bắt đầu ≤ today + not already in 1/2 | Ngày bắt đầu |
| 4 | Các công việc đã hoàn thành | checkbox TRUE **and** text `Hoàn thành` | Ngày kết thúc |
| 5 | Các công việc sắp tới | not done + today+1 ≤ Ngày bắt đầu ≤ today+3 + not already in 1/2 | Ngày bắt đầu |
| — | Chưa bắt đầu | everything left: Ngày bắt đầu further than 3 days out, or no dates | no table, counted only |

A task that is both near its deadline and about to start belongs in table 2 — that one is more
urgent.

**Status conflicts.** A task whose checkbox is TRUE while the text column is not `Hoàn thành`, or the
reverse, counts as not done and still lands in table 1/2/3/5 by its dates. Flag it twice:

- In its own row, append `[đã tick, cột chữ chưa cập nhật]` to whatever `Ghi chú` already holds.
- List it again after table 5: Danh mục công việc plus both status values, so the user can fix the
  file.

## 5. Output

**The report is the chat reply itself.** Produce no `.docx`, `.md`, `.pdf`, `.xlsx` or any other
file, and do not offer to. A file attachment is not a delivery of this report; it is a way of not
delivering it.

**Print every table in full, as Markdown, in the reply.** All five sections, every row of every
section, every column in the order given below, each cell carried whole. `Phương án triển khai` and
`Tiêu chuẩn hoàn thành` run to several hundred characters with numbered sub-steps — carry them
whole, only collapsing newlines inside a cell so the Markdown row stays valid. An empty cell prints
as `-`. An empty section still prints its header row plus `_(không có)_`.

A prose recap of the counts is not the report. `"Quá deadline: 4, Đang triển khai: 14"` states the
numbers correctly and still fails, because it drops `Phương án triển khai`, `Tiêu chuẩn hoàn thành`,
`Rủi ro` and `Hiện trạng` — exactly the columns the PM acts on.

The report runs long on a real market: reading the file in slices and printing the tables in
consecutive messages marked `(tiếp)` is fine. Shortening is not. Never cut rows, never cut cells,
never replace a table with a sentence, never point at a file instead.

Opening lines, verbatim:

```
Báo cáo tiến độ dự án:
Cập nhật tiến độ dự án tại thị trường [Tên thị trường] dựa theo cập nhật mới nhất:
```

Then five sections, each heading written exactly like this — number, label, colon, row count in
brackets, then the table:

```
1. Đầu việc quá deadline: (4)
2. Các đầu việc gần deadline: (1)
3. Các đầu việc đang trong quá trình triển khai: (14)
4. Các công việc đã hoàn thành: (3)
5. Các công việc sắp tới: (1)
```

Do not rename, reorder, merge or drop a section, and do not add one.

Tables 1, 2, 3, 5 — eleven columns:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|

Tables 3 and 5 swap `Ngày kết thúc` for `Ngày bắt đầu`. Every other column keeps its place.

Dates print as `dd/mm/yyyy`. One real row, to fix the level of detail expected:

```
| II.3.1 | Chuẩn bị hồ sơ & đầu mối nộp hồ sơ | Doox4 | 21/08/2026 | - | - | - | - | 1. Nhận checklist chính thức từ … | Có checklist được tư vấn xác nhận … | Dùng checklist không cập nhật. |
```

`Hiện trạng vấn đề`, `Vấn đề phát sinh`, `Phương án xử lý` and `Ghi chú` come from the control
sheet and are empty on most rows — print `-`, never leave the cell out and never invent content.
`Phương án triển khai`, `Tiêu chuẩn hoàn thành` and `Rủi ro` are almost always filled and are the
long ones: print them whole.

Table 4 — seven columns:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành |
|---|---|---|---|---|---|---|

After table 5: the status-conflict list, if there is one.

Last line: `tổng = b1 + b2 + b3 + b4 + b5 + chưa bắt đầu`. If the numbers do not add up, report the
discrepancy instead of publishing the report.
