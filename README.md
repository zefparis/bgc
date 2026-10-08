# BGC Holding — Corporate Web Platform

Production-ready corporate website for BGC Holding, a diversified holding
group headquartered in Sandton, South Africa (11 operating companies, 6 sector
groups, offices in Johannesburg · Madeira · Shanghai).

Built with **Next.js 16** (App Router) · **TypeScript 5.9** (strict) ·
**Tailwind CSS 4** · deploys to **Vercel**.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command              | Purpose                            |
|----------------------|------------------------------------|
| `npm run dev`        | Dev server                         |
| `npm run build`      | Production build                   |
| `npm start`          | Production server                  |
| `npm run typecheck`  | `tsc --noEmit` (strict mode)       |
| `npm run lint`       | ESLint (next/core-web-vitals + TS) |
| `npm test`           | Vitest suite                       |

## Architecture

```
src/
├── app/                  # App Router: layout, page, api/, sitemap, robots
├── components/
│   ├── layout/           # Header (client), Footer
│   ├── sections/         # Hero, About, Business, Approach, Execution,
│   │                     #   Network, Closing, PartnersBar (server comps)
│   ├── shared/           # AfricaMap (SVG symbol), ScrollReveal, SectionHead
│   └── contact/          # ContactModal (client) + Turnstile
├── content/              # Structured content — single source of truth
│   ├── companies.ts      #   11 operating companies (per corporate PDF)
│   ├── sectors.ts        #   6 sector groups
│   ├── approach.ts       #   9-step lifecycle
│   ├── locations.ts      #   offices, regions, governance items
│   ├── partners.ts       #   named partners + network categories
│   └── site.ts           #   contact info, tagline, nav links
├── lib/                  # env.ts (zod validation), validation.ts
├── types/                # content.ts — shared content types
└── proxy.ts              # CSP nonce + security headers (Next 16 "proxy")
```

**Content ↔ presentation separation:** all corporate facts live in
`src/content/` and are derived verbatim from `BGC_Holding_Corporate_Profile.pdf`.
Components render from these structures — edit content in one place.

## Security

- **CSP** with per-request nonce via `src/proxy.ts` (`strict-dynamic`,
  `object-src 'none'`, `frame-ancestors 'none'`, Turnstile origins allowlisted).
  Nonces force dynamic rendering — this is intentional.
- **Security headers** in `next.config.ts` (HSTS, nosniff, Referrer-Policy…)
- **Contact API** (`/api/contact`): zod validation → honeypot → Turnstile
  `siteverify` → Resend send. Returns **503 when env is unconfigured** so the
  client falls back to `mailto:` — nothing is silently dropped or bypassed.
- **No secrets in client bundles.** `NEXT_PUBLIC_*` holds only the Turnstile
  site key (public by design).

## Environment

See `.env.example`. Features degrade safely when unset — nothing is required
to build or run.

## Known advisories

`npm audit` reports 5 vulnerabilities in `braces`/`micromatch`/`fast-glob`,
transitive via `@next/eslint-plugin-next` (ESLint only — dev tooling, not
shipped to the runtime). No fix exists without downgrading eslint-config-next
to v14 (breaking). Tracked; revisit when upstream patches.
