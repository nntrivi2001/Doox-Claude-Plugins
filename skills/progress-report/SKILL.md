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
- The market name. Ask the user for it — never infer it from the filename, or the report goes out
  under the wrong market.

## 3. Fields to collect

Fourteen: STT, Danh mục công việc, PIC, Ngày bắt đầu, Ngày kết thúc, Trạng thái (text), the
completion checkbox, Hiện trạng vấn đề, Vấn đề phát sinh, Phương án xử lý, Ghi chú, Phương án triển
khai, Tiêu chuẩn hoàn thành, Rủi ro.

They live in two sheets and have to be joined:

- The plan detail sheet — Danh mục CV, Phương án triển khai, Tiêu chí hoàn thành, Người phụ trách,
  Người hỗ trợ, Ngày bắt đầu, Ngày kết thúc, **Trạng thái (text)**, Rủi ro, Ghi chú.
- The control sheet — Cập nhật hiện trạng, Vấn đề phát sinh, **Trạng thái (checkbox TRUE/FALSE)**,
  Phương án giải quyết.

Join on **Danh mục CV**, not on STT: STT restarts at every section, so the same number appears many
times.

Five required columns: **Danh mục công việc**, **Trạng thái (text)**, the **checkbox**, **Ngày bắt
đầu**, **Ngày kết thúc**. If any one of them is missing, stop and ask the user — do not guess.

Report which columns were matched before printing anything, e.g. `sheet 'KH Bảng 3 - Chi tiết' cột
J = Ngày kết thúc`.

A row with no Danh mục CV, or with a Danh mục but both date cells empty, is a section heading
(`A`, `1`, `2`…). It is not a task: drop it from every table and from the counts.

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

Opening lines, verbatim:

```
Báo cáo tiến độ dự án:
Cập nhật tiến độ dự án tại thị trường [Tên thị trường] dựa theo cập nhật mới nhất:
```

Then five sections under exactly these headings, each with its row count:

1. Đầu việc quá deadline
2. Các đầu việc gần deadline
3. Các đầu việc đang trong quá trình triển khai
4. Các công việc đã hoàn thành
5. Các công việc sắp tới

Tables 1, 2, 3, 5 — eleven columns:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|

Tables 3 and 5 swap `Ngày kết thúc` for `Ngày bắt đầu`. Every other column keeps its place.

Table 4 — seven columns:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành |
|---|---|---|---|---|---|---|

After table 5: the status-conflict list, if there is one.

Last line: `tổng = b1 + b2 + b3 + b4 + b5 + chưa bắt đầu`. If the numbers do not add up, report the
discrepancy instead of publishing the report.
