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

**It is a sourced picture of the market, not a decision.** `Bờ Biển Ngà có triển khai được không` is
answered with the evidence a human needs to answer it, not with a yes or a no — see section 6.

This skill reads no plan file and writes to none. It does not need the identity gate of `using-doox`
— nobody's rows are being shown — and it runs the same for a `Project Manager` and a `Chuyên gia`.

## 2. The intake — five facts, asked before researching

Required every run:

| Fact | Example |
|---|---|
| Thị trường / khu vực | `Côte d'Ivoire`, `Abidjan` |
| Mục tiêu nghiên cứu | thẩm định trước khi đầu tư, chọn site, tìm nhà thầu — **có thể chọn nhiều** |
| Phạm vi địa lý | toàn quốc / một thành phố / một cụm site |
| Mốc thời gian dữ liệu | dữ liệu từ năm nào trở lại đây được coi là còn dùng được |
| Độ sâu | `nhanh` (mặc định) hoặc `sâu` |

Do not start researching on the market name alone and fill the rest in later; the scope decides which
queries are run.

### How to ask

**Ask with `doox_form` — one real form, every missing fact in it, asked once.** The tool ships with
this plugin (MCP server `doox-forms`) and the harness may expose it under a prefix, e.g.
`mcp__doox-forms__doox_form`. It sends an MCP elicitation and returns what the user filled in. Call it
with `title` set to `Nghiên cứu thị trường` and these fields, in this order:

| `name` | `label` | `type` | `options` / `hint` |
|---|---|---|---|
| `thiTruong` | Thị trường / khu vực nghiên cứu | `text` | hint `Toronto, Canada` |
| `mtThamDinh` | Mục tiêu — Thẩm định trước khi đầu tư | `checkbox` | — |
| `mtChonSite` | Mục tiêu — Chọn site cụ thể | `checkbox` | — |
| `mtNhaThau` | Mục tiêu — Tìm nhà thầu / NCC | `checkbox` | — |
| `mtDoiThu` | Mục tiêu — Khảo sát đối thủ và CPO hiện hữu | `checkbox` | — |
| `mtPhapLy` | Mục tiêu — Tìm hiểu pháp lý và giấy phép | `checkbox` | — |
| `phamVi` | Phạm vi địa lý | `choice` | `Toàn quốc`, `Một thành phố`, `Một cụm site` |
| `mocThoiGian` | Mốc thời gian dữ liệu | `choice` | `Từ 2024`, `Từ 2022`, `Từ 2020`, `Không giới hạn` |
| `doSau` | Độ sâu | `choice` | `Nhanh`, `Sâu` |

**One form, not one question at a time.** A picker that walks the user through `1 of 4` is the bug
this replaces: every missing fact goes in the single `doox_form` call, and nothing is asked before or
after it.

**`Mục tiêu nghiên cứu` takes more than one answer** — thẩm định đầu tư and tìm nhà thầu are commonly
both true, and forcing one loses scope the research needed. Elicitation schemas hold flat primitives
and no arrays, which is why the objectives are five `checkbox` fields rather than one multi-select.
Objectives are the boxes that came back `true`; none ticked is asked again, not proceeded past.

**Read what the tool returns before using it.** It comes back as JSON: `{"ok": true, "answers": {…}}`,
or `{"ok": false, "reason": "…"}`.

| Return | Do |
|---|---|
| `ok: true` | take the answers and start the research |
| `ok: false`, reason names the missing `elicitation` capability | that harness cannot render a form — ask the same nine fields with its own structured-question tool (`AskUserQuestion`), all in one call, `multiSelect` for the objectives |
| `ok: false`, `decline` or `cancel` | stop; the research needs a scope and did not get one, and nothing is guessed in its place |

**The fallback is what the tool says, not a guess.** Do not skip `doox_form` on the assumption that a
harness has no elicitation, and do not fall back because a form felt slow — the returned `reason` is
the only thing that moves the run onto the picker.

A fact the user already gave in their prompt is **not asked again** — its field is left out of the
call. `Hãy nghiên cứu thị trường Canada - Toronto` already answers the market, so `thiTruong` is
dropped and the form carries eight fields.

Never a numbered list of questions in prose. This form is not the identity gate of `using-doox` —
`market-research` runs without that gate — and the two are never merged into one form.

**Độ sâu mặc định là `nhanh`.** National level, one round, the budgets of section 4 — enough to fill
the framework with sourced rows, and what `Kenya có triển khai được không` actually needs before a
human looks at it. `sâu` is the full pass and runs only when the user asks for it or **any one of the
objectives picked** is site selection, đấu thầu or an investment decision — with several objectives
selected it is the most demanding one that sets the depth, not the first in the list.
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

