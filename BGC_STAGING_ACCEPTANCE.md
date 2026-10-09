# BGC-008 — Staging Deployment & Production Acceptance Gate

**Date:** 2026-10-09 · **Auditor:** Devin
**PR:** https://github.com/zefparis/bgc/pull/1
**Staging commit:** `ea2c58742e0a01198b38ee1090fe06dced8d3cf3` (merge of `140a5a9` into `staging`)
**Preview URL:** https://bgc-5oraitlou-benjamins-projects-ef3852e6.vercel.app
**Hard constraints honoured:** `main` untouched (`a2e1bcc`), no production deploy, no DNS/domain changes, no third-party services activated.

---

## 1. PR Validation (Phase 1) — PASSED

| Check | Result |
|---|---|
| Target branch | `staging` ✓ (base `a2e1bcc`) |
| Source commit | `140a5a9e` — matches the BGC-007 validated commit ✓ |
| Files changed | 15 — all within BGC-007 scope (content, sections, tests, QA script, audit doc). No unrelated modifications ✓ |
| Secrets / production config | None. GitGuardian Security Checks **pass**; diff scan clean; no `.env`, no config changes ✓ |
| Local gates on head SHA `140a5a9` | `tsc --noEmit` clean · `eslint` clean · `vitest` 29/29 · `next build` clean ✓ |
| Mergeable | `mergeable: true` |

**External blocker (not a code failure):** GitHub Actions run `37887894142` (`typecheck · lint · test · build`) failed with **0 steps executed in 1s** — the documented GitHub billing lock on the `zefparis` account (STAGING_CHECKLIST §8). All four gates verified green locally on the exact commit. PO action required: resolve GitHub billing.

## 2. Merge to Staging (Phase 2) — DONE

- Normal merge commit via GitHub API: **`ea2c587`** (history preserved, no squash/rebase).
- `origin/staging` → `ea2c587`; `origin/main` unchanged at `a2e1bcc`. ✓
- No branch protection blocked the merge (protection rules not yet configured — noted in STAGING_CHECKLIST §8).

## 3. Vercel Preview (Phase 3) — DEPLOYED, ACCESS PROTECTED

- Vercel **is** connected to `zefparis/bgc` (project `bgc`, team `benjamins-projects-ef3852e6`); GitHub deployment objects confirm:
  - Deployment `6953739951` — environment **Preview**, sha `ea2c587` → state **success** at 2026-10-09T05:31:26Z.
  - Production deployment `6947555722` on `a2e1bcc` untouched.
- Environment isolation: deployment is in the **Preview** environment; production domain and secrets untouched.
- **⛔ Blocker — Vercel Authentication (Deployment Protection):** the preview URL (and all `*.vercel.app` aliases for the project, incl. `bgc-git-staging-…` and `bgc-benjamins-projects-ef3852e6`) respond `302 → vercel.com/sso-api`. Unauthenticated access returns "Protected by Vercel Authentication". No `VERCEL_TOKEN`, Vercel CLI, protection-bypass secret or MCP connection exists on this machine.
  - **PO action:** Vercel → Project → Settings → Deployment Protection → disable for Preview, **or** generate a shareable/bypass link (or protection-bypass secret) for acceptance testing.

## 4. Acceptance Testing (Phase 4)

Preview is access-protected, so the **full suite ran against a local production build of the exact staging commit `ea2c587`** (`next build` + `next start`, real Chrome via Playwright). The deployed artifact is the same commit — content equivalence is exact, not assumed.

### Corporate Profile 2026 coverage — 38/38 assertions pass

| Requirement | Evidence |
|---|---|
| 11 company profiles + capability mandates | `.biz-company` × 11 rendered with name, mandate label, description, capability chips |
| 6 sector groups | `.biz-card` × 6, verbatim summaries |
| 4 regions incl. GCC | `.region-card` × 4; GCC = "Origination, trade flows and capital partners.", **no office claim** |
| 3 offices | Johannesburg / Madeira / Shanghai in footer + closing + region cards |
| Governance intro + 5 principles | verbatim incl. "bankable and legally executable"; Capital/Mandates/Compliance/Partnership model/Risk |
| 9 lifecycle phases | `.step` × 9, Strategy & Origination → Exit & Succession, "maturity" wording |
| Corporate-structure disclaimer | "Operating companies are shown by sector; legal entity structure is available on request." |
| Institutional disclaimer | `.footer-disclaimer` — "…do not constitute an offer" (desktop + mobile) |
| Contact + partners | `+27 11 245 5900`, `info@bgcholding.com`, Sandton address; African Energy Chamber, CLG Global |
| Hero | PDF cover headline + descriptor verbatim; legacy tagline absent |

### Functional / responsive — 26/26 pass

Nav (scroll state, anchors, active tracking), contact modal (open, focus, scroll-lock, Esc, focus trap/restore, honest mailto fallback), mobile burger (375px), `prefers-reduced-motion`, honeypot + rate limiting (503→429). No external scripts, no CSP violations.

### Responsive evidence

`qa/shots/staging/staging-{375,430,768,1024,1440,1920}.png` (+ `-hero` variants) — full-page captures at all six widths, no layout breakage or horizontal overflow observed.

### Security headers

Verified on the local staging-commit build (nonce CSP, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`). Live staging headers **not verifiable** — SSO wall returns its own response before the app. Same middleware code produces these headers on production (`bgcholding.com` verified in BGC-006).

## 5. Remaining Blockers

| # | Blocker | Owner | Impact |
|---|---|---|---|
| 1 | GitHub Actions billing lock — CI runs 0 steps | PO (GitHub billing) | CI badge red; gates verified locally instead |
| 2 | Vercel Deployment Protection on preview URLs | PO (Vercel settings or share link) | Live acceptance on the staging URL pending |
| 3 | Resend/Turnstile envs unset on Preview (per STAGING_CHECKLIST) | PO | Contact form runs mailto fallback — by design, honest degradation |

## 6. Production Release Recommendation

**Conditional GO.** Content compliance: **100% weighted / 0 missing** (BGC-006 matrix re-run — see `BGC_CORPORATE_COMPLIANCE_AUDIT.md` §BGC-007). All quality gates pass on the exact staging commit; the staging preview deployed successfully.

**Before promoting to production**, the PO should either disable preview protection or provide a bypass link so the Phase-4 suite can be re-run against the live staging URL (`APP=https://bgc-5oraitlou-….vercel.app node qa/content.mjs`), and optionally configure Preview env vars per STAGING_CHECKLIST §1.

Awaiting explicit Product Owner approval. Not promoted to production.
