# BGC-009 — Production Release Report

**Result: SUCCESS — Production fully validated.**

Date: 2026-10-09 · Approver: Product Owner (explicit BGC-009 Phase 4 authorization)

## Release identity

| Item | Value |
|---|---|
| Merge commit (`origin/main`) | `0eca1d3c42e1be3f4d1a3d9080696d995bdd87d2` |
| PR | [#2](https://github.com/zefparis/bgc/pull/2) — `staging → main`, merged (standard merge, history preserved) |
| Approved source SHA | `2c90181b7312f86712ff1fdefae09891211a9f2d` ✓ matched PR head exactly |
| Previous prod SHA | `a2e1bcc454497630a38f256dca9edca957616e74` |
| Vercel production deployment | `6954303521` → `success` |
| Deployment URL | `https://bgc-p1hvudmoy-benjamins-projects-ef3852e6.vercel.app` |
| Rollback deployment | `6947555722` (`a2e1bcc`, `bgc-nickvppfg-benjamins-projects-ef3852e6.vercel.app`) — remains `success`, restorable |

## Pre-merge safety gate (Phase 4A)

- Remote state re-fetched; PR #2 open, `staging → main`, head/base SHAs exactly matching approved values.
- No additional commits had appeared on either branch.
- Production domain verified operational at pre-release state (`a2e1bcc` markers).
- Rollback deployment confirmed available and restorable before merge.

## Domain & transport (Phase 4C/4D)

| Check | Result |
|---|---|
| `https://www.bgcholding.com/` | HTTP 200 |
| `https://bgcholding.com/` | HTTP 308 → `https://www.bgcholding.com/` (canonical redirect) |
| HTTPS certificate | Valid (Vercel managed) |
| Deployment env/sha | `Production`, `0eca1d3` — correct repo (`zefparis/bgc`), correct project (`benjamins-projects-ef3852e6/bgc`) |

## Corporate compliance — 38/38 PASS (live production)

`APP=https://www.bgcholding.com node qa/content.mjs` — all assertions verified against the real production DOM:

- 11 operating-company profiles with capabilities
- 6 sector groups
- 4 geographic regions (Africa, GCC, Europe, Asia) — GCC correctly carries no office
- 3 physical offices (Johannesburg, Madeira, Shanghai)
- Full governance introduction + 5 principles
- 9-phase operational lifecycle (canonical, preserved)
- Corporate-structure footnote + institutional footer disclaimer ("…do not constitute an offer")
- Official contact details + both partners
- Legacy unsupported copy confirmed absent (five-step flow, "No two projects", "other strategic markets")

## Functional — 26/26 PASS (live production)

Navigation, mobile burger menu, contact modal, keyboard navigation, focus restoration, form validation, rate limiting (503→429 observed), reduced-motion — all pass. The Vercel preview-toolbar script that caused the single staging exception is correctly absent on production; **no exceptions, none hidden**.

Contact API degrades safely (unconfigured → honest 503/rate-limit → client `mailto:` fallback); honeypot silent-accepts; malformed input → 400.

## Responsive — 6/6 viewports PASS

375 / 430 / 768 / 1024 / 1440 / 1920px: zero horizontal overflow, zero runtime or console errors, PDF headline rendered. Evidence: `qa/shots/prod/prod-*.png`.

## Security — PASS

- Nonce-based CSP with `strict-dynamic` (verified live, matches `src/proxy.ts`)
- HSTS `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`
- No exposed credentials; no unexpected third-party scripts (only `challenges.cloudflare.com` CSP allowance, unused until Turnstile is enabled)

## SEO — PASS

- `index, follow` meta robots; `x-robots-tag` absent on production
- `robots.txt` allows all + sitemap reference; `sitemap.xml` HTTP 200
- Open Graph metadata present (title, description, url, site_name, type)

## Lighthouse (production, live)

| Category | Score |
|---|---|
| Performance | 95 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | **100** (preview's 66 was solely the intentional `noindex` header) |

## Rollback status

**Not triggered — no rollback condition met.** Rollback path preserved and verified: Vercel → promote deployment `6947555722` restores `a2e1bcc` instantly. No force-push or destructive git operation used at any point.

## Remaining issues & recommendations (noncritical)

1. **Canonical host inconsistency (pre-existing):** `og:url` and `sitemap.xml` declare `bgcholding.com` while the domain redirects apex → `www`. Lighthouse SEO is 100 regardless; recommend aligning `og:url`/sitemap to `https://www.bgcholding.com` (or emitting `<link rel="canonical">`) in a future content task. No `<link rel="canonical">` element exists — pre-existing, unchanged by this release.
2. **GitHub Actions billing lock:** CI jobs run 0 steps (account-level blocker); local gates remain the quality evidence (`tsc` ✓, `eslint` ✓, vitest 29/29 ✓, `next build` ✓ on the released SHA).
3. **Perf warnings (noncritical):** LCP discovery and unused-JS audits on 95-score performance; consider `fetchpriority=high` on the hero image in a future pass.
4. **Optional activations (out of scope):** Resend + Turnstile env vars remain unset in production — contact form correctly uses the mailto fallback.

## Git/deployment reconciliation

`origin/main` HEAD = `0eca1d3` = the commit Vercel deployed as production `6954303521`. No mismatch. This report is committed separately on `main` as documentation-only.
