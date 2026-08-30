---
name: market-research
description: Use when a user asks for EV-charging market research, a market report, market screening, deployment evidence, legal/utility/vendor research, or completion of the saved EV market-report workbook for a named country, city, region, or site cluster.
---

# Market Research

## 1. Contract

Produce a **sourced EV-charging market report in the saved `.xlsx` framework**. The report is evidence for human review, not an investment verdict, site-readiness certification, legal opinion, utility commitment, or vendor quotation.

Permanent plugin files stay minimal:

- `SKILL.md` — research and verification method.
- `references/contractor-enumeration.md` — §6 and §12E, read only for a contractor objective.
- `scripts/wb.py` — workbook inspector and batch writer.
- `assets/khung-bao-cao-thi-truong.xlsx` — output schema and cell-level requirements.

Do not add permanent claim/source/config files. Claim and evidence ledgers are runtime state only.

## 2. Scope and mode

Use facts already supplied; do not ask again. Resolve only what materially changes the research:

- market/jurisdiction and geographic scope;
- objective(s): market screening, investment due diligence, site selection, legal/permit, contractor/vendor, competitor/CPO;
- report data-lock date;
- relevant project facts already known (station model, fleet, vehicle type, candidate sites);
- when the objective includes contractor selection: the **contractor target profile** — default `tổng thầu turnkey` (see §6). Do not ask again if the user already stated it.

Ask for a missing essential in one structured-question call covering everything still unknown — never as a numbered list of questions in prose, and never one question per turn.

Default to the latest public data available as of the report date. Default mode is `nhanh`; use `sâu` when the user asks, or when the objective includes investment due diligence, site selection, legal/permit determination, or contractor/vendor selection.

If a requested city/site conclusion has only national evidence, keep the local claim `Chưa xác minh`; never scale or infer it silently.

## 3. Read the framework first

Before researching, inspect the actual workbook being used. If the user supplies a framework, it wins over the bundled asset. Otherwise copy `assets/khung-bao-cao-thi-truong.xlsx` to the output path and never edit the asset.

Treat the workbook as the **output contract**:

- `00 - Hướng dẫn` defines status, evidence, date, estimate, gap, and conclusion rules and remains unchanged.
- Default output name: `Báo cáo thị trường [Thị trường] dd_mm_yyyy.xlsx`, unless the user/project specifies another naming convention. Whatever the name, it must not split into three parts on ` - `: `using-doox` reads any such spreadsheet as a project plan file and pulls the report into the daily reminder.
- The report sheet defines what each row/column requires and its quality standard.
- Instruction text in writable report cells is placeholder text to replace, not content to preserve.
- Do not rely on remembered row numbers, merged ranges, or layouts; inspect them before writing. Write a merged range at its top-left anchor cell; writing any other cell of the range fails.
- Do not insert, delete, renumber, retitle, or reorder framework rows unless the workbook itself explicitly requires repeatable rows or the user asks.
- The contractor-list sheet (`Bảng 3B - Danh sách nhà thầu` in the bundled asset) **is** a repeatable-row sheet: one row per company, one row per exclusion, plus the coverage block. It ships with blank rows already reserved for both lists — fill those first, and insert further rows only when they run out, taking care not to overwrite the block titles below. Inspect the actual row positions before writing.

Inspect and write with the bundled script, never with ad-hoc spreadsheet code. The report sheet declares about 22,000 cells and fills under 300 of them; an unguarded row loop prints thousands of empty rows and can cost more than the entire research run.

```bash
python scripts/wb.py inspect <file.xlsx> [--sheet "NAME"] [--max-chars N]   # non-empty cells + merged ranges
python scripts/wb.py write   <file.xlsx> cells.json                          # {"sheet": {"B7": "value"}}
```

Inspect one sheet at a time — the sheet whose block is being written now — rather than the whole workbook. `write` validates the whole batch first: an unknown sheet or a non-anchor merged cell fails the batch and writes nothing, so a rejection costs one error line instead of a corrupted file. Batch each report block into a single `write` call.

## 4. Atomic claims: research only what the workbook needs

