# PERFORMANCE_REPORT — BGC-003

**Environment:** `next build` + `next start` (production), Node 24.21, measured via curl + Chrome Performance API (Playwright). **Local numbers — indicative only; run Lighthouse against real staging URL in BGC-004.**

## Web Vitals (production build, 1440×900)

| Metric | Value | Threshold (good) | Status |
|---|---:|---:|---|
| TTFB | ~14ms | <800ms | ✅ |
| FCP | 172ms | <1800ms | ✅ |
| LCP | 172ms | <2500ms | ✅ |
| CLS | 0.000 | <0.1 | ✅ |
| DOM loaded | ~35ms | — | ✅ |
| Fully loaded | ~170ms | — | ✅ |
| Total transfer | ~331KB | — | ✅ |
| Resources | 12 | — | ✅ |

LCP = FCP — the hero H1 paints on first frame; nothing lazy-blocks it.

## SSR cost of nonce CSP (Phase 4 investigation)

Measured TTFB across 8 sequential requests: **6.4–8.4ms** (`curl time_starttransfer`). The page is server-rendered per request solely so the nonce can differ; render work is a single static-markup pass (no DB, no fetch). Conclusion: **immaterial cost** for this content profile. See `SECURITY_REVIEW.md` for the full keep-vs-static analysis — recommendation is to keep dynamic SSR + nonce CSP.

## Asset optimization

| Asset | Handling |
|---|---|
| Fonts (Newsreader, Public Sans) | `next/font` → self-hosted `.woff2`, `preload`, no runtime Google Fonts request, no external font CSS |
| Logo | `bgc-logo.png` served from `/images`, `priority` preload in head |
| Africa map | Inline `<symbol>` SVG — zero network cost, cached with HTML |
| JS | Route-split by Next; only interactive islands (Header, ContactModal, ScrollReveal) ship client JS |
| CSS | Tailwind v4 build — single stylesheet, design tokens via CSS vars |

## No-JS / robustness

- Page is fully readable server-rendered; nav anchors, content, footer all work without client JS.
- Contact modal + reveal animations are the only JS-dependent UX; reveal falls back to visible under `prefers-reduced-motion`.

## Lighthouse

Not run against a URL — requires a deployed staging origin (BGC-004). Local indicators (12 resources, ~331KB, LCP 172ms, CLS 0) predict near-100 Performance/Best-Practices scores. Add a Lighthouse CI step after first staging deploy.
