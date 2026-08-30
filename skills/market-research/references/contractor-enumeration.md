# Contractor enumeration and tier classification

Sections 6 and 12E of `SKILL.md`, kept out of the main body because they apply only when the
objective includes contractor selection. Section and table numbering matches the references in
`SKILL.md` exactly — `§6.4` here is the `§6.4` cited there.

## 6. Contractor enumeration and tier classification

Applies whenever the objective includes contractor selection. Everything here is decision-grade.

### 6.1 Target profile — say what "Cấp 1" means in this run

Default target: **tổng thầu turnkey (EPC/EC)** — one company that self-performs construction and carries the whole scope: thiết kế, vật tư/thiết bị, thi công xây dựng và điện, xin phép, thử nghiệm/nghiệm thu, bàn giao. Only a user statement changes this.

Classify every candidate into exactly one role:

| Role | Meaning | Counts for the shortlist |
|---|---|---|
| `Tổng thầu turnkey` | self-performs construction **and** carries end-to-end scope incl. design, materials/equipment, permits, commissioning | yes — this is the target |
| `Cấp 1 chuyên ngành` | self-performs, but only a trade slice (điện, xây dựng, đấu nối) under someone else's design/permit | secondary — usable as a package member, not as tổng thầu |
| `Trung gian / Đại lý (Cấp 2)` | sells/distributes equipment or subcontracts the work out; no self-performed construction evidence | no — list with reason, never in the shortlist |
| `Chưa xác định` | registry or independent corroboration not found | no — name what is missing |

A tổng thầu turnkey buying equipment through a distributor is normal. Distribution wording, an import/wholesale secondary mã ngành, or a brand-dealer page is **not** disqualifying on its own when the primary mã ngành is construction-execution and self-performance is independently evidenced. Only the absence of self-performance evidence disqualifies.

### 6.2 Enumeration is frame-first, never search-first

A generic web search ranks intermediaries first — they buy the SEO that contractors do not need. Generic search is **class X: it may produce a lead, never a role classification, and never the shape of the list.**

Work the frames below in order; each returns candidate names that go into the ledger keyed by **mã số thuế (MST)**. Legal name, trade name and website are attributes of an MST, not separate candidates.

| # | Frame | What it yields | Class |
|---|---|---|---|
| F1 | Hệ thống mạng đấu thầu quốc gia (`muasamcong.mpi.gov.vn`) — kết quả lựa chọn nhà thầu; filter gói `EC/EPC`, "thiết kế và thi công", "chìa khóa trao tay", trạm sạc/điện/hạ tầng | winning contractor names + chủ đầu tư + scope + value + year — the strongest single frame | A |
| F2 | Chứng chỉ năng lực hoạt động xây dựng (`nangluchdxd.gov.vn` / Bộ Xây dựng, Sở Xây dựng tỉnh) — search by field and địa bàn | registry-listed firms with hạng I/II/III, field and validity. A pure trading company cannot hold one | A |
| F3 | Công ty điện lực tỉnh / EVN — danh sách đơn vị đủ điều kiện thi công đường dây và trạm biến áp | firms already accepted for grid-side work — decisive for trạm sạc | A |
| F4 | Cổng thông tin quốc gia về đăng ký doanh nghiệp (`dangkykinhdoanh.gov.vn`) — by mã ngành (§6.3) + địa bàn | legal name, MST, mã ngành chính, ngày cấp | A |
| F5 | Sở Xây dựng / Sở Công Thương tỉnh — công bố năng lực nhà thầu, giấy phép xây dựng đã cấp | local firms and the projects they were permitted for | A |
| F6 | Project-reverse: named EV/charging or comparable projects → who executed them (chủ đầu tư release, BQL khu công nghiệp, press) | firms with real delivered scope, often invisible to search | A/C |
| F7 | Snowball: subcontractors and consortium members named inside F1/F6 results; contractors used by competing CPOs | second-ring firms — the main source of list completeness | A/C |
| F8 | Adjacent-trade transfer: nhà thầu điện / trạm biến áp / hạ tầng viễn thông / cơ điện M&E with no EV project yet | capable candidates the market has not labelled "trạm sạc" | A/C |
| F9 | Hiệp hội (VACC, hội nhà thầu / hội điện lực địa phương) — danh sách hội viên | membership frame | C |
| F10 | Brand pages: "hệ thống đại lý ủy quyền" / "nhà phân phối" of charger OEMs | used **inversely** — to recognise Cấp 2 candidates and to know which firms only resell | B |

Skipping a frame is allowed only when it demonstrably does not exist for the jurisdiction; record that as a coverage note, not silence.

### 6.3 Mã ngành (VSIC) reading

