---
name: market-research
description: Research a target market for EV charging deployment — EV fleet and charging demand, sites, power and utility, permits, existing CPOs, contractors and suppliers, costs, payment and connectivity, climate and security — and fill the customer's standard market report framework, every figure carrying its source. Use when the user names a market and asks for market research, a market report, or whether a country is ready to deploy in.
---

# Market Research

## 1. When to use

The user names a target market and asks to research it: `nghiên cứu thị trường Philippines`,
`Bờ Biển Ngà có triển khai được không`, `làm báo cáo thị trường cho Kenya`.

Output: **a new `.xlsx` built from the saved framework**, filled. Not a chat report, not an investment
memo, not a business case — the framework's tables and nothing beyond them unless the user asks.

This skill reads no plan file and writes to none. It does not need the identity gate of `using-doox`
— nobody's rows are being shown — and it runs the same for a `Project Manager` and a `Chuyên gia`.

## 2. The intake — four facts, asked before researching

Required every run:

| Fact | Example |
|---|---|
| Thị trường / khu vực | `Côte d'Ivoire`, `Abidjan` |
| Mục tiêu nghiên cứu | thẩm định trước khi đầu tư, chọn site, tìm nhà thầu |
| Phạm vi địa lý | toàn quốc / một thành phố / một cụm site |
| Mốc thời gian dữ liệu | dữ liệu từ năm nào trở lại đây được coi là còn dùng được |

