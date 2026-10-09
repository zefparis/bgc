# BGC-006 — Corporate Profile Compliance Audit

**Task:** Independent content compliance audit of the deployed BGC Holding website against the official 2026 Corporate Profile PDF.
**Audit date:** 2026-10-09
**Auditor:** Devin (automated audit, manual verification)
**Status:** AUDIT ONLY — no source files modified, no production changes made. Submitted for Product Owner review before implementation.

---

## 1. Executive Summary

The deployed website at `https://www.bgcholding.com` is **materially non-compliant** with the 2026 Corporate Profile PDF. The site is structurally sound and the content it *does* render is highly faithful — nearly all rendered copy is verbatim or near-verbatim PDF text, and the company↔sector mappings are correct. However, the audit found **substantial omissions of source-document content**, concentrated in three areas:

1. **All eleven operating-company profiles are absent from the rendered site.** The PDF dedicates two full pages (04–05) to per-company descriptions and capability mandates (e.g., "Aircraft sourcing, leasing structures, flight training and simulation…"). None of this content appears on the live site — visitors see only company *names* grouped under sector cards. Notably, the descriptions already exist verbatim in `src/content/companies.ts` but are never rendered, so this is a rendering gap, not a copy-authoring gap.
2. **The institutional disclaimer is not displayed.** "Sector descriptions are indicative of each company's mandate and do not constitute an offer." is defined in `src/content/site.ts` but never rendered. Given that the site publishes sector and capability claims, the missing qualifier is a compliance-relevant omission.
3. **The governance narrative paragraph is missing** ("Projects are structured to be bankable and legally executable before capital is committed…") — a material qualifier around how the group commits capital.

Additional findings: the **GCC region** of the four-region network is absent (only Africa/Europe/Asia offices are described); the hero headline and lede are **unsupported legacy copy** not present in the PDF; and an **unsupported five-step "Understand → Deliver" flow** in the Execution section presents a competing lifecycle alongside the canonical nine-phase model.

**Weighted compliance: 71.1%** (50.5 / 71 requirement points). Strict full-coverage (EXACT + SEMANTIC): 64.8%. See §7 for calculation. No requirements were left NOT VERIFIED — all checks ran against live production.

**Deployment correspondence:** verified. The visible text of a local production build of `HEAD` (`a2e1bcc`, identical to `origin/main`) is byte-identical to the live site, and production response headers match this codebase's CSP/security configuration exactly. See §8.

---

## 2. Method & Evidence

| Step | Method | Result |
|---|---|---|
| Source of truth | `pdftotext -layout` on `BGC_Holding_Corporate_Profile.pdf` (7 pages, Skia/PDF m141, created 2026-10-08) | Full text extracted, all 7 pages audited |
| Source audit | Read of `src/content/*.ts`, `src/components/**`, `src/app/**` in `/home/ben/bgc-holding` | Complete — every content string traced |
| Production fetch | `curl -L https://www.bgcholding.com` → HTTP 200, `server: Vercel`, `x-vercel-id: cdg1::iad1::…` | Full SSR HTML captured (95,827 bytes) |
| Real-browser verification | Playwright + Chrome (channel `chrome`), `networkidle`, full scroll | Rendered `document.body.innerText` matches SSR HTML; targeted locators confirmed absences (see below) |
| Commit correspondence | `git fetch`; `HEAD == origin/main == a2e1bcc454497630a38f256dca9edca957616e74`, clean tree; local `next build` + `next start` → extracted visible text diffed vs production | **Identical** — zero diff |
| Missing-content probes (live DOM) | `page.locator('text=…').count()` on production | `disclaimer`: 0, `Aircraft sourcing…`: 0, `bankable`: 0, `trade flows and capital partners`: 0, `legal entity structure`: 0 |

Classification: EXACT MATCH / SEMANTIC MATCH / PARTIAL / MISSING / CONTRADICTORY. Visual similarity was not used as evidence.

---

## 3. Full Traceability Matrix

