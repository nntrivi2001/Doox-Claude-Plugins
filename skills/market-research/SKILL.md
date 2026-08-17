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
| Độ sâu | `nhanh` (mặc định) hoặc `sâu` |

Missing any of them: ask, the way the harness asks (`using-doox`, "How to ask depends on the
harness" — Cowork one elicitation form, chat plain text). Do not start researching on the market name
alone and fill the rest in later; the scope decides which queries are run.

**Độ sâu mặc định là `nhanh`.** It answers the go/no-go — national level, one round, the budgets of
section 4 — and is what `Kenya có triển khai được không` actually needs. `sâu` is the full pass and runs
only when the user asks for it or the objective is site selection, đấu thầu or an investment decision.
Say which mode ran, and offer to escalate a `nhanh` report afterwards rather than guessing high. The
mode sets the budget and the number of rounds, never the sourcing rules of section 3.

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

**This skill runs a real research pass, sized by the `Độ sâu` from section 2.** A report assembled
from a handful of searches is the failure mode; a `sâu` run means dozens of queries, primary documents
opened, several rounds. A `nhanh` run means fewer queries and one round — never fewer sourcing rules.

**1. Decompose.** Turn each group above into 3–5 concrete sub-questions before searching, each
answering a specific row of the framework block it feeds. `Điện & utility` becomes: biểu giá điện áp
dụng cho trạm sạc thuộc nhóm khách hàng nào; công suất khả dụng tại khu vực mục tiêu; thủ tục và thời
gian đấu nối; tần suất mất điện; điều kiện kỹ thuật của utility. Vague sub-questions produce vague
searches.

**2. Scale the effort to the question.** Cheap facts do not deserve a campaign, and a market
readiness call does not survive three searches:

| Question | `nhanh` | `sâu` |
|---|---|---|
| One fact (số trạm hiện có) | 3–5 queries, 1–2 documents | same |
| One group of the framework | 4–6 queries, 2 documents | 8–15 queries, 3–5 documents |
| Whole market report | every group at its budget, 10–18 unique sources total | 25–60 unique sources total |

**The budget is a ceiling, not a target.** A group whose rows are all answered from a tier-1 source at
query four stops at query four — running the rest of the budget to look thorough is the second failure
mode, and it costs the same as research.

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

**5. Read the document, never the snippet.** For each sub-question, open the most promising sources at
the budget above. Take the figure from the page or PDF with the section it sits on and the condition it
applies under — customer class, voltage band, year, region. A snippet has no conditions attached, and
the conditions are what make a tariff usable.

**Read the section, not the whole volume.** A tariff schedule or a decree runs to hundreds of pages and
one of them carries the figure. Save the file and pull out the section — search it for the tariff code,
the customer class, the article number — rather than pulling the whole document in to be read. Whole
files come in only when they are short. **And extract before moving on**: reduce every source to its
evidence-log line the moment it is open, then let the raw document go. A document held open while nine
more are read is paid for ten times over.

**6. Follow the citation chain.** A tier-2 article citing a decree, a tariff schedule or a report is
a pointer, not the source: fetch the decree and cite that. This is how a tier-2 lead becomes tier-1
evidence.

**7. Where the harness has subagents, the searching happens in them — not here.** One agent per
framework group, each with its own sub-questions, its own budget from the table above, and an explicit
boundary so two agents do not research the same thing. This is the default, not an optimisation: **the
main thread runs no search and fetches no document itself.** It decomposes, dispatches, and fills the
file from what comes back. A ministry PDF read in the main thread stays in the conversation and is
re-read on every turn after it; read inside an agent, it is paid for once and thrown away.

What an agent hands back is **the evidence-log lines and nothing else** — the format at the end of this
section, plus the sub-questions it found nothing for. No prose report, no market summary, no quoted
paragraphs. A quote is one line and only where the exact wording is the evidence, a tariff condition or
a legal clause. **A finding without its URL and date is unusable**: re-run it, do not write it down.

Agents share a **seen-source list** — the evidence log where there is a disk, otherwise the boundary in
each brief. The same tariff decree feeds four groups and is fetched once; an agent that hits a logged URL
takes the logged figure and moves on.

**Search and extract is mechanical; put it on the cheap model** where the harness allows a model per
agent. Decomposition, the cross-group analysis of section 6 and writing the file stay with the main
model — that is where judgement is.

**No subagents in this harness** — then the extract-before-moving-on rule of step 5 is the whole defence
and is not optional: one source open at a time, reduced to its log line, dropped. Run `nhanh` budgets
unless `sâu` was asked for, and say in the reply that the run was single-threaded.

**8. One narrowing round, then name what is left.** After the first round, list every framework row
still empty and every figure still standing on one source, and run **one** narrower round aimed only at
those. `nhanh` stops there. `sâu` gets a third round only for rows that are decision-grade — giá điện,
giấy phép, thời gian đấu nối, thuế, chi phí — and only where the primary source has not yet been opened
directly. Everything else is written down as a named gap.

**A named gap is a valid finish; an unnamed empty row is not.** Rounds four and up buy almost nothing
and cost as much as round one, so the report is not held back for them — say in the reply which rows
stayed empty and which primary source would close them. `Không tìm thấy` is a conclusion only after
that source has been checked directly.

**9. Citation pass at the end.** Before filling the file, go back over every figure and attach its
source, date and condition — one pass dedicated to it, not done from memory while writing. **The pass
runs against the evidence log**, not from memory and not by re-running the group's research: a figure
that is not in the log was never verified, and the default fix is to relabel it `Chưa xác minh`.

**Re-research when the log itself looks wrong — targeted, not a fresh round.** The pass is where a bad
figure surfaces, and letting it through because searching again is expensive is the worse mistake. Go
back out for a figure when:

| Trigger | What to do |
|---|---|
| Two figures contradict each other, or a consistency check of section 5 fails | Open the primary source for both and settle which is right |
| A decision-grade figure rests on one source — giá điện, giấy phép, thời gian đấu nối, thuế, chi phí — and step 8 did not already go after it | One more independent source, or the official one directly |
| The log line has no date, no condition, or a condition that does not fit the use — wrong customer class, wrong voltage band, wrong year | Re-open that same source for the missing condition |
| A figure is off by an order of magnitude, or the unit looks converted wrong — kW vs kWh, per trạm vs per trụ | Verify at source before it reaches a cell |
| The figure decides `Mức độ sẵn sàng chung` and its source is tier 2 | Push for tier 1 |

**Bounded:** one targeted attempt per figure, aimed at the specific document or agency — never a
re-run of the whole group, and it does not reopen the rounds of step 8. It fails, the figure is
`Chưa xác minh` with the doubt written down: `nguồn X ghi 45 USD/kWh, sai đơn vị hoặc sai bậc giá, chưa
xác minh được`. An empty row is not a trigger — that is a named gap and it stays one. Unease with no
named trigger is not a trigger either.

Keep an evidence log throughout — `nguồn | cấp 1/2 | URL | ngày công bố | số liệu lấy ra | điều kiện
áp dụng | ô nào dùng` — one line per source used. It fills the `Cơ sở dữ liệu (cách tính + nguồn)`
column and it is what makes a figure checkable six months later.

**The log lives on disk while the research runs**, not in the conversation: a folder
`Nguồn báo cáo thị trường [Thị trường] dd_mm_yyyy/` beside the output file, named to pair with it, one
markdown file per framework group, each agent appending only to its own — two agents on one file corrupt
it. The main thread reads a group's file when it fills that group's rows, and reads it once. This is
also what makes a run resumable: a
session that is interrupted or compacted re-reads the log instead of re-running forty searches, and a
second market report can be told to reuse a log that is still inside the mốc thời gian.

**No disk in this harness** — then the log comes back in the agents' replies and is kept as the single
newest message of the run; nothing is re-quoted from it as it grows, and it reaches the deliverable the
same way it always does — through the `Cơ sở dữ liệu (cách tính + nguồn)` column of section 7.

**The bar for calling the report done:** every row of Bảng 1–4 worked, each group resting on tier-1/2
sources or on a written gap, no decision-grade figure standing on a single source without that being
said, and a methodology note in the reply — độ sâu đã chạy (`nhanh`/`sâu`), số truy vấn, số nguồn, số
vòng, nhóm nào thiếu dữ liệu, và — sau một run `nhanh` — những ô nào một run `sâu` có thể lấp được.

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
(`using-doox`, "Plan file naming") and would land in tomorrow's reminder as a project. The source-log
folder of section 4 sits beside it under the matching name, and the same ` - ` rule holds for the files
inside it.

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
