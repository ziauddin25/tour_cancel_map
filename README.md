# Tour Cancel Map

> We all make tour plans. Somehow, a lot of them never happen. 😂

Tour Cancel Map is a playful, bilingual (Bangla / English) web app for tracking all the places you actually **visited**, the trips you're **planning**, the ones you **cancelled** (and why), the "**one day**" dreams, and the places you've **never planned** at all. Mark districts across Bangladesh or countries around the world, jot down a little story for each, download your map as a share card — and laugh at your own cancellation rate.

## Features

- **Interactive Bangladesh map** — all 64 districts, colored by your tour status.
- **Interactive World map** — 194 countries across 6 continents, same status system.
- **Five tour statuses**: Visited 🟢 · Planned 🟡 · Cancelled 🔴 · One Day 🟣 · Never Planned ⚫.
- **Cancellation reasons** — a curated (and very relatable) list, plus a custom reason option.
- **Notes / stories** — write a short note per place; revisit it anytime from the tour history.
- **Tour history table** — chronological record list with status, reason, note (edit in a popup), and date. Shows 10 rows by default with a "Show All Records" toggle.
- **Tour status summary card** — marked count, progress bar, cancelled count, cancellation rate, and per-status breakdown.
- **Share / export** — download the map card as **PNG**, **JPG**, or **PDF**, or copy it straight to the clipboard.
- **Live demo animations** — hero cards animate the statuses on a loop (cancellation included).
- **Local first** — everything is saved in your browser's `localStorage`. No account, no backend.
- **Bilingual UI** — toggle Bangla / English with one click.

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Framework | [Next.js](https://nextjs.org) 16 (Turbopack, static rendering) |
| UI       | React 19, TypeScript |
| Styling  | Tailwind CSS v4 |
| Components | [Base UI](https://base-ui.com) (dialogs) |
| Export   | `html-to-image`, `jsPDF` |
| Icons    | `lucide-react` |

## Getting Started

Requires Node.js 20+.

```bash
npm install        # install dependencies
npm run dev        # start dev server -> http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (all routes prerendered as static)
npm run start      # serve the production build
npm run lint       # run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Home — Bangladesh map page
│   ├── world/page.tsx      # World map page (194 countries)
│   ├── tour_history/page.tsx  # Tour history (table) page
│   └── layout.tsx          # Root layout + fonts
├── components/
│   ├── layout/             # Header, Footer, hero demos, About dialog
│   ├── maps/               # BangladeshMap, WorldMap, lists, search, filters, legend, count sheets
│   ├── tour/               # TourStatusSummary, TourHistory (table + note popup)
│   ├── export/             # ShareExport (PNG / JPG / PDF / copy)
│   └── ui/                 # Button primitives
├── lib/
│   ├── storage.ts          # localStorage record store (with cross-tab sync)
│   ├── use-tour-records.ts # records hook (save, update note, status helpers)
│   ├── stats.ts            # tour statistics
│   ├── i18n.ts             # Bangla / English copy
│   ├── language.ts         # language preference
│   └── user-profile.ts     # profile (name / image) preference
├── data/                   # district / country / cancellation-reason datasets
└── types/                  # shared TypeScript types
```

## How It Works

- **Data**: All statuses, notes, and the user profile live in `localStorage` (`tour-cancel-map:*` keys). The record hook (`useTourRecords`) subscribes to storage changes, so state stays in sync across tabs.
- **Maps**: District/country boundaries are rendered as inline SVG from bundled GeoJSON-derived datasets, colored by the current status map.
- **Persistence model**: each location keeps one current record (last saved status + optional reason / note / planned or cancelled date).
- **Export**: `html-to-image` rasterizes the captured card DOM; `jsPDF` wraps it into a PDF. The captured node is kept margin-free so the output matches the on-screen layout exactly.

## Deployment

The app is fully static (no server runtime, no env vars), so it deploys almost anywhere. Recommended: **Vercel**.

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.
3. (Optional) Add a custom domain and the DNS records Vercel provides.

Any static host also works (Cloudflare Pages, Netlify, etc.) — the build output is prerendered at build time.

## Status Legend

| Status        | Color | Meaning |
| ------------- | ----- | ------- |
| Visited       | 🟢    | You actually went |
| Planned       | 🟡    | A trip is on the books |
| Cancelled     | 🔴    | Booked the dream, cancelled the plan |
| One Day       | 🟣    | "One day… definitely." |
| Never Planned | ⚫    | Never even made the plan |

## Credits

- Bangladesh & world boundaries data via geoBoundaries / Natural Earth (see footer attribution).
- Built with ❤️ (and a fair amount of 😂) by **Zia Uddin**.