PDF page | Requirement | Source location | Live section | Status | Severity | Recommended correction
|---|---|---|---|---|---|---|
| 01 | Brand "BGC HOLDING" | `content/site.ts:5-6`; `Header.tsx`, `Footer.tsx` | Nav, footer | EXACT MATCH | — | — |
| 01 | Positioning "Diversified holding group · Africa · GCC · Europe · Asia" | `Hero.tsx:13` | Hero eyebrow ("A diversified holding group · Africa — GCC — Europe — Asia") | SEMANTIC MATCH | — | — |
| 01 | Headline "Eleven operating companies. One execution platform." | `About.tsx:12` | Rendered as *About* title; hero H1 uses unsupported "Building businesses. Connecting markets. Delivering projects." | PARTIAL | Material | Use PDF headline as hero H1 (or secondary); replace unsupported tagline — needs PO sign-off |
| 01 | Cover descriptor: "…builds and operates businesses across aviation, automotive, contracting, energy, trade, commodities, healthcare, security, drones, data and artificial intelligence, linking African markets with capital, technology and partners worldwide." | `content/site.ts:9-10` (paraphrase); `layout.tsx:30` | Meta description only (paraphrased, sector list dropped); hero lede is different copy | PARTIAL | Material | Render the descriptor (or verbatim close variant) in hero lede |
| 01 | Stats: 11 companies / 6 sector groups / 4 regions / 3 offices | `content/site.ts:30-35` | Hero footer | EXACT MATCH | — | — |
| 01 | Cover strip "SANDTON · MADEIRA · SHANGHAI" + "ORIGINATION. PARTNERSHIP. EXECUTION." | `site.ts:8`; `Closing.tsx:19-21` | Closing (motto verbatim; cities shown as Johannesburg/Madeira/Shanghai; Sandton in address block) | SEMANTIC MATCH | — | — |
| 02 | Group headline "A holding company built to originate, structure and deliver." | — | Absent | MISSING | Minor | Add as About headline or kicker |
| 02 | Group para 1 (diversified holding group, Sandton HQ, eleven operating companies, shared capital/governance/partnerships/project capability) | `About.tsx:15-21` | About | EXACT MATCH | — | — |
| 02 | Group para 2 (established technologies, specialist expertise, access to capital, Africa–GCC–international) | `About.tsx:22-26` | About | EXACT MATCH | — | — |
| 02 | Group para 3 (practical, execution-focused; governments, state enterprises, corporate partners…) | `About.tsx:27-32` | About | EXACT MATCH | — | — |
| 02 | Pull-quote "Opportunities create value only when they are properly executed." | `Execution.tsx:14-17` | Execution blockquote | EXACT MATCH | — | — |
| 02 | Structure triad: Holding (capital allocation, governance, group services) / Operating companies (sector vehicles, own mandates) / Partnerships (OEMs, financiers, legal, local partners) / Footprint | `locations.ts:7-26` (offices only) | About sidebar shows offices + regions; triad labels & definitions absent | PARTIAL | Material | Render the four-part structure card per PDF |
| 02 | "Six sector groups, connected through one platform." | `Business.tsx:16` | Business title | EXACT MATCH | — | — |
| 02 | Sector group: Aviation & Mobility → BGC Aviation · BGC Automotive + summary | `sectors.ts:10-15` | Business card | EXACT MATCH | — | — |
| 02 | Sector group: Infrastructure & Energy → BGC Contracting · BGC Energy + summary | `sectors.ts:17-22` | Business card | EXACT MATCH | — | — |
| 02 | Sector group: Trade & Commodities → BGC General Trading · BGC Commodities + summary | `sectors.ts:24-29` | Business card | EXACT MATCH | — | — |
| 02 | Sector group: Healthcare → BGC Pharma + summary | `sectors.ts:31-35` | Business card | EXACT MATCH | — | — |
| 02 | Sector group: Security & Defence → BGC Security · BGC Drone Technologies + summary | `sectors.ts:37-42` | Business card | EXACT MATCH | — | — |
| 02 | Sector group: Data & Artificial Intelligence → BGC Data Analytics · BGC AI Center of Excellence + summary | `sectors.ts:45-50` | Business card | EXACT MATCH | — | — |
| 03 | Headline "One holding company. Eleven sector-focused operating companies." | `About.tsx:12` (different headline) | About title carries sibling cover headline instead | PARTIAL | Minor | Add verbatim or accept cover headline substitution |
| 03 | "Each operating company carries a clear sector mandate and draws on the group for capital, governance, partnerships and execution support." | `About.tsx:15-21` (similar sense in para 1) | About | PARTIAL | Minor | Render verbatim under Business/Structure |
| 03 | All 11 operating company **names** | `companies.ts:9-164` | Rendered in sector cards | EXACT MATCH | — | — |
| 03 | Per-company sector labels (e.g. "AVIATION & AEROSPACE", "ENERGY, POWER & OIL AND GAS") | `companies.ts` (`sectorLabel` fields, verbatim) | Not rendered — only sector-group names shown | MISSING | Material | Render `sectorLabel` per company |
| 03 | Footnote "Operating companies are shown by sector; legal entity structure is available on request." | — | Absent (probe: 0) | MISSING | Material | Add footnote to Business section |
| 03 | Governance heading "Disciplined ownership. Accountable delivery." | `About.tsx:49` | About governance block | EXACT MATCH | — | — |
| 03 | Governance intro: "The holding company sets strategy, allocates capital and holds each operating company to a clear mandate. Projects are structured to be bankable and legally executable before capital is committed, and are managed through a defined lifecycle with qualified advisers in every jurisdiction." | — | Absent (probe: `bankable` → 0) | MISSING | **Critical** | Add verbatim intro above the five principles |
| 03 | Principle: Capital — "Allocated at group level against defined mandates, milestones and return expectations." | `locations.ts:37-39` | About governance | EXACT MATCH | — | — |
| 03 | Principle: Mandates — "…written sector mandate, pipeline and accountability for delivery." | `locations.ts:41-44` | About governance | EXACT MATCH | — | — |
| 03 | Principle: Compliance — "…qualified legal and compliance partners across Africa." | `locations.ts:46-49` | About governance | EXACT MATCH | — | — |
| 03 | Principle: Partnership model — "…PPP, concession and build-operate structures where public partners keep ownership of assets and data." | `locations.ts:51-54` | About governance | EXACT MATCH | — | — |
| 03 | Principle: Risk — "Counterparty, title, proof-of-funds and execution-capacity checks before any commitment." | `locations.ts:56-59` | About governance | EXACT MATCH | — | — |
| 04–05 | Operating-companies intro: "Eleven companies, each with a defined sector and mandate." + "delivery vehicles… accountable for its own pipeline, partners and execution." | — | Absent | MISSING | Material | Add as intro to a companies block |
| 04 | **BGC Aviation** — description + capabilities (Aircraft sourcing · Leasing & finance · Training & simulation · Operator services) | `companies.ts:10-23` (verbatim in source) | **Not rendered** (probe: 0) | MISSING | **Critical** | Render company detail (card/modal/sub-section) |
| 04 | **BGC Automotive** — description + capabilities | `companies.ts:24-37` | Not rendered | MISSING | **Critical** | Same |
| 04 | **BGC Contracting** — description + capabilities | `companies.ts:38-51` | Not rendered | MISSING | **Critical** | Same |
| 04 | **BGC Energy** — description + capabilities | `companies.ts:52-65` | Not rendered | MISSING | **Critical** | Same |
| 04 | **BGC General Trading** — description + capabilities | `companies.ts:66-79` | Not rendered | MISSING | **Critical** | Same |
| 04 | **BGC Commodities** — description + capabilities | `companies.ts:80-93` | Not rendered | MISSING | **Critical** | Same |
| 05 | **BGC Pharma** — description + capabilities | `companies.ts:94-107` | Not rendered | MISSING | **Critical** | Same |
| 05 | **BGC Security** — description + capabilities | `companies.ts:108-121` | Not rendered | MISSING | **Critical** | Same |
| 05 | **BGC Drone Technologies** — description + capabilities | `companies.ts:122-135` | Not rendered | MISSING | **Critical** | Same |
| 05 | **BGC Data Analytics** — description + capabilities | `companies.ts:136-149` | Not rendered | MISSING | **Critical** | Same |
| 05 | **BGC AI Center of Excellence** — description + capabilities | `companies.ts:150-163` | Not rendered | MISSING | **Critical** | Same |
| 04 | Network heading "International relationships, local execution." | `Network.tsx:10` | Network title | EXACT MATCH | — | — |
| 04 | Region Africa: "Head office in Johannesburg; active across Southern, Central, East and West Africa." | `locations.ts:12` (`role` field) | Office name + "Head office · South Africa" rendered; full description **not** rendered | PARTIAL | Material | Render `offices[].role` text |
| 04 | Region GCC: "Origination, trade flows and capital partners." | — | Absent — no GCC card; "GCC" appears only in the regions list (probe: 0) | MISSING | Material | Add GCC region card (verbatim text exists in PDF; needs content entry in `locations.ts`) |
| 04 | Region Europe: "European base in Madeira, Portugal; technology, OEM and capital partners." | `locations.ts:18` (`role`) | City/country rendered; description not rendered | PARTIAL | Material | Render `offices[].role` text |
| 04 | Region Asia: "Shanghai office covering China and wider Asia; OEM, EPC and capital partners." | `locations.ts:24` (`role`) | City/country rendered; description not rendered | PARTIAL | Material | Render `offices[].role` text |
| 05 | "WHAT WE BRING — Structure, expertise and execution." + paragraph | `Closing.tsx:12-18` | Closing (paragraph verbatim; heading substituted by "Built to deliver.") | SEMANTIC MATCH | — | — |
| 06 | Approach heading "From opportunity to operation." | `Approach.tsx:10` | Approach title | EXACT MATCH | — | — |
| 06 | Lifecycle intro "…from concept through to maturity." | `Approach.tsx:11` | Rendered as "…from concept through to **maturation**." | SEMANTIC MATCH | Minor | Correct "maturation" → "maturity" |
| 06 | Phase 01 Strategy & Origination | `approach.ts:10-14` | Approach | EXACT MATCH | — | — |
| 06 | Phase 02 Planning & Structuring | `approach.ts:16-20` | Approach | EXACT MATCH | — | — |
| 06 | Phase 03 Project Management | `approach.ts:22-26` | Approach | EXACT MATCH | — | — |
| 06 | Phase 04 Joint Venture Development | `approach.ts:28-32` | Approach | EXACT MATCH | — | — |
| 06 | Phase 05 Implementation & Incubation | `approach.ts:34-38` | Approach | EXACT MATCH | — | — |
| 06 | Phase 06 Legal & Regulatory Coordination | `approach.ts:40-44` | Approach | EXACT MATCH | — | — |
| 06 | Phase 07 Operational Management | `approach.ts:46-50` | Approach | EXACT MATCH | — | — |
| 06 | Phase 08 Advisory | `approach.ts:52-56` | Approach | EXACT MATCH | — | — |
| 06 | Phase 09 Exit & Succession | `approach.ts:58-62` | Approach | EXACT MATCH | — | — |
| 06 | "Who we work with" heading "A network spanning Africa, the GCC, Europe and Asia." | `Network.tsx:11` | Rendered as "…Europe and **other strategic markets**." | PARTIAL | Minor | Restore "…and Asia." per PDF |
| 06 | Eight network categories (Governments & state enterprises; OEMs & technology companies; Manufacturers & suppliers; Resource & energy operators; Financial & strategic partners; Infrastructure developers; Legal & compliance advisers; Local operating partners) | `partners.ts:22-31` | Network tags — all 8 verbatim | EXACT MATCH | — | — |
| 07 | "Built to deliver." | `Closing.tsx:12` | Closing H2 | EXACT MATCH | — | — |
| 07 | Closing paragraph (transaction / technology partnership / infrastructure project / new company / operational assignment) | `Closing.tsx:13-18` | Closing | EXACT MATCH | — | — |
| 07 | Motto "Origination. Partnership. Execution." | `site.ts:8`; `Closing.tsx:19` | Closing | EXACT MATCH | — | — |
| 07 | Head office: "114 West Street c/o Katherine and West / 6th Floor, Suite 43 / Sandton 2196, South Africa" | `site.ts:16-22`; `Footer.tsx:25-28` | Footer | EXACT MATCH | — | — |
| 07 | Telephone "+27 11 245 5900" | `site.ts:13-14` | Footer (`tel:+27112455900`) | EXACT MATCH | — | — |
| 07 | Email "info@bgcholding.com" | `site.ts:12` | Footer (mailto) | EXACT MATCH | — | — |
| 07 | European office "Madeira, Portugal" | `locations.ts:16-19`; `Closing.tsx`, `Footer.tsx` | Footer/closing | EXACT MATCH | — | — |
| 07 | Asia office "Shanghai, China" | `locations.ts:22-25`; `Closing.tsx`, `Footer.tsx` | Footer/closing | EXACT MATCH | — | — |
| 07 | Partners "African Energy Chamber · CLG Global" | `partners.ts:7-16`; `PartnersBar.tsx` | Partners bar (both links resolve HTTP 200) | EXACT MATCH | — | — |
| 07 | Copyright "© 2026 BGC Holding. All rights reserved." | `site.ts:23` | Footer (dynamic year → 2026) | EXACT MATCH | — | — |
| 07 | **Institutional disclaimer**: "Sector descriptions are indicative of each company's mandate and do not constitute an offer." | `site.ts:25-26` (defined, unused) | **Not rendered anywhere** (probe: 0) | MISSING | **Critical** | Render `site.disclaimer` in `Footer.tsx` |

