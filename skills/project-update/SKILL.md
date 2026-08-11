---
name: project-update
description: Update tasks in the plan files — status, dates, issues, handling — from what the user typed, across several markets in one message, confirming every change before writing and keeping the two sheets in step. Use when the user says a task is done, pending, late, blocked, moved, or hands over any change to a plan file. The only Doox skill that writes to a plan file.
---

# Project Update

## 1. When to use

The user reports a change to a task: it finished, it is pending, it slipped, a deadline moved, an
issue appeared, a fix was decided. One task or twenty, one market or several in the same message.

**This is the only Doox skill that writes to a plan file.** A report never "fixes" a cell it printed;
it says the cell looks wrong and stops. Every write goes through here, through the confirmation in
section 6.

Not for reading the plan — that is `progress-report`, `reminder`, `project-insights`. This skill
changes values in rows that already exist.

## 2. Identity and permission — the gate

Settle who is running this per `using-doox`, "Who is running this", before reading a plan file and
long before writing one. Then:

| Role | May write |
|---|---|
| `Project Manager` | every row of the files whose `Tên PM` matches their name |
| `Chuyên gia` | only rows where their PIC code is `Người phụ trách` **or** `Người hỗ trợ` |

**A row outside that set is not written, not partially written, and not silently dropped.** The user
is told which of their requested changes were refused and why, in one line each — `Doox3 không phụ
trách công việc này` — and the rest of the batch still goes through. A batch is never rejected whole
because one row was out of reach, and a refused row is never "written anyway because it was
obviously right".

**`Người hỗ trợ` counts as owner for this skill.** Rule 1 grants it, and a supporter reporting that
they finished their part is exactly the case this exists for.

## 3. Reading the request

The user writes in free text, several markets in one message, no fixed order. Example 3 of the spec
is two markets in two lines. **Parse it into a list of intents, one per task, before touching
anything**, each carrying: market → file, task, field(s), new value.

Pull these keywords, in whatever form they appear:

| Keyword | What it sets |
|---|---|
| `hoàn thành`, `xong`, `đã xong`, `done` | Trạng thái = `Hoàn thành`, checkbox TRUE |
| `đang làm`, `đang triển khai` | Trạng thái = `Đang triển khai`, checkbox FALSE |
| `chưa làm`, `chưa triển khai`, `chưa bắt đầu` | Trạng thái = `Chưa triển khai`, checkbox FALSE |
| `pending`, `treo`, `tạm dừng`, `chờ …` | not a value of the column — see section 5 |
| `lùi deadline`, `dời hạn`, `gia hạn`, a date | Ngày kết thúc |
| `bắt đầu từ …` | Ngày bắt đầu |
| `vướng`, `chưa đủ`, `thiếu`, `bị …` | Vấn đề phát sinh |
| `đã xử lý bằng …`, `phương án là …` | Phương án xử lý |
| `hiện tại đang …` | Cập nhật hiện trạng |

**A word that is not in that table is not guessed at.** Ask which field it belongs to. Writing to the
wrong column is worse than one extra question.

### Finding the market

The user writes the market their own way — `Bờ Biển Ngà`, `BBN`, `Philippine`, `PLP` — the file is
named `Bo Bien Nga`, `Philippines`. Match against the markets read from the filenames
(`using-doox`, "Plan file naming"), in order:

1. Equal after dropping diacritics, case, spaces, dots and hyphens.
2. Equal to the initials of the market's words — `BBN` = **B**o **B**ien **N**ga.
3. Prefix of the market, at least 3 characters — `Philip` → `Philippines`, `PLP` matched by 2 only
   when nothing else does.

**Exactly one file matched — take it, and name the file in the confirmation of section 6** so a wrong
match is caught before the write, not after. Nothing matched, or two files did — ask with a picker
listing the candidate markets. Never write to a file the user has not seen named.

### Finding the task

`Danh mục CV` repeats — on the reference file 4 labels cover 14 rows. **A label that matches more
than one row is never resolved by guessing.** Show the matching rows with their built STT, their
dates and their PIC, and ask which one. The STT built per `using-doox` is the key that identifies a
row; use it in every question and every confirmation.

The user's wording is rarely the exact label: match on the label containing their words, diacritics
and case ignored. No row matches at all — say so and name the market, do not fall back to the
closest-looking task.

## 4. What syncs with what