In the same pass that reads the framework, silently split every writable row into **atomic claims** — the whole workbook at once, not row by row. Every number, percentage, date, range, currency value, legal assertion, licence/certification status, named operator/partner fact, and factual premise used in a conclusion is a claim.

Then **batch the claims by the authority that will answer them**, not by row. One tariff order, registry page or statistics release usually answers several claims spread across unrelated rows; researching row by row fetches the same document repeatedly. A batch is one authority/document plus every claim it can close.

Each claim must end as exactly one report status from `00 - Hướng dẫn`:

- `Đã xác minh` — directly supported for the stated scope/period and valid for that wording;
- `Ước tính` — reproducible calculation/inference with sourced inputs and assumptions;
- `Chưa xác minh` — public evidence is insufficient or local confirmation is required;
- `Không áp dụng` — positive evidence shows the requirement does not apply.

Never write an untracked factual number or silently fill a gap from model knowledge.

Priority is driven by the user's objective. Decision-grade claims — anything affecting legal applicability, permit, interconnection, cost, tax, schedule, current licence/certification, site feasibility, contractor selection, or a final conclusion — receive the strongest verification first.

For contractor/vendor claims, **supply-chain role** (§6 taxonomy) is its own decision-grade claim, separate from licence and project-experience claims. Never infer it from a first-party capability statement alone. Building the candidate list itself is a claim-generating task with its own method — see §6; do not start it with a generic web search.

## 5. Source quality and claim authority

A reputable source is not automatically authoritative for every claim. Verify a claim with the source that has authority or direct knowledge for **that claim**.

| Claim type | Preferred evidence |
|---|---|
| law, licence requirement, permit, official fee, tax | current legislation/gazette, issuing authority, regulator, municipality, tax authority |
| electricity tariff, riders, interconnection, grid outlook | regulator-approved tariff/order, utility, system operator/ISO |
| EV registrations, fleet, population, official counts | registration/transport/statistics authority |
| vehicle/equipment specifications | OEM technical material; certification authority for certification status |
| public charging network | government/open dataset when available; CPO first-party for its own network; credible independent source only when primary data is unavailable |
| contractor/vendor services and contact | first-party website is valid for self-described capability/contact; licence/certification status requires the issuing registry; project experience is stronger from owner/tender/permit evidence |
| contractor supply-chain role and turnkey capability | first-party self-description alone is never sufficient — see §6 |
| payment/telecom | regulator and provider first-party terms/coverage |
| climate, hazards, public safety | meteorological, environmental, emergency/public-safety or municipal authority |
| costs | official fees/tariffs, published prices, quotations, or transparent industry studies; modelling assumptions must be labelled as assumptions |

Evidence classes:

- **A — authoritative primary:** government, regulator, legislation, statistics, utility/ISO, official registry.
- **B — first-party:** OEM, CPO, contractor, supplier, bank/telco/provider; valid only within its direct self-knowledge.
- **C — credible independent:** academic/professional institutions, IEA/World Bank-type bodies, reputable journalism/industry associations.
- **X — discovery only:** SEO pages, aggregators, generic blogs, social posts, forums, directories, AI/listicles. X may identify a lead but never supports a report fact.

Before using a source, confirm the publisher/domain identity and document provenance; search ranking, branding or a plausible URL is not proof of legitimacy. Every cited URL must have been opened/read in the run, or recovered from a trusted prior evidence ledger that is still within the report's data window.

When a secondary source cites an original dataset/order/law, follow the citation chain and use the origin. Two URLs that derive from the same origin are **one** evidence source, not an independent cross-check. User-supplied documents may be evidence when relevant; identify them as supplied documents and do not let them override a current regulatory authority on regulatory claims.

## 6. Contractor enumeration and tier classification

**When the objective includes contractor selection, read `references/contractor-enumeration.md` before starting the candidate list, and follow it.** It carries the target profile and role taxonomy (§6.1), the frame-first enumeration frames F1–F10 (§6.2), mã ngành reading (§6.3), turnkey evidence (§6.4), credibility scoring (§6.5), the saturation stop rule and separate budget (§6.6), and audit E (§12E). Everything in it is decision-grade, and the rest of this file cites its subsection numbers directly.

Do not attempt contractor work from the summary above: a generic web search ranks intermediaries first, so a list built without the frames is a list of resellers.

