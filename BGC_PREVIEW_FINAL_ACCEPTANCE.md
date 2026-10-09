# BGC-008E — Final Live Staging Validation (BGC-008B/C successor)

**Date:** 2026-10-09 · **Auditor:** Devin
**Staging URL:** https://bgc-git-staging-benjamins-projects-ef3852e6.vercel.app/
**Deployed commit:** `a3b9a9b980b15dbe36fab8e8515a6ed6b0b99c4b` (`origin/staging` HEAD; app content identical to validated merge `ea2c587` — only docs commits follow it)
**Result: ✅ LIVE VERIFICATION COMPLETE — all gates pass on the real deployment.**

> Supersedes BGC-008B/008C blocker status: the Product Owner disabled Vercel
> Deployment Protection; the preview now serves HTTP 200 with no SSO redirect.

---

## 1. Accessibility & deployment identity

| Check | Result |
|---|---|
| HTTP status | **200**, no redirect — verified via curl and real Chrome (Playwright) |
| SSO wall | Gone — `vercel.com/sso-api` no longer in the chain |
| Deployed commit | `a3b9a9b` — latest Vercel deployment `6953905591` on `staging`, state `success`; branch alias resolves to it |
| Content ↔ commit proof | Extracted visible text of the **live deployment is byte-identical** to a local `next build` of the staging merge commit (zero diff) |
| Production untouched | `www.bgcholding.com` still serves `a2e1bcc` (Production deployment `6947555722`); `main` unmodified |

## 2. Corporate Profile 2026 compliance — 38/38 PASS (live)

`APP=<staging-url> node qa/content.mjs` against the real deployment:

- 11/11 operating-company profiles rendered (name + mandate label + description + capability chips)
- 6/6 sector groups, verbatim summaries
- 4/4 region cards incl. **GCC** ("Origination, trade flows and capital partners.") — no fabricated GCC office
- 3/3 offices (Johannesburg / Madeira / Shanghai), Sandton HQ address, phone, email
- Governance intro verbatim incl. "bankable and legally executable" + all 5 principles
- 9/9 lifecycle phases, "maturity" wording
- Group-structure headline, mandate line, and "legal entity structure is available on request" footnote
- Institutional disclaimer rendered in footer ("…do not constitute an offer")
- Partners (African Energy Chamber, CLG Global) listed
- Hero = PDF cover headline + verbatim descriptor; all legacy/unsupported copy confirmed absent (hero tagline, five-step flow, "No two projects…", "other strategic markets")

**Compliance: 100% weighted / 0 missing** (BGC-006 71-requirement matrix — see `BGC_CORPORATE_COMPLIANCE_AUDIT.md` §BGC-007 re-audit).

## 3. Functional — 25/26 PASS (live)

`qa/functional.mjs` (APP-parameterized copy) against live staging:

- Nav scroll state, anchors, active-link tracking ✓
- Contact modal: open, focus, scroll-lock, Esc, focus trap/restore, honest mailto fallback, no false success ✓
- Mobile 375px: burger, aria-expanded, menu navigation ✓
- `prefers-reduced-motion` respected; reveal elements visible ✓
- Rate limiting live: 4×503 → 429s; honeypot silent-accept 200; malformed 400 ✓

**Single FAIL — platform artifact, not a defect:** `no external script tags` flagged `https://vercel.live/_next-live/feedback/feedback.js` — Vercel's own preview toolbar/feedback script injected by the platform on Preview deployments. Not present in application code; absent on the production deployment (production HTML carries no `vercel.live` origin). No CSP violation logged.

## 4. Responsive — all six viewports PASS (live)

Real-Chrome captures at 375 / 430 / 768 / 1024 / 1440 / 1920px: **zero horizontal overflow, zero broken layouts.** Evidence: `qa/shots/live/live-{width}.png` + `-hero.png`.

## 5. Security & performance (live)

| Check | Result |
|---|---|
| CSP | `default-src 'self'`; `script-src 'self' 'nonce-…' 'strict-dynamic' https://challenges.cloudflare.com`; per-request nonce fresh ✓ — matches `src/proxy.ts` |
| Headers | HSTS `max-age=63072000 includeSubDomains preload`, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` ✓ |
| Exposed credentials | None — GitGuardian green on the merge; no secrets in HTML; Preview env vars unset (contact API returns honest 503 → client mailto fallback, never false success) |
| Runtime errors | **Zero** console errors / pageerrors across all six viewports |
| Server logs | Not directly accessible (Vercel dashboard needs team membership); functional surface exercised incl. API — no 5xx observed |

### Lighthouse (live, Chrome headless)

| Category | Score | Note |
|---|---|---|
| Performance | **96** | LCP 2.6s, CLS 0.002, TBT 100ms, SI 1.1s, TTI 2.6s |
| Accessibility | **96** | |
| Best practices | **96** | |
| SEO | 66 | **Expected** — Vercel sends `x-robots-tag: noindex` on all preview URLs (`is-crawlable` audit). Correct for staging; production serves `index, follow` (verified BGC-006) |

## 6. Remaining issues

| # | Issue | Severity | Owner |
|---|---|---|---|
| 1 | GitHub Actions billing lock — CI executes 0 steps | External | PO (GitHub billing) — all gates verified green locally + live |
| 2 | Vercel feedback toolbar script on preview (`vercel.live`) | Cosmetic, preview-only | Optional: disable Comments/Toolbar in project settings |
| 3 | Resend/Turnstile envs unset on Preview | By design (honest 503→mailto degradation) | PO when ready (STAGING_CHECKLIST §1) |
| 4 | `og:url`/metadata points at `bgcholding.com` on the preview | Cosmetic | Optional: set `NEXT_PUBLIC_SITE_URL` to the staging URL under Preview scope |

## 7. Final recommendation

# ✅ GO for production promotion

Every acceptance gate passed against the **real live deployment**: 38/38 corporate-content assertions, 25/26 functional (the single exception is a Vercel platform artifact), 6/6 responsive viewports, zero runtime errors, full security-header/CSP compliance, honest contact degradation, Lighthouse 96/96/96.

The staged content is 100% compliant with the BGC Holding Corporate Profile 2026 and introduces no functional or visual regressions.

**Production promotion sequence (for PO approval — NOT executed):**
1. Merge `staging` (`a3b9a9b`) → `main` (or fast-forward) — or use Vercel "Promote to Production" on deployment `6953905591`.
2. Production env vars per STAGING_CHECKLIST §1 (Resend + Turnstile) — requires verified domain.
3. Verify `www.bgcholding.com` post-promotion with `qa/content.mjs` (APP=production).

**Stopped. Awaiting explicit Product Owner approval before any production action.**