Rule 3, and the reason this skill exists rather than "just edit the cell". The two sheets both carry
`Ngày bắt đầu`, `Ngày kết thúc`, `Trạng thái` and `Ghi chú` (`using-doox`, "Where each field comes
from"). **A change to any of those is written to every sheet that carries it, in the same write, or
not at all.**

| Change | Cells written |
|---|---|
| Trạng thái | detail `Trạng thái` (text) **and** control `Trạng thái` (checkbox) |
| `Hoàn thành` | text = `Hoàn thành` **and** checkbox = TRUE — done is both, per `using-doox` |
| anything not `Hoàn thành` | text **and** checkbox = FALSE |
| Ngày bắt đầu / Ngày kết thúc | both sheets, wherever the column exists |
| Ghi chú | the sheet the user meant; if both carry a value, ask which |

Writing the checkbox without the text, or one sheet without the other, is the bug this table exists
to prevent: `reminder` reads the text, `progress-report` reads the checkbox, and the two then
disagree about the same task.

Rows are matched between the sheets by **row position**, checked with the STT alignment test in
`using-doox` before anything is written. **A shifted pair of sheets stops the run** — a write into a
shifted join lands on the wrong task and looks perfectly fine.

## 5. Values that are not in the file's vocabulary

`Trạng thái` holds exactly three values: `Chưa triển khai`, `Đang triển khai`, `Hoàn thành`. The user
will type others — `pending`, `chưa đủ hồ sơ`, `đang chờ đối tác`.

**Never write a fourth value into the column** — every other Doox skill reads those three, and one
`pending` cell breaks the done-check everywhere.

**Ask before mapping, then propose the nearest value plus the detail as text:**

```
"pending" không phải trạng thái có trong file. Bạn xác nhận cách ghi sau nhé:
  Trạng thái: Chưa triển khai
  Vấn đề phát sinh: chưa đủ hồ sơ
```

`pending` / `treo` / `chờ …` → `Chưa triển khai` with the reason in `Vấn đề phát sinh`, checkbox
FALSE. Work that is genuinely under way and merely blocked is `Đang triển khai` — the user says
which; do not decide it for them. The mapping is confirmed like any other change, in the same table
of section 6.

Dates: the file's format is `dd/mm/yyyy`. `20/08/2026` is unambiguous, `20/08` is not — ask for the
year rather than assuming the current one. A date written into a cell is written as a real date
value, not as text.

## 6. Confirm before writing

**Rule 2, and it has no exception. Every write is confirmed in its own turn, every time.** Not
skipped for a one-cell change, not skipped because the user already wrote the change clearly, not
skipped because they said `cứ làm đi` or confirmed a batch in an earlier turn. A yes covers the table
it was given and nothing after it: the next batch, in the same conversation, is confirmed again from
scratch.

Print the whole change-set as one table, then the question:

```
Xác nhận các thay đổi sau:

| Thị trường | STT | Danh mục CV | Trường | Giá trị hiện tại | Giá trị mới |
|---|---|---|---|---|---|
| Bo Bien Nga | II.3.1 | Phê duyệt ngân sách & nhà thầu | Trạng thái | Đang triển khai | Hoàn thành |
| Bo Bien Nga | II.3.1 | Phê duyệt ngân sách & nhà thầu | Checkbox | FALSE | TRUE |
| Philippines | I.2.4 | Nghiệm thu giấy phép | Trạng thái | Đang triển khai | Chưa triển khai |
| Philippines | I.2.4 | Nghiệm thu giấy phép | Vấn đề phát sinh | - | chưa đủ hồ sơ |

Bạn xác nhận cập nhật các nội dung trên chứ?
```

One line per cell — the checkbox is its own line, so the user sees both halves of a status change.
Every line names the file's market and the STT. `-` for an empty current value.

Below the table, in this order, whatever applies:

- rows refused for permission (section 2);
- rows where the value is **already** what the user asked for — listed as `không thay đổi`, and
  dropped from the write;
- desync found in the file (section 7);
- fields still missing (section 8).

Then wait. **A confirmation is a yes to the table as printed.** The user answering with a change —
"đúng rồi nhưng deadline là 21/08" — is not a yes: rebuild the table and ask again.

## 7. Desync already in the file

Rule 4. Before writing a row, compare what the two sheets say about it. Report anything that already
disagrees, do not quietly "fix" it as part of the user's change:

```
Lưu ý: công việc II.3.1 đang bất đồng bộ giữa 2 sheet —
  sheet chi tiết: Trạng thái = Hoàn thành
  sheet kiểm soát: checkbox = FALSE
Bạn muốn ghi thành Hoàn thành (checkbox TRUE) hay giữ nguyên?
```

The user's answer decides it, and it becomes rows in the confirmation table like everything else. A
desync the user does not answer is left exactly as it is and reported again next time — never
resolved by picking the value that happens to agree with the new change.

The STT alignment check failing is a different, worse case: **stop the whole run**, name the first
row index that differs and quote both values, write nothing to any file in the batch.

## 8. Missing information

Rule 7. A status change to something blocked, without a reason, leaves `Vấn đề phát sinh` and
`Phương án xử lý` empty. Ask once, in one message, for everything missing across the whole batch:

```
Mình cần thêm thông tin cho các mục sau:
  Philippines - Nghiệm thu giấy phép: vấn đề cụ thể là gì? phương án xử lý?
```

The user may answer that there is none — `chưa có phương án`, `đang chờ đối tác`. **That is a valid
answer and it is written as the user said it**, not left blank and not filled with an invented plan.
No answer at all: the cell stays empty, and the reply says plainly which fields were left empty for
lack of information. Never infer a `Phương án xử lý` from the problem.

## 9. Writing

Only after the confirmation came back yes.

**Write exactly the cells in the confirmed table. Nothing else.** Rule 5, and it is the rule most
easily broken by being helpful: no tidying a date format elsewhere, no filling a `-`, no recomputing
a percentage, no sorting, no fixing a typo the user did not mention, no touching a row that was only
shown for context.

**Where the write lands** — per `using-doox`, "Writing a plan file". A local `.xlsx` (including one in
a Drive / OneDrive / SharePoint folder synced to disk) is written in place, one cell at a time,
formatting and formulas untouched. A file reachable only through a connector cannot be written: print
the confirmed change-set and say the file was not written. Never upload a "corrected" copy, never
create a second file — the team keeps editing the original.

After writing, re-read the written cells and report what actually changed:

```
Đã cập nhật 4 ô trong 2 file:
  Bo Bien Nga - II.3.1 Phê duyệt ngân sách & nhà thầu: Trạng thái → Hoàn thành, checkbox → TRUE
  Philippines - I.2.4 Nghiệm thu giấy phép: Trạng thái → Chưa triển khai, Vấn đề phát sinh → chưa đủ hồ sơ
```

A cell that failed to write is named as failed. Never report a write that was not verified by reading
it back.

## 10. Boundaries

Batch changes are per-row, always. `Hoàn thành hết các việc của tôi` is expanded into the actual list
of rows and confirmed row by row in the table — never applied as a sweep, never with a count instead
of the rows.
