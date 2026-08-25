---
name: document-review
description: Review the documents the user hands over in the session — translate, summarise and compare them, normalise several quotations onto one scope and shortlist them, or score contractor capability dossiers against the twelve capability groups with the evidence behind every line. Use when the user sends quotations, contractor dossiers, standards, contracts or any external document and asks to đọc, dịch, tóm tắt, so sánh, duyệt, chấm, xếp hạng or đề cử. Reads only what the user supplied; never a plan file.
---

# Document Review

## 1. What this skill is for

The user drops documents into the session — báo giá from several vendors, hồ sơ năng lực from
several contractors, a standard, a contract, a foreign-language spec — and asks for a reading of
them. Four requests, one skill, because in practice they arrive as one job: five quotations come in,
two of them in English, they need translating, normalising onto the same scope, comparing, then
shortlisting.

| Request | Section |
|---|---|
| dịch, tóm tắt, so sánh, trích dẫn tài liệu | §3 |
| duyệt báo giá, so sánh giá, đề cử phương án | §4 |
| duyệt hồ sơ năng lực nhà thầu, chấm, xếp hạng | §5 |

Not for the project plan files — those are `project-report`, `reminder`, `project-insights`,
`project-update`. Not for researching a market from public sources — that is `market-research`, which
goes out to the internet; this skill stays inside the documents in front of it.

**Read-only, and no identity gate.** This skill shows nobody's rows and touches no plan file, so it
runs for either role without the `using-doox` identity check. It writes nothing: the output is
tables in the chat reply. The user wanting the result as a file asks for it, and it is a new file —
never a rewrite of a document they supplied.

## 2. The five rules

These hold in every section below and they are the whole reason this skill exists. Translating and
summarising need no instructions; **not inventing** does.

**2.1 — Never replace the document's data with model knowledge.** The price in the file is the price,
the model number in the file is the model number, even when a better-known figure exists. The user
asking to research or verify something is a different request, and it is `market-research`.

**2.2 — Missing data is named, never filled.** `Chưa có thông tin` when the document is silent,
`Chưa xác minh` when the document asserts something it does not evidence. Both are real answers.
A blank cell quietly filled with a plausible value is the failure this skill is built to prevent.

**2.3 — Names, codes and units pass through untouched.** Tên pháp lý, mã số thuế, mã hiệu, model,
số hiệu tiêu chuẩn, đơn vị đo — carried over exactly as written, in any language, including inside a
translation. `IEC 61851-1` stays `IEC 61851-1`. `Công ty TNHH …` is not translated into English and
not "corrected".

**2.4 — Compare only within the same scope.** Two figures are comparable after they have been put on
the same basis: same hạng mục, same đơn vị tính, same khối lượng, same tax basis, same currency, same
inclusions. Anything that resists normalisation is reported as `Không so sánh được` with the reason —
never forced onto the table because the row needed a value.

**2.5 — Every finding names its source and position.** Which document, which page/sheet/mục/dòng. A
difference between two documents that does not say where each side came from cannot be checked by the
person who has to act on it.

## 3. Translate, summarise, compare

### 3.1 Identify before reading

Establish, per document: what it is (báo giá / hồ sơ năng lực / tiêu chuẩn / hợp đồng / spec /
khác), its language, and what the user wants out of it. State the reading in one line per document
before producing anything:

```
1. Bao gia - Cong ty A.pdf | Báo giá | EN | 12 trang
2. Ho so nang luc - Cong ty B.docx | Hồ sơ năng lực | VI | 34 trang
```

A document whose type is not clear from its content is asked about, not assumed. The type decides
which section runs, and running §4 on a hồ sơ năng lực produces a confident wrong table.

### 3.2 Extract along the document's own structure

Pull tiêu đề / mục / bảng / số liệu / điều kiện / ngoại lệ as the document organises them, then
summarise the main points and the items that need a decision. Do not reorganise a document into a
shape it does not have — the user has to find these things again in the original.

**Điều kiện and ngoại lệ survive summarising.** A summary that keeps the price and drops "giá chưa
bao gồm VAT, chưa bao gồm vận chuyển đến chân công trình" is worse than no summary. Same for số
liệu, mốc thời gian and kết luận: shorten the prose, never the conditions attached to a number.

### 3.3 Translating

Into Vietnamese, with the professional term the field actually uses, at the length of the original —
no condensing unless the user asked for a summary as well. Rule 2.3 governs what stays untranslated.