**Every figure that matters carries its source and the date it was published**, inside the cell, in
the result format the framework's `00 - Hướng dẫn` sheet fixes — `Kết quả | Trạng thái | Phạm vi,
đơn vị, kỳ dữ liệu | Nguồn và ngày | Phương pháp/giả định | Giới hạn | Hành động xác minh`. The
framework has no separate source column; a figure and its provenance travel in one cell. A figure
with no credible source is written `Chưa xác minh` — not dropped, not softened into prose.

**Decision-grade data is verified twice.** Giá điện, giấy phép, thời gian đấu nối, thuế, số
trạm/CPO, chi phí: an official source, or — when the official one is not public — two independent
sources that agree. One blog post is not verification of an electricity tariff.

**Old data is dated, not laundered.** `2021: 3.400 xe điện (nguồn X)` — never presented as current.
If the mốc thời gian from section 2 excludes it, say the current figure is unavailable.

## 4. What to cover

Split the research by group and run it group by group, not as one broad query:

| Group | Feeds |
|---|---|
| Thị trường EV và đội xe | Bảng 1 (dòng 3–4) |
| Hạ tầng sạc hiện hữu và chuẩn kỹ thuật | Bảng 1 (dòng 5–6) |
| Đặc tính xe — pin, tiêu thụ, khả năng sạc | Bảng 1 (dòng 7–8) |
| Điện và utility | Bảng 1 (dòng 9), Bảng 4, Kết luận cuối |
| Pháp lý và permit | Bảng 2, Bảng 4, Kết luận pháp lý, Kết luận cuối |
| CPO hiện hữu | Bảng 1 (dòng 5), Bảng 3 |
| Nhà thầu, NCC, logistics, đối tác địa phương | Bảng 3, Bảng 4, Kết luận cuối |
| Internet và payment | Bảng 1 (dòng 10–11), Bảng 3, Bảng 4 |
| Thời tiết, ngập, an ninh | Bảng 1 (dòng 12–13), Bảng 4 |
| Chi phí và tỷ giá | Bảng 4, Kết luận cuối (rủi ro chi phí) |

Bảng 1 dòng 14 (`Kết luận tổng quan và nhu cầu sạc`) is not a research group — it is written from the
groups above once they are filled, per section 6, and it is where `khu vực ưu tiên` lands.

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

**2. Scale the effort to the question.** Cheap facts do not deserve a campaign, and a whole framework
block does not get filled off three searches:

| Question | `nhanh` | `sâu` |
|---|---|---|
| One fact (số trạm hiện có) | 3–5 queries, 1–2 documents | same |
| One group of the framework | 4–6 queries, 2 documents | 8–15 queries, 3–5 documents |
| Whole market report | every group at its budget, 10–18 unique sources total | 25–60 unique sources total |

**The budget is a ceiling, not a target.** A group whose rows are all answered from a tier-1 source at
query four stops at query four — running the rest of the budget to look thorough is the second failure
mode, and it costs the same as research.

**The run has a ceiling of its own, and it is the one that binds.** Per-group budgets multiplied by ten
groups do not fit in a session — a `sâu` run that spends 15 queries on every group exhausts the user's
quota before Bảng 2 is filled, and delivers nothing. Count queries and documents across the whole run,
not per group:

| | Queries, whole run | Documents opened, whole run | Rounds |
|---|---|---|---|
| `nhanh` | 35 | 10 | 1 + one narrowing |
| `sâu` | 80 | 24 | 2 + one narrowing on decision-grade rows |

**Hitting the run ceiling ends the research, immediately and without asking.** Not a pause to check in,
not one more group: stop searching, write what the log holds, name every row still empty as a gap, and
say in the reply that the ceiling was reached and which groups it cut short. A report delivered at the
ceiling with six groups sourced and four named as gaps is the success case. A run that spends two quota
windows and delivers no file is the failure this ceiling exists to prevent, and it is the one that has
actually happened.

**Spend the ceiling in order of what the objectives asked for.** The groups feeding the picked
`Mục tiêu` go first and get the wide budgets; the rest take what is left. A run out of budget before
`Thời tiết, ngập, an ninh` has been touched is fine — a run that spent a third of the ceiling there
before opening a single tariff schedule is not.

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
| A decision-grade figure reaches `Kết luận cuối` on a tier-2 source | Push for tier 1 |

**Bounded:** one targeted attempt per figure, aimed at the specific document or agency — never a
re-run of the whole group, and it does not reopen the rounds of step 8. **The pass draws on the same run
ceiling, and gets at most a tenth of it**: with 58 rows in the framework, one attempt per doubtful
figure is another whole run's worth of searching. Rank the triggers by how decision-grade the figure is
and spend that tenth from the top down; what is left over is written `Chưa xác minh` with the doubt named. It fails, the figure is
`Chưa xác minh` with the doubt written down: `nguồn X ghi 45 USD/kWh, sai đơn vị hoặc sai bậc giá, chưa
xác minh được`. An empty row is not a trigger — that is a named gap and it stays one. Unease with no
named trigger is not a trigger either.

Keep an evidence log throughout — `nguồn | cấp 1/2 | URL | ngày công bố | số liệu lấy ra | điều kiện
áp dụng | ô nào dùng` — one line per source used. It is what the `Nguồn và ngày` and `Giới hạn` parts
of every cell are written from, and what makes a figure checkable six months later.

**The log lives on disk while the research runs**, not in the conversation: a folder
`Nguồn báo cáo thị trường [Thị trường] dd_mm_yyyy/` beside the output file, named to pair with it, one
markdown file per framework group, each agent appending only to its own — two agents on one file corrupt
it. The main thread reads a group's file when it fills that group's rows, and reads it once. This is
also what makes a run resumable: a
session that is interrupted or compacted re-reads the log instead of re-running forty searches, and a
second market report can be told to reuse a log that is still inside the mốc thời gian.

**No disk in this harness** — then the log comes back in the agents' replies and is kept as the single
newest message of the run; nothing is re-quoted from it as it grows, and it reaches the deliverable the
same way it always does — through the `Nguồn và ngày` part of every cell written in section 7.

**The bar for calling the report done:** every row of Bảng 1–4 worked and no cell still carrying the
blank's instruction text, each group resting on tier-1/2 sources or on a written gap, no
decision-grade figure standing on a single source without that being said, and a methodology note in
the reply — độ sâu đã chạy (`nhanh`/`sâu`), số truy vấn, số nguồn, số
vòng, nhóm nào thiếu dữ liệu, và — sau một run `nhanh` — những ô nào một run `sâu` có thể lấp được.

## 5. Normalising before comparing

Currency, kW vs kWh, time, tax and fee basis, geographic scope — normalise all of them before two
numbers are put in the same table. State the rate and the date used for any currency conversion.

**Four statuses, never blurred — the framework's own, from its `00 - Hướng dẫn` sheet.** Every result
carries exactly one of them, written in the cell:

| Trạng thái | Khi dùng | Bắt buộc kèm |
|---|---|---|
| `Đã xác minh` | nguồn cấp 1–2, trực tiếp, còn hiệu lực | kết quả, phạm vi, nguồn/URL, ngày công bố hoặc truy cập |
| `Ước tính` | tính hoặc suy ra từ dữ liệu có căn cứ | công thức, đầu vào, giả định, khoảng giá trị, giới hạn |
| `Chưa xác minh` | không có dữ liệu công khai đủ tin cậy, hoặc cần xác nhận tại chỗ | dữ liệu cần lấy, đơn vị xác nhận, ảnh hưởng — **không điền số giả định** |
| `Không áp dụng` | có căn cứ rõ rằng chỉ tiêu không áp dụng cho phạm vi này | căn cứ — không dùng chỉ vì không tìm thấy thông tin |

`Không áp dụng` is the one that gets abused: not finding something is `Chưa xác minh`, never
`Không áp dụng`. **A guess is never written at all** — a plausible unlabelled number is the one
failure mode of this report. Where the reading is ours rather than anyone's published figure, say so
in the cell as a `nhận định` and keep it separate from the figure it rests on.

Consistency checks before writing: quy mô xe ↔ nhu cầu sạc; số trạm ↔ số CPO; giá điện ↔ nhóm khách
hàng áp dụng; giấy phép ↔ mô hình kinh doanh; chi phí ↔ phạm vi BOQ. A pair that does not add up is
reported as an inconsistency, not averaged away.

**Sources that disagree: print both figures**, say which is more reliable and why, and name the one
used downstream. Never silently pick one.

**Never turn a national figure into a city conclusion**, and never fill a gap with a hidden
assumption. Where an estimate is unavoidable, give a range and the basis for it.

## 6. Analysis — enough to connect the rows, and no further

**The deliverable is the information, not a verdict.** This framework produces a sourced picture of a
market for a human to judge — it does not decide anything. There is no `Mức độ sẵn sàng chung`, no
site readiness call, no CAPEX/OPEX total, no recommendation: those rows were deliberately removed
from the framework because the data behind them cannot be got from public sources. Do not reintroduce
them, and do not add a row, table or closing paragraph that answers `có nên vào thị trường này không`.

What the framework does still ask for is the links between groups, because a few of its rows cannot
be filled from one group alone:

| Inputs | The row it fills |
|---|---|
| Utility + biểu giá + thủ tục đấu nối | Bảng 4 `Điện và lưới điện`, Kết luận cuối `Khả năng đáp ứng của hạ tầng điện` |
| Permit + điều kiện đầu vào + thời gian xử lý | Bảng 4 `Pháp lý và giấy phép`, Kết luận cuối `Thủ tục pháp lý có nguy cơ làm chậm dự án` |
| Nhà thầu + NCC + logistics + CPO + đối tác | Bảng 4 `Nhà thầu` / `Nhà cung cấp và thiết bị`, Kết luận cuối `Nhà thầu phù hợp sơ bộ` |
| Quy mô xe + hạ tầng sạc hiện hữu + điện + an ninh/khí hậu | Bảng 1 `Kết luận tổng quan`, Kết luận cuối `Đặc điểm thị trường ảnh hưởng lớn nhất` |
| Tỷ giá + logistics + utility + nhà thầu | Kết luận cuối `Rủi ro lớn nhất đối với chi phí` |

Each of these is written as **nguyên nhân → tác động → mức độ chắc chắn**, capped at the 3–5
findings the framework asks for, every one resting on a cell already filled above it. A finding that
cannot be traced back to a filled row does not go in.

`Nhà thầu phù hợp sơ bộ` is a shortlist with evidence and gaps — explicitly **not** a selection.
Assess a contractor, supplier or partner from public evidence or the user's documents only: **never
infer financial or technical capacity from the absence of a record.**

**Khu vực ưu tiên is asked for and a site call is not** — the distinction the framework draws at
dòng 14, and the one place this section still ranks anything. A region may be put ahead of another on
public evidence (xe và đội xe, hạ tầng sạc hiện hữu, điện, an ninh), with the evidence named. A
specific địa điểm is never called ready or suitable: quyền sử dụng đất, công suất điện tại chỗ and
pháp lý decide that and none of the three is public. Name them as what the user has to confirm
offline.

## 7. The output file

**The blank framework ships with this skill**: `assets/khung-bao-cao-thi-truong.xlsx`, next to this
file — two sheets, `Khung báo cáo thị trường mẫu` (the customer's structure) and `00 - Hướng dẫn`
(the rules every cell is written under). It travels with the plugin, so the report can be produced on
a machine that has never seen the customer's own copy. Take it from there, always.

**Copy the asset to the output path, then fill the copy.** Never write into the asset — it is the
blank every later report starts from, and a filled one poisons the next market. The asset stays the
reference copy of the guidance; the output file is the one that gets written over.

**Copy it before the research starts, and write each group's rows the moment that group is done** —
not once at the end. A run that researches ten groups and then writes the file has nothing on disk when
it hits the quota ceiling of section 4, and the whole spend is lost. Filled group by group, the same
interruption leaves a real file with six blocks sourced, and the next session reads the log and
continues instead of starting over. The `Kết luận` blocks are the exception and go last — they are
written from the filled blocks above them, per section 6.

**The framework carries its own instructions in the cells that answers go into.** In the data rows,
`B` onward holds the rule for what belongs there, not a value. Filling the report means **replacing
that instruction text with the answer** — that is intended, the guidance lives on in the asset and in
`00 - Hướng dẫn`, which is copied across untouched and never filled. A cell that still contains its
original instruction text at the end is an unfilled cell, and counts as one.

**Not every cell is a data row.** Rows 2, 16, 27 and 36 are column headers, rows 15, 26, 35, 47 and 51
are block titles, and `B47` / `B51` carry the result format for the two conclusion blocks. None of
them is written to. `B46` does not exist as a cell — it is merged into `A46` — so the `Tổng kết` row
of Bảng 4 is filled at `C`–`F` only, and writing `B46` fails.

Because those instructions repeat identically down each column of Bảng 2, 3 and 4, they do not need
reading row by row — the column rules are restated once in the layout below. Copy the asset with a
file copy, write into cells, and never pull the blank's instruction text into the conversation.

If the project folder happens to carry the customer's own framework file and its `Khung báo cáo thị
trường mẫu` sheet differs from the asset — a row added, a table retitled — **the customer's file
wins**: copy that file instead and say in the reply which one was used. Their template is the
deliverable's shape; ours is the portable fallback. Check the row numbers of the layout table below
against whichever file was copied before writing a single cell.

Name the output `Báo cáo thị trường [Thị trường] dd_mm_yyyy.xlsx`, in the project folder —
`Báo cáo thị trường Bo Bien Nga 11_08_2026.xlsx`. Underscores in the date, and **no ` - ` anywhere in
the name**: a name with two ` - ` separators is read as a plan file by every other Doox skill
(`using-doox`, "Plan file naming") and would land in tomorrow's reminder as a project. The source-log
folder of section 4 sits beside it under the matching name, and the same ` - ` rule holds for the files
inside it.

The framework's own layout, to fill in place — do not renumber, retitle or reorder it. Column `A`
always holds the group name and is never written to:

| Block | Rows | Cells to fill | The column rule, stated once |
|---|---|---|---|
| Bảng 1 — Tổng quan thị trường và nhu cầu sạc | 3–14 | `B`, `C` | `B` = nội dung đầu ra (the bullets that row asks for); `C` = kiểm chứng — phạm vi, đơn vị, kỳ dữ liệu, nguồn/URL và ngày, giới hạn |
| Bảng 2 — Pháp lý, giấy phép, thủ tục | 17–25 | `B`–`E` | `B` cơ quan xử lý + URL chính thức; `C` tên/số văn bản, điều khoản, ngày hiệu lực, hồ sơ và thứ tự; `D` thời gian xử lý — công bố hay thực tế, có nguồn; `E` phí chính thức, tách riêng chi phí tư vấn |
| Bảng 3 — Nhà thầu, NCC, đối tác địa phương | 28–34 | `B`–`F` | `B` 3–5 đơn vị, tên pháp lý + website + liên hệ; `C` phạm vi cung cấp; `D` pháp lý/chứng nhận có tên, số, đơn vị cấp, hiệu lực; `E` dự án tham chiếu có địa điểm, năm, nguồn; `F` năng lực và hiện diện địa phương |
| Bảng 4 — Rủi ro và kế hoạch xác minh | 37–45 | `B`–`F` | `B` rủi ro viết theo nguyên nhân – sự kiện – hậu quả; `C` khả năng xảy ra; `D` tác động tiến độ; `E` tác động chi phí; `F` khả năng kiểm soát + biện pháp |
| Bảng 4 — dòng `Tổng kết` | 46 | `C`–`F` only | `B46` is merged into `A46` and cannot be written |
| Kết luận pháp lý | 48–50 | `B` | mỗi ô: kết luận \| trạng thái \| nguồn và ngày \| giới hạn \| hành động xác minh |
| Kết luận phân tích cuối cùng | 52–58 | `B` | mỗi ô: kết luận \| trạng thái \| nguồn và ngày \| giới hạn \| bước tiếp theo |

`C` and `F` of Bảng 4 take `Cao` / `Trung bình` / `Thấp` — or `Chưa đủ dữ liệu`, which is the right
answer far more often than it feels, and a level is only picked when the evidence for it is named in
the same cell. `D` and `E` want a quantity first — số ngày/tuần, khoảng tiền or % ngân sách — and
fall back to the same levels only when there is no data to quantify with.

More than one unit per row — several contractors in a group, several risks in a group — means
**inserting rows inside that block**, keeping the group name in `A`. Never overwrite a neighbouring
block, never append a table of your own at the bottom.

**Insertion breaks every row number below it, so leave it to the end.** Write all the fixed rows of
the layout above first; then, if rows must be added, insert them **bottom block upward** — Kết luận
cuối before Bảng 4, Bảng 4 before Bảng 3 — so the numbers of the blocks not yet touched stay valid.
Re-read the sheet after inserting rather than trusting the table above, and check that the merged
ranges and the block titles still sit where they did.

**Every table carries data and its source.** An empty table is not shipped; a table with nothing
verified says `Chưa xác minh` in its rows, with what data would close it and who confirms it. Blank
cells are allowed where nothing is known — generic filler prose is not, and neither is leaving the
blank's instruction text in place.

The two conclusion blocks are **summaries of rows already filled above**, not new analysis and not a
verdict — see section 6. There is no `Mức độ sẵn sàng chung` row in this framework and none is to be
added.

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