Missing any of them: ask, the way the harness asks (`using-doox`, "How to ask depends on the
harness" — Cowork one elicitation form, chat plain text). Do not start researching on the market name
alone and fill the rest in later; the scope decides which queries are run.

**A country name with a city-level objective is a limit, not a gap to be filled by inference.** Say
so plainly — `dữ liệu hiện có ở cấp quốc gia, chưa đủ cơ sở kết luận cho cấp thành phố` — and leave
the local rows blank rather than scaling a national figure down.

## 3. Sources — three tiers, and tier 3 is not used

**Cấp 1 — chính thống.** Chính phủ, bộ ngành, cơ quan quản lý, regulator, utility nhà nước, công báo,
văn bản pháp luật, số liệu thống kê quốc gia, hải quan, thuế. Cùng cấp: báo cáo tài chính và báo cáo
hoạt động do chính doanh nghiệp công bố, website chính thức của CPO / NCC / nhà thầu. **Ưu tiên cao
nhất — luôn tìm cấp 1 trước, cho mọi chỉ tiêu.**

**Cấp 2 — uy tín.** Báo lớn, lâu năm, có toà soạn của chính nước đó (Việt Nam: VnExpress, Dân Trí,
Thanh Niên, Tuổi Trẻ; Pháp ngữ Tây Phi: Jeune Afrique, Fraternité Matin; quốc tế: Reuters, AFP,
Bloomberg, Financial Times). Cùng cấp: tạp chí và bài báo khoa học, báo cáo của tổ chức chuyên môn và
định chế (IEA, IRENA, World Bank, AfDB, GIZ), hiệp hội ngành.

**Cấp 3 — không dùng.** Trang tin điện tử đại chúng, nội dung giải trí – xã hội, trang tổng hợp,
blog, nội dung SEO, mạng xã hội, diễn đàn, AI-generated listicle, directory không nêu phương pháp thu
thập. **Không trích, không đưa vào báo cáo, kể cả khi không tìm được nguồn nào khác** — thà để ô
trống và ghi `Chưa xác minh` còn hơn đưa một con số không truy được về đâu.

Tier 3 may be used for **one thing only**: as a lead — a name, a company, a station to then go and
verify at tier 1 or 2. The lead itself never reaches the report. A figure that only ever appears at
tier 3 does not exist for this report.

**A lower tier never overrides a higher one on the same fact.** Tier 2 contradicting tier 1: tier 1
stands, and the disagreement is written down per section 5.

Plus any external document the user hands over, and the saved report framework as the structure.

**Every figure that matters carries its source and the date it was published**, in the framework's
`Cơ sở dữ liệu (cách tính + nguồn)` column: source name, URL, publication date, and the condition it
applies under. A figure with no credible source is written `Chưa xác minh` — not dropped, not
softened into prose.

**Decision-grade data is verified twice.** Giá điện, giấy phép, thời gian đấu nối, thuế, số
trạm/CPO, chi phí: an official source, or — when the official one is not public — two independent
sources that agree. One blog post is not verification of an electricity tariff.

**Old data is dated, not laundered.** `2021: 3.400 xe điện (nguồn X)` — never presented as current.
If the mốc thời gian from section 2 excludes it, say the current figure is unavailable.

## 4. What to cover

Split the research by group and run it group by group, not as one broad query:

| Group | Feeds |
|---|---|
| Thị trường EV và đội xe | Bảng 1 |
| Nhu cầu sạc | Bảng 1 |
| Khu vực / site | Bảng 1, Kết luận cuối |
| Điện và utility | Bảng 1, Bảng 4 |
| Pháp lý và permit | Bảng 2, Kết luận pháp lý |
| CPO hiện hữu | Bảng 1, Bảng 3 |
| Nhà thầu, NCC, logistics, đối tác địa phương | Bảng 3 |
| Chi phí (CAPEX/OPEX) | Bảng 4, Kết luận cuối |
| Internet và payment | Bảng 1, Bảng 3 |
| Thời tiết, ngập, an ninh | Bảng 1, Bảng 4 |

A group the scope of section 2 puts out of reach is skipped **and named as skipped**, never silently
dropped.

### Depth — the deep-research loop

**This skill runs a full deep-research pass.** A report assembled from a handful of searches is the
failure mode; expect dozens of queries, documents opened in full, and several rounds.

**1. Decompose.** Turn each group above into 3–5 concrete sub-questions before searching, each
answering a specific row of the framework block it feeds. `Điện & utility` becomes: biểu giá điện áp
dụng cho trạm sạc thuộc nhóm khách hàng nào; công suất khả dụng tại khu vực mục tiêu; thủ tục và thời
gian đấu nối; tần suất mất điện; điều kiện kỹ thuật của utility. Vague sub-questions produce vague
searches.

**2. Scale the effort to the question.** Cheap facts do not deserve a campaign, and a market
readiness call does not survive three searches:

| Question | Budget |
|---|---|
| One fact (số trạm hiện có) | 3–5 queries, 1–2 documents |
| One group of the framework | 8–15 queries, 3–5 documents read in full |
| Whole market report | every group at its own budget, 25–60 unique sources total |

**3. Search wide, then narrow.** Start with short, broad queries — long, over-specified queries return
nothing and hide that the topic exists. Two to three keyword variants per sub-question, in the
country's language and in English, with the local official vocabulary (`borne de recharge`,
`raccordement`, `agrément`, `IRVE`, `tarif basse tension`). Then narrow onto the specific document,
year or agency the broad pass surfaced.

**4. Go at the primary sites directly.** Not only through a search engine: the ministry, the
regulator, the utility, the national gazette, the statistics office, the customs tariff, the company
register, the tender portal, the company's own site. `site:` queries against those domains find what
general search ranks away. Whatever search and fetch tools the harness offers are used — web search,
`WebFetch`, firecrawl, exa; the protocol is the same, only the tool names change.

**5. Read the document, never the snippet.** For each sub-question, open the 3–5 most promising
sources in full. Take the figure from the page or PDF with the section it sits on and the condition
it applies under — customer class, voltage band, year, region. A snippet has no conditions attached,
and the conditions are what make a tariff usable.

**6. Follow the citation chain.** A tier-2 article citing a decree, a tariff schedule or a report is
a pointer, not the source: fetch the decree and cite that. This is how a tier-2 lead becomes tier-1
evidence.

