# General Marketing Dashboard

A starter template for a **multi-location marketing performance dashboard**, built with Next.js 15, Tailwind CSS v4, Recharts, and shadcn-style primitives.

All data in this template is **fictional**. Fork, swap in your real data layer, and go.

---

## What you get

- **Overview page** — portfolio-wide KPIs (sessions, leads, calls, spend, cost/lead) with a 90-day trend
- **Locations index + detail pages** — fictional multi-location footprint with per-location KPIs & trend
- **Digital** — blended paid-media KPIs (spend / clicks / CTR / ROAS) with trend
- **Calls** — call-tracking placeholder with answer rate and category breakdown
- **SEO** — organic traffic health KPIs with trend
- **Budgets** — month-to-date pacing bars by channel
- **Tools / UTM Builder** — a working client-side URL tagger

Plus:

- **Optional HTTP Basic Auth** middleware (`src/middleware.ts`) — toggled on by setting `AUTH_USER` + `AUTH_PASS`
- **Mock data generator** (`src/lib/mock-data.ts`) — swap this for your real queries
- Reusable components in `src/components/dashboard/`: `KpiStrip`, `MetricCard`, `DeltaPill`, `TrendChart`, `LocationsTable`, `CallsCategoryChart`, `AppShell`, `AppNav`

## Quick start

```bash
pnpm install   # or npm install / yarn
pnpm dev
# open http://localhost:3000
```

## Making it yours

1. **Rename the brand**: replace `"General Marketing"` in `src/components/dashboard/app-shell.tsx` and `metadata.title` in `src/app/layout.tsx`.
2. **Swap the color**: edit `--primary` in `src/app/globals.css` (currently a mid-blue).
3. **Replace the data layer**: `src/lib/mock-data.ts` is the only data source. Replace the exports with calls to your real backend (GA4, HubSpot, CallRail, your DB, etc.) — the component contracts stay the same.
4. **Add pages**: new routes go under `src/app/<section>/page.tsx`. Add a nav entry in `src/components/dashboard/app-nav.tsx`.
5. **Lock access**: set `AUTH_USER` and `AUTH_PASS` in your hosting env to require a browser Basic-auth prompt.

## Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout wraps everything in AppShell
│   ├── page.tsx              # Overview
│   ├── locations/
│   │   ├── page.tsx          # Locations index
│   │   └── [slug]/page.tsx   # Location detail
│   ├── digital/page.tsx
│   ├── calls/page.tsx
│   ├── seo/page.tsx
│   ├── budgets/page.tsx
│   └── tools/
│       ├── page.tsx
│       └── utm-builder/page.tsx
├── components/
│   ├── dashboard/            # Business-facing dashboard pieces
│   └── ui/                   # Generic primitives (Card, Badge)
├── lib/
│   ├── mock-data.ts          # ⬅︎  Replace with your real data
│   ├── types.ts
│   └── utils.ts
└── middleware.ts             # Optional Basic Auth gate
```

## Stack

- [Next.js 15](https://nextjs.org/) with the App Router
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config via `@theme`)
- [Recharts](https://recharts.org/) for charts
- [Lucide](https://lucide.dev/) for icons
- TypeScript strict mode

## License

MIT — use freely for any project.
