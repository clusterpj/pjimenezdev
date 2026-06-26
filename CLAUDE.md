# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pedro's personal portfolio and services site — pedrojimenez.dev. A dark, premium, AI-integrated experience positioning Pedro Jimenez (solo full-stack dev, Santiago DR) as an elite builder across AI, automation, web/mobile apps, motion graphics, and 3D. The site itself must be proof of what Pedro can build.

Full specs: `docs/DESIGN_BRIEF.md`, `docs/BRAND.md`, `docs/SITEMAP.md`.

## Commands

```bash
npm run dev          # dev server on localhost:3000
npm run build        # production (Next.js) build
npm run lint         # ESLint

# Cloudflare Workers (OpenNext)
npm run build:cf     # build Worker + assets bundle
npm run preview:cf   # build + preview in workerd runtime (127.0.0.1:8787)
npm run deploy       # build + deploy to Cloudflare Workers
npm run cf-typegen   # regenerate cloudflare-env.d.ts from wrangler bindings
```

No test suite yet — add Vitest when unit tests are needed.

See `README.md` for the full deployment flow (login, secrets, custom domain).

## Stack

- **Next.js 15 (App Router)** — React 19, Cloudflare-compatible
- **Tailwind CSS v4** — PostCSS-based (no `tailwind.config.js`)
- **Framer Motion** — all animations (installed)
- **MDX** — blog content (to be installed)
- **Cloudflare Workers** — deployment via `@opennextjs/cloudflare` (OpenNext); static assets served through the `ASSETS` binding, Worker entry at `.open-next/worker.js` (see `wrangler.toml`)
- **Anthropic Claude API** — Concierge + Estimator (server-side only, via Workers)
- **Cloudflare Workers AI + Vectorize** — edge inference + embeddings for personalization
- **Three.js / WebGL** — reactive hero (loads post-TTI, never in critical path)

## Architecture

```
src/
  app/
    layout.tsx              # root layout — fonts, global CSS vars
    page.tsx                # home (single-scroll, all sections)
    work/
      page.tsx              # portfolio index
      [slug]/page.tsx       # case study detail
    blog/
      page.tsx              # article index
      [slug]/page.tsx       # MDX article
    contact/page.tsx
    es/                     # Spanish routes mirror EN structure
    api/
      concierge/route.ts    # → Cloudflare Worker (Claude API)
      estimator/route.ts    # → Cloudflare Worker (Claude API)
      personalize/route.ts  # → Cloudflare Worker + Vectorize
  components/               # shared UI
  lib/                      # AI client wrappers, i18n helpers, constants
  content/                  # MDX files for blog + case studies
```

AI API keys stay server-side only — never in client bundles.

## Design Tokens (Phase 0 — LOCKED)

Drop-in block for `src/app/globals.css`. Do not deviate from these values:

```css
:root {
  /* Backgrounds */
  --bg-base: #08080F;
  --bg-surface: #101019;
  --bg-surface-hover: #16161F;

  /* Brand accent — amber */
  --accent: #FFB23E;
  --accent-glow: rgba(255, 178, 62, 0.15);
  --accent-subtle: rgba(255, 178, 62, 0.08);

  /* Text */
  --text-display: #FFFFFF;
  --text-body: #C8C8D0;
  --text-muted: #7A7A88;

  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-accent: rgba(255, 178, 62, 0.30);

  /* AI state colors — reserved for AI presence ONLY, never brand accent */
  --ai-listening: #6E8BFF;
  --ai-processing: #9B6BFF;
  --ai-responding: #C8A8FF;

  /* Motion */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-instant: 80ms;
  --duration-fast: 150ms;
  --duration-default: 300ms;
  --duration-slow: 600ms;
  --duration-ai: 2400ms;
}
```

**Color rule:** Amber = brand (Pedro). Cool-violet family = AI state only. These two signal systems must never cross.

## Typography (Phase 0 — LOCKED)

| Role    | Font              | Weights     |
|---------|-------------------|-------------|
| Display | Space Grotesk     | 600, 700    |
| Body    | Inter             | 400, 500, 600 |
| Mono    | JetBrains Mono    | 400, 500    |

Type scale: `--t-xs` (11px) → `--t-3xl` (80px+). Leading: tight for display (1.0–1.15), comfortable for body (1.65). Full Latin Extended required for ES accents (á é í ó ú ñ ü).

## AI UI Rules

Every interactive component needs four states: **Default → Listening (`--ai-listening`) → Processing (`--ai-processing`) → Responding (`--ai-responding`)**.

- Processing state: never a spinner — use scan line, breathing border, or token dot stream
- Concierge: command palette / portal overlay, not a chat bubble
- Ambient glows: tied to real AI events, not decorative loops. Pulse on `--duration-ai`.
- All AI motion: breathing/pulsing 2–4s cycles, never frantic

## Routes & Sections

Home (`/`) is a single-scroll page with anchor nav: Hero → Services → Portfolio Preview → Testimonials → Blog Preview → Contact.

AI surfaces (non-page, activated from multiple triggers):
- **Concierge** — command palette overlay; knows all services, case studies, pricing, booking flow; Pedro's voice (casual, direct, technical)
- **Estimator** — drawer/full-screen; plain language → scope + timeline + ballpark budget
- **Personalization** — session-based (no login), tracks engagement, reorders portfolio cards and surfaces blog posts

## i18n

Route-based: English at `/`, Spanish at `/es/*`. All components must handle ES strings (~20% longer than EN). Blog posts can be EN-only or bilingual — author decides per post.

## Key Constraints

- **Edge-compatible** — no Node.js-only APIs; V8 isolates on Cloudflare
- **Mobile-first** — 375px baseline, 12-col desktop / 4-col mobile grid
- **No agency language** — personal brand, Pedro's voice throughout
- **WebGL loads post-TTI** — never in critical render path
- **WCAG AA minimum** — `--accent` on `--bg-base` passes; verify any new color combos