Primary code in the construction-execution group is a positive signal: `4321` lắp đặt hệ thống điện, `4299`, `4290`, `4222`, `4212`, `4211`, `4100`, `4311`, `4312`, `4329`, `4330`. `7110` (kiến trúc, tư vấn kỹ thuật) is design/consulting — supportive of turnkey scope when combined with an execution code, never a substitute for one. `4610`, `4649`, `4659`, `4759`, `4791` are wholesale/retail — as the **primary** code with no execution code and no self-performance evidence, that is a Cấp 2 signal.

Record code, code description, registry URL and ngày cấp. Never classify a role from mã ngành alone.

### 6.4 Turnkey evidence

`Tổng thầu turnkey` requires at least one independent (non-first-party) item:

- a won EC/EPC/"thiết kế và thi công"/"chìa khóa trao tay" package in F1;
- chứng chỉ năng lực covering **both** thiết kế and thi công in the relevant field (F2);
- an owner/press/permit project reference that describes an end-to-end scope delivered by the firm.

First-party hồ sơ năng lực listing permits and commissioning is class B — it supports the claim but cannot establish it alone. Without an independent item, the role is `Cấp 1 chuyên ngành` (if self-performance is evidenced) or `Chưa xác định`, never turnkey.

### 6.5 Credibility scoring

Score every candidate; record the evidence for each line or write `Chưa xác minh` and what is missing. Never score from absence.

| Criterion | Required evidence | Points |
|---|---|---|
| Chứng chỉ năng lực hạng I / II / III | registry entry: số, lĩnh vực, hiệu lực | 3 / 2 / 1 |
| Delivered project | tender result or chủ đầu tư/permit record = 3; independent press = 2; self-published only = 1 | 3 / 2 / 1 |
| Longevity from ngày cấp ĐKKD | ≥5 years / 3–5 / <3 | 2 / 1 / 0 |
| Independent press naming a project | article with project name and date | 1 |
| Website and LinkedIn/social both describe thi công / xây lắp / tổng thầu / EPC | pages read in this run | 1 |
| Primary mã ngành in the execution group | code + registry source | 2 |

Grouping: **Nhóm A** ≥8 points **and** ≥1 independently sourced delivered project **and** role = `Tổng thầu turnkey`; **Nhóm B** 5–7, or ≥8 without the turnkey evidence; **Nhóm C** <5 or `Chưa xác định`. Longevity is a ranking input, not a cutoff: a young firm with an independently corroborated delivered project outranks an old firm with none — state which basis applies.

If the public description frames the company primarily around an unrelated line of business (real estate trading, general import-export, retail) and construction appears only as a secondary mention, cap the role at `Chưa xác định` regardless of mã ngành, and say so.

### 6.6 Completeness, budget and stop rule

"Đầy đủ" is a measurable claim, so measure it:

- one row per MST; merge duplicates across frames instead of listing them twice;
- every excluded candidate keeps a row in the exclusion ledger: MST, name, reason, source. Silent dropping is a coverage failure;
- record, per frame: searched yes/no, new MSTs produced;
- **stop rule: saturation** — two consecutive frames produce no new MST, and F1–F5 have all been worked. Not "3–5 found". The workbook's 3–5 minimum is a floor for the summary row, never a target for the list;
- state residual blind spots (firms with no web presence, unpublished tender results, provinces not covered).

This enumeration runs on its **own budget, separate from the §7 report quota**, because registry pages are cheap to open and the report quota would otherwise cap the list at the first few SEO results: roughly 15–25 searches and 8–12 opened documents in `nhanh`, 35–60 searches and 20–30 documents in `sâu`. §7's "stop when sufficient" does not override the saturation rule.

Dispatch frames to parallel workers by default — one worker per frame, non-overlapping, returning candidate rows (MST, name, role evidence, source URL, date) and never raw document text. A frame brief is the one exception to §8's fixed-URL rule: the frame already pins the authority and the domain, so the worker runs the §8 step-3 gate itself inside that frame and reports how many results it opened. Frames F6–F10 are the loose ones — a worker there opens only what a registry-, owner- or permit-level snippet already supports.

### E. Contractor-list audit

Only when the objective includes contractor selection:

- F1–F5 were all worked or explicitly recorded as unavailable, and the saturation rule was met or the shortfall is stated;
- every listed company has an MST, a mã ngành with registry source, a role, and the evidence behind its role and score — no row scored from absence;
- no company appears twice under different names;
- every excluded candidate is in the exclusion ledger with a reason and source;
- no `Tổng thầu turnkey` rests on first-party evidence alone (§6.4);
- no candidate was dropped only for dealer/distribution wording (§6.1);
- the shortlist is drawn from Nhóm A, or the shortfall and the reason are stated.

Running out of budget is not a reason to skip this section — it is short by design. It is a reason to ship the workbook with named gaps.