**7. Parallelise by group, never by "go research this market".** Where the harness has subagents,
dispatch one per framework group, each with its own sub-questions, its own budget from the table
above, and an explicit boundary so two agents do not research the same thing. Each returns findings
**with sources attached** — a finding that comes back without its URL and date is unusable and gets
re-run, not written down.

**8. Loop until the gaps are named.** After each round, list every framework row still empty and
every figure still standing on one source, and run a narrower round aimed only at those. Stop a
thread when a further round adds nothing new — diminishing returns is a valid stop, an empty row is
not a valid finish. `Không tìm thấy` is a conclusion only after the primary source has been checked
directly.

**9. Citation pass at the end.** Before filling the file, go back over every figure and attach its
source, date and condition — one pass dedicated to it, not done from memory while writing. Any claim
that cannot be traced to a logged source is deleted or relabelled `Chưa xác minh`.

Keep an evidence log throughout — `nguồn | cấp 1/2 | URL | ngày công bố | số liệu lấy ra | điều kiện
áp dụng` — one line per source used. It fills the `Cơ sở dữ liệu (cách tính + nguồn)` column and it
is what makes a figure checkable six months later.

**The bar for calling the report done:** every row of Bảng 1–4 worked, each group resting on tier-1/2
sources or on a written gap, no decision-grade figure standing on a single source without that being
said, and a methodology note in the reply — số truy vấn đã chạy, số nguồn đã dùng, nhóm nào thiếu dữ
liệu.

## 5. Normalising before comparing

Currency, kW vs kWh, time, tax and fee basis, geographic scope — normalise all of them before two
numbers are put in the same table. State the rate and the date used for any currency conversion.

**Three kinds of content, never blurred:**

| Label | Meaning |
|---|---|
| Đã xác minh | from a source of tier 1–4, cited |
| Ước tính | computed by us — the formula and every input is written next to it |
| Nhận định | our reading of the evidence, not a figure anyone published |

Anything with no basis at all is `Chưa xác minh` or `Chưa đủ dữ liệu`, and blank is an acceptable
cell. **A guess is labelled `phỏng đoán` in the cell itself** — a plausible unlabelled number is the
one failure mode of this report.

Consistency checks before writing: quy mô xe ↔ nhu cầu sạc; số trạm ↔ số CPO; giá điện ↔ nhóm khách
hàng áp dụng; giấy phép ↔ mô hình kinh doanh; chi phí ↔ phạm vi BOQ. A pair that does not add up is
reported as an inconsistency, not averaged away.

**Sources that disagree: print both figures**, say which is more reliable and why, and name the one
used downstream. Never silently pick one.

**Never turn a national figure into a city conclusion**, and never fill a gap with a hidden
assumption. Where an estimate is unavoidable, give a range and the basis for it.

## 6. Analysis — link the groups, do not list them

A list of facts is not the deliverable. The links that are:

| Inputs | Conclusion to reach |
|---|---|
| Nhu cầu xe + hành vi vận hành + điện | công suất và số trụ cần |
| Khu vực/site + điện + pháp lý + chi phí | mức độ phù hợp và thứ tự ưu tiên khu vực |
| Utility + thiếu công suất + thời gian nâng cấp | rủi ro cấp điện |
| Permit + điều kiện đầu vào + thời gian xử lý | thủ tục nào thành đường găng |
| Nhà thầu + NCC + logistics + CPO + đối tác | năng lực triển khai tại chỗ, khoảng trống nguồn lực |
| CAPEX/OPEX + tỷ giá + logistics + utility | khoảng chi phí thực tế và mức độ chắc chắn |
| tất cả các nhóm trên | rủi ro làm chậm tiến độ hoặc tăng chi phí |

Every conclusion is written as **nguyên nhân → tác động → mức độ chắc chắn**.

Score or rank a site only when the framework's minimum data for it exists — otherwise say which data
is missing and leave the ranking out. Assess a contractor, supplier or partner from public evidence
or the user's documents only: **never infer financial or technical capacity from the absence of a
record.**