### Site-only content not supported by the PDF (excluded from denominator)

| Site content | Source location | Status | Severity | Note |
|---|---|---|---|---|
| Hero H1 "Building businesses. Connecting markets. Delivering projects." + lede "We originate opportunities, deploy capital, build partnerships and manage projects…" | `Hero.tsx:15-19`; `site.ts:7`; `layout.tsx:34` | CONTRADICTORY (unsupported copy replacing PDF headline/descriptor) | Material | Legacy-site tagline retained; "deploy capital" is a stronger claim than the PDF's "shared capital… they draw on" |
| Section "Execution Without Complexity" / "No two projects are the same." | `Execution.tsx:10-11` | Unsupported (not in PDF) | Minor | Framing copy without source |
| Five-step flow "Understand · Structure · Build · Execute · Deliver" | `Execution.tsx:3` | CONTRADICTORY — presents a second, competing lifecycle alongside the canonical nine-phase model | Material | Remove or replace with PDF-sourced content |
| "We can assemble and manage multidisciplinary teams across jurisdictions and continents…" | `Execution.tsx:18-22` | PARTIAL — partially supported (PDF p.03 "qualified advisers in every jurisdiction"), but goes beyond source | Minor | Review with PO |
| Advisory paragraph (market entry, local content, on-the-ground partnerships) | `Execution.tsx:23-31` | Supported by phase 08 (Advisory) | — | Acceptable expansion |
| Contact modal / form | `ContactModal.tsx` | Out of scope — functional, not a corporate claim | — | — |