A term with no settled Vietnamese equivalent keeps the original in brackets after the translation the
first time it appears.

### 3.4 Comparing several documents

Same set of criteria applied to every document, derived from what the documents have in common — not
a criterion invented for one of them. Output three groups, each line sourced per rule 2.5:

- **Giống** — the documents agree;
- **Khác** — they differ without contradicting (different scope, different assumption);
- **Xung đột** — they cannot both be true.

`Xung đột` is never resolved by picking the more plausible side. Print both, name both sources, say
what would settle it.

### 3.5 Output

```
Tài liệu tham khảo — [tên tài liệu / nhóm tài liệu]

1. Tóm tắt nội dung chính
2. Số liệu & điều kiện quan trọng
   - Nội dung | Giá trị | Điều kiện áp dụng | Nguồn (tài liệu, vị trí)
3. Điểm giống / khác / xung đột giữa các tài liệu
4. Các điểm chưa đủ cơ sở kết luận
```

Section 4 is not optional and is not left empty when something is missing — it is where rule 2.2
lands.

## 4. Reviewing quotations

### 4.1 Settle the basis first

Before comparing anything, establish and state:

- **thị trường / dự án** the quotations belong to;
- **the criteria in force** — see §4.2;
- **ngưỡng chênh lệch giá or nguyên tắc ưu tiên**, if the user set one. No threshold set means
  ranking reports the spread and does not apply a cut-off of its own invention.

Quotations for different scopes that the user believes are comparable: say so before normalising, and
name what differs.

### 4.2 Which criteria apply

Criteria come from one of three places, in this order:

1. **A saved standard framework** — a BOQ or evaluation framework kept as a project asset. When one
   exists for this scope, it is the basis, and every hạng mục is judged against it.
2. **Criteria the user supplies in the session** — a list of tiêu chí, a reference BOQ, a spec. Fully
   valid; state that the review ran on user-supplied criteria and repeat them back before using them.
3. **The documents themselves** — when neither exists, the comparison is structural only:
   normalise onto a common scope, report differences, and rank on what the documents actually
   support. **Say plainly that no standard framework was applied, and that Đạt/Thiếu/Khác chuẩn
   cannot be judged** — only Có/Không có/Khác giữa các báo giá.

**A document the user sent is evidence, not a standard.** A vendor's own spec sheet does not become
the benchmark the other vendors are measured against just because it arrived first. Only case 1 and
case 2 set criteria.

### 4.3 Normalise

Put every quotation on the same basis, one row per hạng mục, before any comparison:

| Field | Note |
|---|---|
| Hạng mục | matched to the BOQ line, or to the equivalent line in the other quotations |
| Đơn vị tính | converted, with the conversion stated |
| Khối lượng | |
| Vật tư / model | mã hiệu passed through per rule 2.3 |
| Nhân công | separated from materials wherever the document allows |
| Thuế / phí | tax-inclusive vs exclusive made explicit |
| Vận chuyển | including whether it reaches site |
| Bảo hành | duration and scope |
| Điều kiện thanh toán | |
| Lead time | |
| Phần loại trừ | what the quotation explicitly does not cover |

A quotation that does not split a figure the others split — one lump sum against itemised lines — is
kept as one row marked `Không so sánh được ở cấp hạng mục`, compared at total level, and the
limitation is stated. Never split a lump sum by assumption.

Against a standard framework, each line gets: `Đạt` / `Thiếu` / `Khác chuẩn` / `Không so sánh được`.

**Separate the two causes of a price difference.** Chênh lệch do khối lượng and chênh lệch do đơn giá
are different problems with different fixes — a quotation that is cheaper because it quoted less
volume is not a cheaper quotation. Report them apart, per hạng mục and in total.

### 4.4 Elimination, then ranking

Eliminate first, on these grounds only, each naming the specific hạng mục or điều kiện:

- thiếu hạng mục bắt buộc;
- sai tiêu chuẩn kỹ thuật trọng yếu;
- điều kiện thương mại không đáp ứng yêu cầu đã nêu;
- không đủ dữ liệu để xác minh.

Rank what remains on: mức độ đáp ứng kỹ thuật/phạm vi → chi phí so với khung chuẩn → điều kiện
thương mại → tiến độ/bảo hành. Where the user set a priority rule in §4.1, it wins.

