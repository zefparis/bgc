# BGC-008B — Live Preview Acceptance Verification

**Date:** 2026-10-09 · **Auditor:** Devin
**Preview URL (validated merge commit `ea2c587`):** https://bgc-5oraitlou-benjamins-projects-ef3852e6.vercel.app
**Preview URL (current staging HEAD `c8afef9` — docs commit):** https://bgc-k4pzi3828-benjamins-projects-ef3852e6.vercel.app
**Result: ⛔ BLOCKED — live acceptance could not run. STOP per task instructions.**

---

## 1. What was verified

| Check | Result |
|---|---|
| Preview deployments exist & succeeded | ✅ GitHub Deployments API: `6953739951` (Preview, `ea2c587`) and `6953826389` (Preview, `c8afef9`) — both state `success` |
| Deployed commit SHA | ✅ `ea2c58742e…` (validated merge) and `c8afef965c…` (acceptance-report docs commit) — both on `staging` |
| Commit ↔ URL mapping | ✅ `environment_url` fields map each deployment to its `*.vercel.app` URL above |
| Environment isolation | ✅ Preview environment only; production deployment `6947555722` on `a2e1bcc` untouched; no DNS/env changes made |
| **Unauthenticated HTTP access** | ❌ Both preview URLs return `302 → vercel.com/sso-api` — "Protected by Vercel Authentication" |

## 2. Exact blocker

**Vercel Deployment Protection (Vercel Authentication / SSO) is enabled on the project.** Every `*.vercel.app` URL for `bgc` redirects unauthenticated clients to the Vercel SSO flow. Verified 2026-10-09 ~05:41 UTC:

```
GET https://bgc-5oraitlou-…vercel.app/  → 302 location: vercel.com/sso-api?…
GET https://bgc-k4pzi3828-…vercel.app/ → 302 location: vercel.com/sso-api?…
```

Bypass attempts — all exhausted:

| Mechanism | Result |
|---|---|
| Plain request / browser UA | 302 → SSO wall |
| `Authorization: Bearer <token>` header | 302 — Bearer alone does not satisfy Deployment Protection |
| Local Vercel CLI credentials (`~/.local/share/com.vercel.cli`, user `lecoinrdc-7235`, `lecoinrdc@gmail.com`) | Token refreshed OK, but the identity is **not a member of `benjamins-projects-ef3852e6`** — Vercel API `GET /v9/projects/bgc` → **403**; `vercel curl` returns the protection page |
| `x-vercel-protection-bypass` secret | Not configured/available locally (PO must generate it in project settings) |
| Shareable preview link (`__vercel_share`) | None available |
| MCP Vercel connection | No MCP servers configured on this machine |

**Required PO action (any one):**
1. Vercel → `bgc` project → Settings → **Deployment Protection** → disable for Preview, *or*
2. Generate a **Protection Bypass for Automation** secret and provide it (env var — never committed), *or*
3. Generate a **shareable link** for the deployment and provide it, *or*
4. Add `lecoinrdc@gmail.com` to the `benjamins-projects-ef3852e6` team so `vercel curl` works.

## 3. Test results

| Suite | Against live Preview | Evidence available |
|---|---|---|
| 38 content assertions (`qa/content.mjs`) | **NOT RUN — blocked by SSO wall** | 38/38 pass on a local `next build` of the **same commit** `ea2c587` (BGC-008 acceptance) |
| 26 functional checks (`qa/functional.mjs`) | **NOT RUN — blocked** | 26/26 pass on the same local staging-commit build |
| Responsive 375–1920px | **NOT RUN — blocked** | `qa/shots/staging/` captures from the staging-commit build |
| Security headers / CSP on live preview | **NOT VERIFIABLE** — SSO layer responds before the app | Same middleware (`src/proxy.ts`, `next.config.ts`) verified live on production in BGC-006 |
| Runtime/server logs | Inaccessible — Vercel dashboard requires team membership (403) | — |

No substitution claimed: **live Preview remains unverified.** Local results on the identical commit are strong evidence but are reported as such, not as live verification.

## 4. Compliance vs Corporate Profile 2026

Unchanged from BGC-007 re-audit: **100% weighted (71/71 requirements), 0 missing** on the deployed commit — verified content-identical to the build that passed the full suite. The staged content is compliant; only the *live preview transport verification* is outstanding.

## 5. Remaining blockers

1. **Vercel Deployment Protection** — blocks all live preview acceptance (this task's STOP condition). PO action per §2.
2. **GitHub Actions billing lock** — CI executes 0 steps (external, unchanged since BGC-004).
3. Preview env vars (Resend/Turnstile) intentionally unset — honest `mailto:` fallback by design; no action required for content sign-off.

## 6. Production readiness assessment

**NO-GO for production promotion at this time** — not because of any code defect, but because live staging verification is a required gate and is currently unverifiable. The staged artifact itself is known-good (all gates green on `ea2c587`/`c8afef9`). Once the PO unblocks preview access, run:

```bash
APP=https://bgc-5oraitlou-benjamins-projects-ef3852e6.vercel.app node qa/content.mjs
# functional suite (APP-parameterized) + responsive passes against the same URL
```

Expected outcome based on identical-commit evidence: full pass → then production GO can be recommended.

**Stopped per hard constraints. Awaiting PO approval and/or preview-access unblock.**
