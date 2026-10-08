# VISUAL_QA — BGC-003 Visual Regression Report

**Date:** 2026 (local QA environment)
**Scope:** Reference HTML (`BGC Holding.html`) vs Next.js 16 production build (`next start` on `localhost:3100`)
**Method:** Headless Chrome (Playwright 1.64, `channel: chrome`) — full-page + hero screenshots at each required viewport; screenshots in `qa/shots/`.
**Harness:** `qa/screenshot.mjs` (deterministic: disables animations/reveal states via `prefers-reduced-motion` off + forced settle wait).

## Viewport matrix

| Width | Horizontal overflow (ref) | Horizontal overflow (app) | Verdict |
|------:|--------------------------:|--------------------------:|---------|
| 375   | 0px | 0px | ✅ match |
| 430   | 0px | 0px | ✅ match |
| 768   | 0px | 0px | ✅ match |
| 1024  | 0px | 0px | ✅ match |
| 1440  | 0px | 0px | ✅ match |
| 1920  | 0px | 0px | ✅ match |

Zero horizontal overflow at every tested viewport — acceptance criterion met.

## Element-level comparison

| Element | Result | Notes |
|---|---|---|
| Logo (BGC mark) | ✅ identical | Same PNG extracted from reference; nav + footer placement identical |
| Typography | ✅ identical | Newsreader (serif display) + Public Sans (body); now self-hosted via `next/font` — visually identical, no FOUT |
| Color tokens | ✅ identical | `--ink` navy hero, `--bone` warm sections, brass/gold accents, terracotta gradient strip |
| Nav (desktop) | ✅ identical | Fixed, `.scrolled` state on scroll, active-link underline tracking |
| Nav (mobile) | ✅ identical | Burger at ≤820px, slide-down `.nav-mobile`, `aria-expanded` wired |
| Hero | ✅ identical | Layout, map SVG (byte-identical, `fill:#d92b2b` opacity), tagline, CTA |
| Africa map | ✅ identical | Extracted verbatim as `<symbol>` + `<use>` |
| Footer | ✅ identical | Mark, locations line, address block, contact links |
| Contact modal | ✅ identical | Card, fields, submit button, close ✕, backdrop |
| Reveal animations | ✅ identical | IntersectionObserver `.reveal` behavior ported 1:1 |
| Reduced motion | ✅ identical | All keyframe/transition animation suppressed |

## Intentional differences (approved PDF alignment — not regressions)

These are content corrections toward the authoritative corporate PDF, flagged in BGC-001 `CONTENT_MATRIX.md`:

1. **Hero stat strip** — now 4 cells: 11 operating companies / 6 sector groups / 4 regions / 3 offices (was vaguer copy).
2. **Sector cards** — renamed to the 6 PDF sector groups; each card lists its member operating companies.
3. **Approach** — all 9 lifecycle steps (PDF) vs the reference's 7.
4. **About** — added PDF governance block ("Disciplined ownership. Accountable delivery.") listing Capital / Mandates / Compliance / Partnership model / Risk — rendered via the existing `.about-list` row pattern; stacks cleanly on mobile.
5. **Offices** — Johannesburg/Sandton + Madeira + Shanghai (reference omitted Shanghai).
6. **Math CAPTCHA** — removed; replaced by Turnstile slot that renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set (currently absent → no widget, correct).

## Confirmed regressions

**None.** No critical or cosmetic visual regressions were found.

## Screenshots

`qa/shots/` — `ref-{375,430,768,1024,1440,1920}.png`, `app-{…}.png`, `*-hero.png`, `app-1440-modal.png`, `gov-{375,1440}.png` (new governance block).