Shortlist size: more than 3 quotations → recommend at least 3; more than 5 → recommend at most 5.
**Never pad the shortlist to reach the number.** Three quotations of which one qualifies produces a
shortlist of one plus the reasons the others fell out.

### 4.5 Output

```
Duyệt báo giá — [thị trường / dự án]

1. Phạm vi & tiêu chuẩn áp dụng
   (nguồn tiêu chuẩn: khung đã lưu / user cung cấp / không có — so sánh cấu trúc)
2. Bảng so sánh chuẩn hóa
   - STT | Hạng mục | Tiêu chuẩn | PA A | PA B | PA C | Chênh lệch (khối lượng / đơn giá) | Nhận xét
3. Các điểm không đạt / thiếu thông tin
4. Shortlist đề cử
   - Xếp hạng | Đơn vị | Mức độ đáp ứng | Chênh lệch giá | Điểm mạnh | Điểm yếu/Rủi ro | Cần làm rõ
5. Kết luận: phương án phù hợp nhất và lý do
```

Every eliminated quotation appears in section 3 with its reason. A quotation that entered the review
and appears nowhere in the output is a coverage failure.

## 5. Reviewing contractor dossiers

### 5.1 The twelve capability groups

Every dossier is mapped onto these, and they are the row labels of the output matrix:

pháp lý/chứng chỉ · kinh nghiệm tương tự · năng lực civil · điện/utility · permit · HSE · QA/QC ·
nhân sự chủ chốt · tài chính · năng lực triển khai đồng thời · thầu phụ · bảo hành & phạm vi địa bàn

A group the dossier does not address is `Chưa có thông tin` — a filled row, not an omitted one.

### 5.2 Evidence, or nothing

**Only data with evidence inside the dossier counts.** A capability statement with no dự án, chứng
chỉ, báo cáo tài chính or hồ sơ nhân sự behind it is recorded as `Chưa xác minh` and scored as
nothing — not as a low score, and not as a high one because the wording was confident.

Marketing description is not evidence. Neither is a client logo wall, a certificate named but not
attached, nor a project listed without owner, scope or year.

Per line: what the dossier claims, what evidence backs it, where that evidence sits (rule 2.5), and
the resulting mức đáp ứng.

### 5.3 Mandatory criteria before scoring

State which of the twelve are bắt buộc for this scope, and what disqualifies, **before scoring
anything** — a criterion promoted to mandatory after the results are visible is not a criterion.

Where the user or a saved framework supplies thresholds and weights, use them. Where neither does,
say so and rank on mức độ đáp ứng across the twelve groups without inventing a point scale: the
matrix and the gaps carry the decision, and a made-up score would make it look settled when it is
not.

### 5.4 Shortlist

More than 3 dossiers → at most 3 recommended; more than 5 → at most 5. A contractor failing a
mandatory criterion never enters the shortlist, whatever its other scores.

Every recommended contractor carries: năng lực nổi trội, điểm yếu, khoảng trống dữ liệu, and the risk
of handing them turnkey scope.

### 5.5 Output

```
Duyệt hồ sơ năng lực — [thị trường / dự án]

1. Phạm vi & tiêu chí bắt buộc
   (nguồn tiêu chí: khung đã lưu / user cung cấp / không có — đánh giá theo mức đáp ứng)
2. Ma trận năng lực
   - Nhóm tiêu chí | NT A | NT B | NT C | Bằng chứng | Ghi chú
3. Tiêu chí thiếu / chưa xác minh, theo từng nhà thầu
4. Shortlist đề cử
   - Xếp hạng | Nhà thầu | Mức đáp ứng | Điểm mạnh | Điểm yếu/Rủi ro | Cần kiểm tra thêm
5. Kết luận & rủi ro khi giao turnkey
```

## 6. Before replying

Check, against the documents read in this run:

- every document handed over appears in the output, including the ones eliminated;
- no figure, model code, tên pháp lý or ngày tháng in the output that is not in a document or in a
  calculation whose inputs are (rules 2.1, 2.3);
- every conversion, normalisation and total reproduces from the stated inputs;
- every `Chưa có thông tin` / `Chưa xác minh` says what is missing and who would confirm it;
- nothing marked `Không so sánh được` was quietly compared anyway;
- the basis of the criteria (§4.2, §5.3) is stated in the output, not just decided internally;
- the shortlist was not padded to a target number.

Then state in the reply: documents read, the criteria basis used, and what still needs to be
clarified before the user can decide. Offer follow-up work only when it closes a gap already named in
the output.