---

## 4. Critical and Material Discrepancies

### Critical

1. **Eleven operating-company profiles absent** — PDF pages 04–05 (descriptions + capability mandates for all 11 companies) are not rendered. Companies appear by name only. Data already exists verbatim in `src/content/companies.ts`; fix is purely presentational.
2. **Institutional disclaimer missing** — "Sector descriptions are indicative of each company's mandate and do not constitute an offer." Defined at `src/content/site.ts:25-26` but never imported by any component. Confirmed absent in live DOM.
3. **Governance intro paragraph missing** — including the commitment that projects are "structured to be bankable and legally executable before capital is committed." Confirmed absent (`bankable` probe → 0).

### Material

4. **GCC region missing from the geographic network** — the PDF lists four regions with descriptions; the site renders three offices and names "GCC" only inside the regions list. GCC's mandate ("Origination, trade flows and capital partners") is absent.
5. **Region descriptions not rendered** — Africa/Europe/Asia role text exists in `locations.ts` (`role` fields) but `About.tsx` renders only city + label + country.
6. **Per-company sector labels not rendered** — the org-chart labels (e.g., "ENERGY, POWER & OIL AND GAS") exist as `sectorLabel` in source but only sector-*group* names appear on the site.
7. **"Legal entity structure available on request" footnote missing** — a deliberate qualifier in the PDF's group-structure section.
8. **Hero uses unsupported headline/lede** — the PDF's headline and descriptor are not the hero copy; current copy is legacy-derived.
9. **Unsupported five-step execution flow** — contradicts the canonical nine-phase lifecycle presented two sections earlier.