## 7. Freshness, scope and meaning

For every sourced claim capture separately when applicable (if a page has no publication date, say so and retain the access date):

- data/reference period;
- publication date;
- effective/version date;
- access date;
- geography, population/customer class, unit and conditions.

A current webpage does not make an old figure current. For a current-state question:

- FX, tariffs, fees, law, permits, licence/certification status and service pricing: use the current effective version/date;
- market/fleet/charger counts: use the latest official reporting period found and state that period explicitly;
- vehicle/equipment specs: use the correct model/version;
- climate/geography: use the latest authoritative canonical dataset appropriate to the metric.

If the latest public figure is older than the report date, write it as a dated historical/latest-public figure and name the current-data gap; do not relabel it as current.

Preserve source definitions. Do not treat these as synonyms without evidence: `station/location/site`, `port/connector/EVSE/charger`, `BEV/PHEV/ZEV`, `registered/on-road/ordered/planned`, `charger output/vehicle acceptance`, `energy rate/demand charge/rider/tax/total delivered cost`.

## 8. Research engine: minimum search for sufficient evidence

Every search must answer an unresolved claim.

1. **Known authority → go direct.** Search/fetch the regulator, ministry, utility, registry, statistics office, municipality or company site first; use domain-restricted queries when useful.
2. **Unknown authority → one discovery pass.** Use short local-language/English queries to identify the agency, dataset, document name or official terminology, then move to the primary source. Keep one claim/question per query; avoid multi-topic sentences. Useful patterns are `[metric] [jurisdiction] [year]`, `site:official-domain [metric/document] [year]`, and `site:official-domain filetype:pdf "[official term]"`. Contractor work uses the §6 frames, not these patterns; within a frame, useful queries are `site:muasamcong.mpi.gov.vn "[EPC | thiết kế và thi công | chìa khóa trao tay]" "[lĩnh vực]" [tỉnh]`, `"chứng chỉ năng lực hoạt động xây dựng" "[lĩnh vực]" [tỉnh]`, `"[chủ đầu tư | dự án]" "nhà thầu thi công"`, `"[company]" "thi công" OR "tổng thầu" OR "EPC"` for role corroboration, and `site:linkedin.com/company "[company]"` for the social-profile check. Do not use `-"đại lý" -"phân phối"` as an exclusion — it hides firms that both build and distribute (§6.1).
3. **Triage the result list before opening anything.** A search result list is cheap; a fetch is not. Never open a document to find out whether it is relevant. From the titles, domains and snippets alone, build a candidate line per URL — `URL | publisher identity | evidence class (§5) | claim(s) it could close | date/period signal` — then drop, without fetching:

   - class **X** (SEO pages, aggregators, listicles, directories, forums, AI summaries) — a lead only, never opened as evidence;
   - a source whose class is wrong for the claim's authority (§5 table), when a correct-authority candidate is present in the same list;
   - duplicates: same origin document, same publisher's mirror, or a secondary that visibly quotes an origin already in the list — keep the origin, drop the rest;
   - a snippet already showing the wrong geography, period, customer class or unit;
   - anything answering a claim already closed in the ledger.

   Then rank the survivors by class → directness → recency, and keep only what the claim needs: **one** document for a low-risk claim, **two independent** for a decision-grade claim. Everything else stays unopened in the ledger as an unused lead. If the gate leaves nothing usable, refine the query once rather than opening a weak source; a second empty gate is a named gap, not a third search.

4. **Read evidence, not snippets.** Open only the documents that passed the gate, and extract the exact section carrying the value and its conditions. For long documents, find the relevant article/table/tariff/customer class instead of reading the whole file.
5. **Extract immediately.** Reduce each useful source to a compact evidence record before moving on.
6. **Reuse and deduplicate.** Cache by canonical URL + version/date. Fetch a document once and reuse it for every claim it supports.
7. **Stop when sufficient.** A low-risk claim directly answered by the correct authoritative source needs no decorative extra searches. This does not apply to contractor enumeration, which stops on the §6.6 saturation rule instead.
8. **Target gaps only.** After the first pass, re-search only unresolved, stale, contradictory, semantically ambiguous, or under-verified decision-grade claims. Do not rerun a whole batch.

