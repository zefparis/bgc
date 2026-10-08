# SECURITY_REVIEW — BGC-003

**Scope:** HTTP headers, CSP, contact API, secrets handling, dependency audit, XSS/abuse surface.

## Headers (verified live on production build)

| Header | Value | Status |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'nonce-<uuid>' 'strict-dynamic' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; upgrade-insecure-requests` | ✅ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | ✅ |

## CSP architecture — nonce vs static

**Current:** per-request nonce generated in `src/proxy.ts`, applied to CSP header + stamped onto all 12 framework script tags by the App Router. This **forces dynamic SSR** on `/` (page calls `await connection()`, `cacheComponents: false`).

**Cost measured:** TTFB 6–8ms local, ~14ms via browser. SSR of this page is trivial (static markup, no data fetching), so per-request render cost is negligible now — but it permanently forgoes CDN-cached HTML, adds per-visitor server compute, and couples availability to the Node runtime.

**Alternative evaluated — hash/`'self'` CSP + static prerender:**
- External (`src=`) scripts are already covered by `'self'` — the nonce exists only for Next's inline bootstrap scripts.
- Next.js does not emit stable inline-script hashes, and `'strict-dynamic'` intentionally ignores `'self'` anyway; the only static-safe options are (a) drop nonces and allow `'unsafe-inline'` for script-src (weakens XSS posture — rejected), or (b) accept that CSP can't cover inline bootstrap and rely on `script-src 'self'` (partially weakens — injected inline scripts would still run from same-origin context only if an injection exists).
- A nonce CSP is the strongest widely-deployed posture for a Next.js app and is what Vercel/Next docs recommend for SSR'd apps.

**Recommendation:** **keep nonce CSP + dynamic SSR.** The measured cost (~7ms TTFB locally) is immaterial for a low-traffic corporate page; the XSS protection gain (injected inline scripts cannot execute) outweighs the loss of CDN HTML caching. Re-evaluate only if traffic or TTFB becomes a real constraint — at that point prefer (a) a short-`max-age` + stale-while-revalidate SSR cache at the CDN edge rather than weakening CSP. **No CSP change made** — per "do not weaken security for performance."

## Contact API (`/api/contact`)

| Control | Status |
|---|---|
| Server-side zod validation | ✅ same schema shared with client |
| Honeypot (`hp` field) | ✅ filled → silent 200, no signal to bots |
| Turnstile (server verify) | ✅ `siteverify` POST, remoteip forwarded; 400 if token missing, 403 if invalid — only when `TURNSTILE_SECRET_KEY` set |
| Resend server-only | ✅ `RESEND_API_KEY`, `CONTACT_*` never `NEXT_PUBLIC_*`; read only inside route |
| Failed-delivery honesty | ✅ Resend error → 502 `{ok:false}`; client shows real error, never success |
| Unconfigured | ✅ 503 `{ok:false,"Contact service is not configured"}` → client `mailto:` fallback |
| Rate limiting | ✅ sliding window, 5 req / 10 min / IP (x-forwarded-for / x-real-ip) → 429. **Caveat:** in-memory map — per-warm-instance on serverless, resets on cold start. Best-effort throttle, not a guarantee. Escalate to Vercel WAF / Upstash Ratelimit if abuse observed (see STAGING_CHECKLIST). |
| HTML injection into email | ✅ `escapeHtml()` on all user fields |
| Secrets in client bundle | ✅ none — `env.ts` splits public/server vars; verified no secrets in rendered HTML |

## Legacy vulnerabilities removed

- ✅ `claudeusercontent.com` scripts — gone (0 occurrences in output).
- ✅ Client-side math CAPTCHA — removed (trivially bypassable); replaced by real Turnstile.
- ✅ Inline `<script>` in markup — replaced by nonce-stamped framework scripts only.
- ✅ `mailto:`-only "submission" — now a labeled fallback, not the primary path.

## Dependency audit

- `npm audit --omit=dev` → **0 vulnerabilities** in production deps.
- `npm audit` (all) → **5 high** in `braces`/`micromatch`/`fast-glob` via `@next/eslint-plugin-next` → `eslint-config-next` (dev-only).
  - `braces@3.0.3` already installed — no patched release exists.
  - `npm audit fix --force` would downgrade `eslint-config-next` to 14.x → breaks Next 16 lint config. **Rejected.**
  - Risk accepted: advisory affects the linter's glob engine on developer machines/CI, never user input or runtime. Revisit when a fix lands upstream.

## Residual risks / notes

- Rate limiter is per-instance (see above) — acceptable for MVP; document and monitor.
- `'unsafe-inline'` in `style-src` — required by Next/font + inline style attrs; low risk, standard trade-off.
- No authentication surface, no DB, no file uploads — minimal attack surface by design.