### Minor

10. "maturation" vs PDF "maturity" (`Approach.tsx:11`).
11. Network description "and other strategic markets" vs PDF "and Asia" (`Network.tsx:11`).
12. Group-structure triad (Holding / Operating companies / Partnerships / Footprint definitions) not rendered as such.

**No incorrect company↔sector mappings were found.** All 11 names, all 6 sector groups, all 9 lifecycle phases, all 5 governance principles, and all contact particulars are verbatim-accurate where rendered.

---

## 5. Recommended Content Corrections

| # | Fix | File(s) | Effort |
|---|---|---|---|
| 1 | Render company detail (name, `sectorLabel`, description, capabilities) — e.g. expand Business cards or add a company grid/modal | `src/components/sections/Business.tsx` (+ optionally new component); data ready in `src/content/companies.ts` | Medium (UI work only — zero copywriting) |
| 2 | Render `site.disclaimer` in footer | `src/components/layout/Footer.tsx` | Trivial |
| 3 | Add governance intro paragraph verbatim above the five principles | `src/components/sections/About.tsx` | Trivial |
| 4 | Render `offices[].role` descriptions; add a GCC region entry with PDF-verbatim text ("Origination, trade flows and capital partners") | `src/components/sections/About.tsx` or `Network.tsx`; `src/content/locations.ts` | Small — GCC is a new data entry; PO authorization recommended |
| 5 | Replace hero H1/lede with PDF cover headline + descriptor | `src/components/sections/Hero.tsx`, `src/content/site.ts`, `src/app/layout.tsx` (og:description) | Trivial |
| 6 | Remove or PDF-align the "Understand→Deliver" flow and "Execution Without Complexity" framing | `src/components/sections/Execution.tsx` | Small |
| 7 | "maturation" → "maturity" | `src/components/sections/Approach.tsx:11` | Trivial |
| 8 | "other strategic markets" → "Asia" | `src/components/sections/Network.tsx:11` | Trivial |
| 9 | Add group-structure footnote + structure triad | `src/components/sections/Business.tsx` / `About.tsx` | Small |
| 10 | Render per-company `sectorLabel` | Same component as #1 | Included in #1 |