Verification strength:

- Low-risk factual claim: one direct appropriate A source, or appropriate B source for first-party facts, is normally sufficient.
- Decision-grade claim: require the appropriate authoritative source. If no authoritative public source exists, use two genuinely independent credible sources when possible; otherwise mark `Chưa xác minh` and name who/what must confirm it.
- One targeted re-check per doubtful claim is normally enough. Failure to close it becomes a named gap, not an invitation to unlimited searching.

Quota is a ceiling, never a target. As a guide for a full report, aim to stay around 20–35 searches in `nhanh` and 40–70 in `sâu`; stop earlier when claims are closed. Contractor enumeration (§6.6) carries its own budget on top of this and is not charged against it.

**Opened documents are the real cost, not searches.** A search result list is small; a fetched page or PDF is one to two orders of magnitude larger and it stays in context for the rest of the run. Aim to open around 10–14 documents in `nhanh` and 24–32 in `sâu`, and extract the needed section rather than carrying the document forward. If either ceiling is reached, finish the workbook with explicit gaps instead of starting another broad round.

**Dispatch only what survives the step-3 gate, and dispatch it to workers.** The gate decides *whether* a document is worth opening; the worker decides *who pays* for opening it. Both are needed: dispatching an unfiltered result list just moves the waste, and gating without dispatching still leaves every opened document sitting in the main context for the rest of the run.

Send a worker a fixed list of gate-approved URLs plus the claims that batch must close — never an open-ended "research this topic" brief, which reopens the gate inside the worker where you cannot see it. Give each worker non-overlapping authority/domain boundaries and the seen-source set; require structured evidence records back, never raw document text. If a worker finds its assigned documents insufficient, it returns the shortfall and the leads it saw; the gate is re-run in the main thread before any follow-up dispatch.

Batch of one or two short pages: open it inline. Three or more, or any long PDF: dispatch. In `sâu` dispatch is the default. When workers are unavailable, run sequentially with the same gate and the same extract-and-drop discipline.

## 9. Runtime evidence record

Keep one compact runtime ledger; it is not a permanent plugin file:

`claim | result | status candidate | scope/unit/period | source/publisher/URL | publication/effective/access date | condition/definition | output cell(s)`

For calculated claims also record:

`formula | sourced inputs | assumptions | rounding | output unit`

A source may support multiple claims. A claim may have multiple sources. If the harness may be interrupted, the ledger may be persisted temporarily beside the output and reused on resume; it is runtime output, not a plugin asset.

## 10. Conflicts and normalisation

Before comparing values, normalise only when definitions permit it:

- geography and population/customer class;
- data period;
- currency and FX date;
- tax-inclusive/exclusive basis;
- kW vs kWh and power vs energy;
- per site / station / port / charger / vehicle;
- nominal vs usable battery capacity;
- official deadline vs observed project duration.

Every conversion is an `Ước tính`/calculated claim unless the source already publishes the converted value. Record formula and inputs; never silently convert.

When sources disagree, do not average or silently choose. Record both material figures and resolve downstream use by: **authority → directness → recency/effective status → scope match → methodology → independence**. State the reason for the preferred figure. If the conflict remains decision-relevant, mark it as a limitation/gap.

## 11. Fill the workbook progressively

Write each completed report block as soon as its claims are resolved; write conclusion blocks last. Preserve the workbook's style, merges, headers and `00 - Hướng dẫn`.

For each result, follow the exact output shape required by the framework. Include exact URLs/documents, not generic homepages when a specific page/order/table exists.

Rules:

- A required field with no adequate evidence says `Chưa xác minh` and identifies the missing data, confirming body and effect of the gap.
- Estimates show formula, inputs, assumptions and limits.
- Do not invent current licence/certification, project references, costs, permit times, utility capacity, local network quality, site hazards or commercial terms.
- Company self-publication must be labelled as such when it matters to reliability.
- Conclusion rows may use only evidence already populated above. They introduce no new factual claims and cannot carry a stronger status than the weakest material premise they depend on.
- Never conclude a specific site is ready without project-specific land/right-of-use, electrical capacity/interconnection, legal/permit and cost confirmation.

