# Karcin Automotive

Marketing site and concierge intake for Karcin Automotive — an independent
luxury auto brokerage and concierge service. Karcin connects clients with
lease, finance, purchase, and trade-in opportunities through licensed
dealership and lender partners. Karcin does not own inventory or sell
vehicles directly.

## Stack

- Next.js 14 (Pages Router) + TypeScript
- Tailwind CSS (theme tokens via CSS variables)
- Framer Motion for micro-interactions
- React Hook Form for the Vehicle Request form
- React Icons (Heroicons set)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — Next.js ESLint
- `npm run typecheck` — TypeScript with `--noEmit`

## Project layout

```
src/
  components/   Reusable UI sections (Header, Footer, Hero, RequestForm, ...)
  pages/        Next.js routes (Home, How It Works, Services, ...)
  lib/          GHL + analytics integration stubs
  styles/       Tailwind globals + CSS variables
public/
  images/       Logos, vehicle imagery (placeholders)
  fonts/        Self-hosted fonts if needed
```

## Integrations

- **GoHighLevel** — Vehicle Request form posts to a webhook configured via
  `NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL`. In dev (no webhook set) submissions
  succeed silently for UI testing.
- **Stripe** — `/payments` is a placeholder; wire `STRIPE_SECRET_KEY` and
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and add a Stripe Checkout flow before
  launch.
- **Analytics** — `lib/analytics.ts` exposes a `trackEvent` helper that
  forwards to `gtag` and `fbq` if either snippet is loaded.

## Compliance notes

The Footer carries the brokerage disclaimer on every page. The Vehicle
Request form requires explicit, per-channel consent for emails, texts, and
calls. `/privacy`, `/terms`, and `/do-not-sell` are placeholder pages — final
copy must be drafted with legal review prior to launch.
