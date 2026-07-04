# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pedro's personal portfolio and services site — pedrojimenez.dev. A dark, premium, AI-integrated experience positioning Pedro Jimenez (solo full-stack dev, Santiago DR) as an elite builder across AI, automation, web/mobile apps, motion graphics, and 3D. The site itself must be proof of what Pedro can build.

Full specs: `docs/DESIGN_BRIEF.md`, `docs/BRAND.md`, `docs/SITEMAP.md`.
Current state + pending-work backlog: `docs/STATUS.md`.

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

Production design source of truth: the "Website production design system" handoff (5 pages: Home, Work, Project Detail, Services, About). Case-study content lives in code, not MDX.

```
src/
  middleware.ts             # i18n: EN at /, ES at /es/* (rewrite → /en/* internally)
  app/
    [lang]/
      layout.tsx            # root layout — fonts, Nav, Footer
      page.tsx              # home (hero = live concierge, work, services, about, contact CTA)
      work/page.tsx         # portfolio index (client-side filters)
      work/[slug]/page.tsx  # case study (data-driven from lib/content.ts)
      services/page.tsx
      about/page.tsx        # bio + #contact (scoping concierge + email card)
    api/concierge/route.ts  # streaming chat, system prompts built from lib/content.ts
    sitemap.ts / robots.ts  # built-in Next metadata routes
  components/
    ai/ConciergeSurface.tsx # useConciergeChat hook + chat surface (home + contact modes)
    ai/ContactConcierge.tsx
    layout/ Nav, Footer     # nav resolves on scroll (home), solid on subpages
    sections/ HomeHero, WorkGrid
    Reveal.tsx              # IntersectionObserver scroll reveals
  lib/
    content.ts              # ALL site copy + 8 projects, EN + ES — single source of truth
    ai/                     # provider abstraction (DeepSeek, streaming)
```

AI API keys stay server-side only — never in client bundles. Email: hello@pedrojimenez.dev. GitHub: clusterpj.

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

Routes: `/` (hero concierge → work → services → about teaser → contact CTA), `/work`, `/work/[slug]`, `/services`, `/about` (+`#contact`). No blog, no separate contact page — contact lives on About.

AI surface: the **concierge** — inline chat surfaces (home hero + about contact), NOT a chat bubble or overlay. Knows all projects, availability, pricing stance; Pedro's voice (casual, direct, technical); replies in the visitor's language. States: idle → processing (3 bouncing dots, never a spinner) → responding, driven by violet-family colors only.

## i18n

Route-based: English at `/`, Spanish at `/es/*` (middleware rewrites unprefixed → `/en/*` internally; explicit `/en/*` 308-redirects to unprefixed). ALL copy lives in `src/lib/content.ts` per language. All components must handle ES strings (~20% longer than EN).

## Key Constraints

- **Edge-compatible** — no Node.js-only APIs; V8 isolates on Cloudflare
- **Mobile-first** — 375px baseline, 12-col desktop / 4-col mobile grid
- **No agency language** — personal brand, Pedro's voice throughout
- **WebGL loads post-TTI** — never in critical render path
- **WCAG AA minimum** — `--accent` on `--bg-base` passes; verify any new color combos