### Audit each block while writing it

Most of the audit belongs here, not at the end: the block and its evidence are already in context, so checking them now is nearly free, whereas re-reading the finished workbook later reloads everything at the point where context is largest. Before moving to the next block, confirm within the block just written:

- every factual assertion — including non-numeric legal, licence, operator, vendor and causal statements — traces to the runtime ledger, or is explicitly labelled analysis/estimate/gap;
- every numeric token (integer, decimal, percentage, currency amount, date, range, kW/kWh/MW value, count, rate, CAGR, duration) is sourced evidence, a reproducible calculation, or structural metadata/label — anything else is verified, relabelled `Chưa xác minh`, or removed;
- components = reported total; percentages use the stated denominator and stay in plausible bounds; min ≤ max; FX, CAGR, totals and subtotals reproduce; units and tax basis match the wording;
- dates/effective periods match the claim, and national/regional data is not presented as city/site data;
- source wording and report metric mean the same thing;
- no instruction placeholder is left behind.

Example: if components are `22 + 322 = 344` but a source/report also states total `407`, preserve the discrepancy and verify the underlying definitions/source dates; never force the components to fit the total. Any mismatch is reported as a conflict; never average it away.

## 12. Final audit

Blocks were already audited as they were written, so this pass covers only what a single block cannot see. Run it against the runtime ledger and the blocks written in this run; do not re-read the whole workbook to perform it.

### A. Framework coverage

- Every required report row/cell is filled with evidence, an estimate, `Chưa xác minh`, or `Không áp dụng`.
- No original instruction placeholder remains in a writable report cell.
- Headers, merged structure and instruction sheet remain intact.

A cell whose block was skipped or interrupted is a coverage failure — fill it with a named gap rather than leaving it blank.

### B. Cross-block consistency

- The same metric stated in two blocks agrees, or the difference is explained.
- A lower-level count does not exceed its parent total in another block without an explained definition difference.
- Scope, unit, period and currency basis stay consistent where blocks reference each other.

### C. Conclusion lineage

Every conclusion row draws only on rows already populated above, introduces no new factual claim, and carries no stronger status than the weakest material premise beneath it.

### D. Adversarial audit of decision-grade claims

Applies to decision-grade claims and to the conclusions — not to every claim in the report. Try to disprove them:

- Is a source merely reputable but wrong authority for the claim?
- Is a current page carrying stale data?
- Is a secondary source being mistaken for the original evidence?
- Is a first-party licence/project claim being treated as independently verified?
- Is a charger rating being mistaken for vehicle acceptance, or a rider/fee for the underlying commodity price?
- Is a legal rule/version generalized beyond its conditions or no longer effective?
- Is any conclusion stronger than the evidence below it?

Fix the claim or expose the limitation before delivery.

### E. Contractor-list audit

Only when the objective includes contractor selection. Run audit E as written in `references/contractor-enumeration.md`. It is short by design — running out of budget is a reason to ship the workbook with named gaps, never a reason to skip it.

## 13. Completion and reply

The report is complete only when:

- framework coverage = 100%;
- factual-claim coverage = 100% processed;
- numeric coverage = 100% processed;
- unsupported numbers/factual claims = 0;
- unresolved decision-grade items are explicitly `Chưa xác minh` rather than guessed;
- arithmetic/unit/date/scope inconsistencies are resolved or openly reported;
- discovery-only sources do not appear as evidence;
- conclusion lineage is traceable to populated rows;
- for a contractor objective: audit E passes and the coverage block on `Bảng 3B` is filled.

“100% processed” means every required claim is verified, estimated with evidence, positively not applicable, or explicitly unresolved. It does **not** mean public information exists for every project-specific fact.

In the final reply state: output file, mode (`nhanh`/`sâu`), data-lock date, approximate searches, candidates gated out versus documents actually opened, unique evidence sources, decision-grade claims still `Chưa xác minh`, and whether all final audit gates passed. For a contractor objective also state: frames worked, companies listed, how many are `Tổng thầu turnkey`, how many in Nhóm A, whether saturation was reached, and the residual blind spots. Offer follow-up work only when the user asks or when it directly closes a named gap already present in the report.
