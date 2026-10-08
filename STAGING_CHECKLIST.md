# STAGING_CHECKLIST — BGC-003

Vercel staging preparation. **No deployment performed.** Do not execute the steps marked 🔐 (secrets) without Product Owner approval.

## 1. Environment variable inventory

Set in Vercel → Project → Settings → Environment Variables (scope: **Preview** / staging environment first).

| Variable | Scope | Required for | Set on staging? |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client | metadata, sitemap, canonical, og:url | ✅ staging URL (e.g. `https://staging.bgcholding.com`) |
| `RESEND_API_KEY` | server | contact email send | 🔐 only after Resend domain verified |
| `CONTACT_FROM` | server | verified sender identity | `BGC Holding Website <noreply@bgcholding.com>` (must be on verified domain) |
| `CONTACT_TO` | server | destination inbox | `info@bgcholding.com` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | client | Turnstile widget render | 🔐 after Cloudflare site created |
| `TURNSTILE_SECRET_KEY` | server | siteverify | 🔐 paired with site key |

Degradation contract: **all** contact envs may be absent → API returns 503 → client falls back to `mailto:` — never a silent failure, never a false success. Staging can deploy with **zero** secrets and still be smoke-testable.

## 2. Vercel staging configuration

- Framework preset: **Next.js** (auto-detected).
- Node version: Vercel default (≥20.9 satisfied by Next 16 requirement; pin `engines.node` if needed — currently `>=20.9.0`).
- Build command: `next build` (default). Output: `.next` (default).
- Staging source: create a `staging` branch → Vercel auto-generates a Preview deployment per push. Alternatively use the default `main` preview until cutover.
- Env scope: set variables under **Preview** (not Production) until BGC-004 promotes to prod.

## 3. Deployment checklist (execute in order)

1. ☐ `npm run typecheck` — clean
2. ☐ `npm run lint` — clean
3. ☐ `npm test` — 20/20 pass
4. ☐ `npm run build` — succeeds, routes: `ƒ /`, `ƒ /api/contact`
5. ☐ `node qa/functional.mjs` against local `next start` — 26/26
6. ☐ Push `staging` branch → Vercel builds preview
7. ☐ Set env vars per §1 (Preview scope)
8. ☐ Run smoke tests (§5) against `https://<preview>.vercel.app`
9. ☐ Run Lighthouse on staging URL — target ≥90 all categories
10. ☐ PO sign-off → promote to production in BGC-004

## 4. Rollback procedure

- **Instant:** Vercel → Deployments → select previous healthy deployment → "Promote to Production" (or "Redeploy" for preview). Rollback is atomic — no rebuild needed.
- **Git-level:** `git revert <commit>` on `staging`/`main` → push → new deployment.
- **Data:** none — stateless app, no DB. Rollback cannot lose data.
- Keep `qa/functional.mjs` runnable against any URL (`APP` env var) for post-rollback verification.

## 5. Smoke tests (post-deploy, against staging URL)

| # | Check | Expect |
|---|---|---|
| 1 | `GET /` | 200, hero + 6 sector cards render |
| 2 | Response headers | CSP w/ `nonce-`, HSTS, `X-Frame-Options: DENY` |
| 3 | View source | zero external script origins (no claudeusercontent/turnstile unless configured) |
| 4 | `/sitemap.xml` `/robots.txt` `/icon.svg` | all 200 |
| 5 | Nav: click Business/Approach/Network | smooth-scrolls, active link tracks |
| 6 | Mobile 375px | burger opens menu, no horizontal overflow |
| 7 | Contact modal | opens on Contact us, Esc closes, focus returns to trigger |
| 8 | `POST /api/contact` (valid, no env) | 503 `{ok:false}` — honest error |
| 9 | `POST /api/contact` (hp filled) | 200 `{ok:true}` — honeypot silent-accept |
| 10 | 6× `POST /api/contact` same IP | 6th → 429 rate-limited |
| 11 | With envs configured (🔐) | valid submit → 200, email lands in `CONTACT_TO` |

## 6. DNS requirements

| Record | Value | Purpose |
|---|---|---|
| `A`/`CNAME` staging | → Vercel (`cname.vercel-dns.com`) | staging hostname, e.g. `staging.bgcholding.com` |
| `A`/`CNAME` apex/www | → Vercel | production `bgcholding.com` (BGC-004) |
| `TXT` | Resend domain verification | required before `RESEND_API_KEY` sends to `@bgcholding.com` |
| `MX`/SPF | unchanged | existing mail untouched |

Turnstile: create site in Cloudflare dashboard → add staging + prod hostnames to allowed domains → issue site/secret pair per env.

## 7. Blockers before production (BGC-004)

- 🔐 Resend domain verification + API key
- 🔐 Turnstile site + secret keys
- ☐ Production DNS cutover
- ☐ Lighthouse audit on staging URL
- ☐ Product Owner approval