## 7. The output file

**The blank framework ships with this skill**: `assets/khung-bao-cao-thi-truong.xlsx`, next to this
file — one sheet, `Khung báo cáo thị trường mẫu`, the customer's structure, empty. It travels with
the plugin, so the report can be produced on a machine that has never seen the customer's own copy.
Take it from there, always.

**Copy the asset to the output path, then fill the copy.** Never write into the asset — it is the
blank every later report starts from, and a filled one poisons the next market.

If the project folder happens to carry the customer's own `Khung báo cáo thị trường.xlsx` and its
framework sheet differs from the asset — a row added, a table retitled — **the customer's file wins**:
copy that sheet instead and say in the reply which one was used. Their template is the deliverable's
shape; ours is the portable fallback. Its second sheet, `Mẫu khung thực tế`, is a filled example of
the expected depth and tone: read it for calibration, never carry it into the output.

Name the output `Báo cáo thị trường [Thị trường] dd_mm_yyyy.xlsx`, in the project folder —
`Báo cáo thị trường Bo Bien Nga 11_08_2026.xlsx`. Underscores in the date, and **no ` - ` anywhere in
the name**: a name with two ` - ` separators is read as a plan file by every other Doox skill
(`using-doox`, "Plan file naming") and would land in tomorrow's reminder as a project.

The framework's own layout, to fill in place — do not renumber, retitle or reorder it:

| Block | Rows | What goes in |
|---|---|---|
| Bảng 1 — Tổng quan thị trường và nhu cầu sạc | 3–15 | `C` = dữ liệu hiện tại, `D` = cách tính + nguồn |
| Bảng 2 — Pháp lý, giấy phép, thủ tục | 18–26 | `B`–`F`, `H` (`A`, `G` already carry the procedure and its dependants) |
| Bảng 3 — Nhà thầu, NCC, đối tác địa phương | 29–37 | `B`, `D`, `E`, `H`; `C`, `F`, `G` hold the questions to answer |
| Bảng 4 — Rủi ro và mức độ sẵn sàng | 40–50 | `B`–`H`, one row per risk group already named in `A` |
| Kết luận pháp lý | 52–57 | `B` |
| Kết luận phân tích cuối cùng | 59–72 | `B` |

More than one unit per row — several contractors in a group, several risks in a group — means
**inserting rows inside that block**, keeping the group name in `A`. Never overwrite a neighbouring
block, never append a table of your own at the bottom.

**Every table carries data, source and a nhận định.** An empty table is not shipped; a table with
nothing verified says `Chưa đủ dữ liệu` in its rows and why. Blank cells are allowed where nothing is
known — generic filler prose is not.

The final `Kết luận phân tích cuối cùng` must answer, in its own rows: đặc điểm thị trường ảnh hưởng
vận hành, khu vực/site phù hợp, khả năng điện, điểm nghẽn pháp lý, năng lực đối tác, khoảng chi phí,
rủi ro chính, and `Mức độ sẵn sàng chung` as one of `Sẵn sàng` / `Sẵn sàng có điều kiện` /
`Chưa sẵn sàng`.

**No way to write an `.xlsx` here** — no local disk, no spreadsheet library — is said plainly, and
the same filled framework is printed in the chat reply as Markdown tables instead, block by block in
the order of the layout above. Never skip the report for lack of a writer, and never hand back a
half-filled file.

After writing, say in the chat reply: the file path, which groups had no usable data, and the
decision-grade figures that stayed `Chưa xác minh`.

## 8. Next steps — only when asked

Produce them only when the user asks or the request carries a `công việc tiếp theo` trigger.

Each suggestion comes **from a gap, a bottleneck or a risk this report already found** — nothing
new, no scope the research did not raise. Each carries three things and no more:

```
Việc cần làm | Lý do (khoảng trống/rủi ro nào) | Dữ liệu hoặc đầu ra cần thu được
```

**Assign no PIC and no deadline** unless the user or the scenario gave them.