Per the task's hard stop, none of these corrections have been applied; they await Product Owner review.

---

## 6. Exact Source Files Requiring Changes

- `src/components/sections/Business.tsx` — render company descriptions, sector labels, capabilities; add structure footnote
- `src/components/sections/About.tsx` — governance intro, region role text, structure triad, group-structure headline
- `src/components/sections/Hero.tsx` — headline and lede alignment
- `src/components/sections/Network.tsx` — heading wording; optionally the four-region cards incl. GCC
- `src/components/sections/Execution.tsx` — remove/replace unsupported flow and framing
- `src/components/sections/Approach.tsx` — "maturation" → "maturity"
- `src/components/layout/Footer.tsx` — render `site.disclaimer`
- `src/content/locations.ts` — add GCC region entry (verbatim PDF text)
- `src/content/site.ts`, `src/app/layout.tsx` — hero tagline/description alignment (if fix #5 approved)

No content-data corrections needed in `companies.ts`, `sectors.ts`, `approach.ts`, `partners.ts` — all verified verbatim against the PDF.

---

## 7. Compliance Calculation

- **Requirements audited:** 71 discrete PDF-derived content requirements (per matrix §3). Site-only unsupported content tracked separately and excluded from the denominator. **Not verified / excluded:** 0 requirements. (Contact-form delivery mechanics are functional, not content; "Corporate Profile · 2026" print label is N/A to the web artifact.)
- **Status counts:** EXACT 42 · SEMANTIC 4 · PARTIAL 9 · MISSING 16 · CONTRADICTORY (site-only, excluded) 2
- **Weighted score** (EXACT = 1, SEMANTIC = 1, PARTIAL = 0.5, MISSING = 0):
  (42 + 4 + 9×0.5) / 71 = 50.5 / 71 = **71.1%**
- **Strict full-coverage** (EXACT + SEMANTIC only): 46 / 71 = **64.8%**
- **Content-accuracy of rendered copy:** among the 55 requirements with any rendered counterpart, 46 (83.6%) are EXACT/SEMANTIC — i.e., what the site says is accurate; the deficit is primarily *omission*, not error.

---

## 8. Production Verification Evidence

- `curl -sSI https://www.bgcholding.com` → `HTTP/2 200`, `server: Vercel`, `x-vercel-id: cdg1::iad1::zhqp9-1791521781338-…`, `date: Fri, 09 Oct 2026 04:56:21 GMT`. No network failures during audit.
- **Commit correspondence:** local `HEAD` = `origin/main` = `a2e1bcc454497630a38f256dca9edca957616e74`, working tree clean. Last content-touching commit: `a284c36` (BGC-003); the two subsequent commits are docs/CI only, so any deploy from `a284c36`+ yields identical page content.
- **Build-output equivalence:** `npm run build` + `next start` on `HEAD`; extracted visible text of the local build diffed against production HTML → **zero differences**. Turbopack chunk filenames differ (expected — content-hashed per build environment); this does not affect content equivalence. Exact commit SHA of the Vercel deployment is not externally attestable, but deployed *content* is proven identical to `HEAD`.
- **Codebase fingerprint on production:** response CSP (`default-src 'self'; script-src 'self' 'nonce-…' 'strict-dynamic' https://challenges.cloudflare.com; …`) matches `src/proxy.ts` and `next.config.ts` security headers exactly — confirming the deployment runs this repository's code.
- **Real-browser pass (Playwright, Chrome channel):** full-page render of production; `document.body.innerText` captured and diffed; DOM probes for disclaimer, company descriptions, "bankable", GCC card, and legal-entity footnote all returned `0` matches — confirming the absences are on the live deployment, not a fetch artifact.
- Partner links verified live: `energychamber.org` → 200, `clgglobal.com` → 200.

---

# BGC-007 — Re-Audit (post-remediation)

**Re-audit date:** 2026-10-09 · **Branch:** `feat/bgc-007-content-remediation`
**Method:** identical to BGC-006 — same 71-requirement matrix, same weights
(EXACT = 1, SEMANTIC = 1, PARTIAL = 0.5, MISSING = 0). Evidence gathered from a
local production build (`next build` + `next start`, HTTP 200) rendered in
headless Chrome via `qa/content.mjs` (38/38 assertions pass) plus SSR HTML
inspection. Production re-verification deferred to staging deploy — this
branch is not deployed.

## Score

| Metric | BGC-006 | BGC-007 |
|---|---|---|
| EXACT | 42 | **69** |
| SEMANTIC | 4 | **2** |
| PARTIAL | 9 | **0** |
| MISSING | 16 | **0** |
| Weighted compliance | 71.1% | **100%** (71/71) |
| Strict full-coverage (EXACT+SEMANTIC) | 64.8% | **100%** (71/71; strict-EXACT 97.2%) |

Remaining SEMANTIC items are stylistic only (casing/punctuation of the cover
positioning strip and the cover footer strip); content is identical.

## Requirement transitions

| # (per §3) | Requirement | Previous | New | Rendered evidence | Remaining discrepancy |
|---|---|---|---|---|---|
| R3 | Cover headline | PARTIAL | EXACT | `.hero h1` = "Eleven operating companies. One execution platform." (content.mjs) | — |
| R4 | Cover descriptor | PARTIAL | EXACT | Hero `.lede` + meta description verbatim | — |
| R7 | "A holding company built to originate, structure and deliver." | MISSING | EXACT | `#about` SectionHead title | — |
| R12 | Structure triad (Holding / Operating companies / Partnerships / Footprint) | PARTIAL | EXACT | `.about-list` pillars, verbatim | — |
| R20 | "One holding company. Eleven sector-focused operating companies." | PARTIAL | EXACT | `.structure-head` above biz grid | — |
| R21 | Structure intro line | PARTIAL | EXACT | `.structure-head p`, verbatim | — |
| R23 | Per-company sector labels | MISSING | EXACT | `.biz-sector-label` on all 11 company blocks | — |
| R24 | "legal entity structure is available on request" footnote | MISSING | EXACT | `.biz-footnote` below grid | — |
| R26 | Governance intro paragraph | MISSING | EXACT | `.gov-intro`, verbatim incl. "bankable and legally executable" | — |
| R32 | Operating-companies intro | MISSING | EXACT | `.structure-head` block | — |
| R33–R43 | 11 company descriptions + capabilities | MISSING | EXACT | `.biz-company` × 11, `.biz-caps` chips — all names/descriptions/capabilities asserted | — |
| R45 | Africa region description | PARTIAL | EXACT | `.region-card` Africa, verbatim | — |
| R46 | GCC region card | MISSING | EXACT | `.region-card` GCC — "Origination, trade flows and capital partners."; no office claim | — |
| R47 | Europe region description | PARTIAL | EXACT | `.region-card` Europe, verbatim | — |
| R48 | Asia region description | PARTIAL | EXACT | `.region-card` Asia, verbatim | — |
| R50 | "What we bring — Structure, expertise and execution." | SEMANTIC | EXACT | `.exec` section kicker/title verbatim | — |
| R52 | Lifecycle intro wording | SEMANTIC | EXACT | "…from concept through to maturity." | — |
| R61 | "A network spanning Africa, the GCC, Europe and Asia." | PARTIAL | EXACT | `#network` description verbatim | — |
| R73 | Institutional disclaimer | MISSING | EXACT | `.footer-disclaimer`, verbatim, rendered desktop + mobile | — |
| All other rows (42 EXACT, R2 & R6 SEMANTIC) | — | unchanged | unchanged | — | R2/R6 remain SEMANTIC by styling only (case/separator) |

## Unsupported site-only content — resolution

| Item | Previous | Resolution |
|---|---|---|
| Hero H1 + lede (legacy tagline) | CONTRADICTORY | Replaced by PDF cover headline + descriptor (`Hero.tsx`, `site.ts`) |
| "Execution Without Complexity" / "No two projects are the same." | Unsupported | Removed (`Execution.tsx`) |
| Five-step flow "Understand · Structure · Build · Execute · Deliver" | CONTRADICTORY | Removed (`Execution.tsx`, `.exec-flow` CSS deleted) |
| "Multidisciplinary teams across jurisdictions and continents" | PARTIAL | Removed; replaced by verbatim Advisory mandate (phase 08) |
| Network "other strategic markets" | PARTIAL | Replaced with PDF wording "…and Asia." |

## Functional regression evidence

- `tsc --noEmit` clean; `eslint .` clean; `vitest run` **29/29 pass** (14 component assertions incl. new coverage for all 11 profiles, GCC card, disclaimer, governance intro, hero copy).
- `next build` clean; `qa/content.mjs` (real Chrome render): **38/38 pass** — every previously-missing item confirmed rendered; every legacy/unsupported string confirmed absent.
- `qa/functional.mjs`: **26/26 pass** — nav, anchors, active-link tracking, contact modal (open/focus/scroll-lock/Escape/focus-trap/restore), mailto fallback, mobile burger, reduced-motion, rate limiting all unchanged.

