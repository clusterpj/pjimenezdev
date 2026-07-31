# Project status & backlog

Last updated: 2026-07-30. This is the pick-up-where-we-left-off doc.
Architecture and conventions live in `CLAUDE.md`; this file tracks state and pending work.

## Shipped (live at https://pedrojimenez.dev)

**Production design rebuild** (commit `f8d7f46`) — the "Website production design system"
handoff implemented 1:1:

- Routes: `/` (hero = live concierge), `/work` (filters), `/work/[slug]` (7 case studies),
  `/services`, `/about` (+ `#contact`). Blog, contact page, estimator, and the ⌘K overlay
  were removed — the final design replaced them.
- ALL copy + project data in `src/lib/content.ts` (EN + ES). Concierge system prompts are
  generated from the same data in `src/app/api/concierge/route.ts` (two modes: `home` and
  `contact`/scoping).
- i18n: EN at `/`, ES at `/es/*` (middleware rewrite; `/en/*` 308s to unprefixed).
- Streaming concierge on DeepSeek. Note: `src/lib/ai/providers/deepseek.ts` buffers SSE
  lines across network chunks — removing that buffer silently drops tokens (garbled replies).
- SEO: per-page metadata, canonical + hreflang alternates, JSON-LD per page, built-in
  `sitemap.ts` / `robots.ts`.

**Portraits + OG images** (commit `fa66ff7`):

- `public/images/pedro/` — `portrait.webp` (About, 4:5), `working.webp` (home about-teaser,
  16:10), `avatar.webp` (spare, 800² — use for GitHub/LinkedIn/pedro.ai later).
- `public/images/og/` — `home.png` + `about.png` (1200×630), wired into every page's
  OpenGraph metadata. `src/app/apple-icon.png` = touch icon.
- Source PNGs were Gemini-generated (in `C:\Users\Pedro\Pictures`); crops chosen to exclude
  the generator's sparkle watermark. Regenerate variants with the prompt recipe below.

**Launch hardening + hero WebGL** (2026-07-19):

- Per-IP rate limiting (12 req/min) on `/api/concierge` + `/api/scope` via the Workers
  `[[ratelimits]]` binding (`AI_RATE_LIMITER` in `wrangler.toml`, helper in
  `src/lib/rate-limit.ts`). Fail-open in plain `next dev` where the binding is absent.
- AI-reactive Three.js particle field behind the hero concierge
  (`src/components/sections/HeroField.tsx`): amber idle drift → listening blue on input
  focus → violet family while processing/responding (driven by `pj:ai-state` CustomEvents
  from `useConciergeChat`). Pointer-reactive, Konami-code burst, lazy-loaded post-TTI via
  `next/dynamic`, skipped for `prefers-reduced-motion`, rAF paused off-screen.
- Easter eggs: styled console message (`PageTracker`), hidden concierge personality
  responses in the system prompt.
- `facebook-domain-verification` meta tag in the root layout.

## Deploy / operate

- `npm run deploy` (wrangler OAuth already logged in; `DEEPSEEK_API_KEY` is a Worker secret,
  `AI_PROVIDER=deepseek` in `wrangler.toml`). Local AI: `.dev.vars`.
- `npm run preview:cf` = workerd preview on 127.0.0.1:8787 (the real runtime — test here).
- After deploy, assets can 404 for ~1 min (edge propagation) — retest before debugging.

## Backlog (in priority order)

0. **Web Analytics beacon** — GA4 is live (`NEXT_PUBLIC_GA_ID`, `G-5MHSRK6F0J`) and fires
   `generate_lead` from both the concierge and the contact form. Cloudflare Web Analytics is
   still unset and would give a server-side number that ad-blockers can't drop: Cloudflare
   dashboard → Analytics & Logs → Web Analytics → Add site (disable automatic setup) → copy the
   beacon token into `src/app/[lang]/layout.tsx`. Wrangler's OAuth token has no RUM scope, so
   this can't be done from the CLI.
1. ~~**LuxeDrive has no image**~~ — DONE 2026-07-30. Screenshots captured by running
   `~/car-next` against the local MongoDB (already seeded: 4 users, 7 vehicles, 3 rentals — do
   NOT run `npm run seed`, it `deleteMany`s all three). Assets in
   `public/images/work/luxedrive/`. Two gotchas for next time:
   - Port 3000 was taken so Next fell back to 3001, but `.env.local` pins
     `NEXTAUTH_URL=http://localhost:3000` — credential sign-in silently fails (POST
     `/api/auth/callback/credentials` returns 200 and the session stays anon). Start it with
     `NEXTAUTH_URL=http://localhost:3001 PORT=3001 npm run dev`.
   - Admin pages need a real session, so the shots were taken by attaching to a
     separately-launched headless Chromium over CDP (Node 22 has a global WebSocket, so no
     Playwright needed) and submitting the login form. Seeded admin is
     `admin@example.com` / `adminpassword123`. Snap Chromium cannot spawn from inside node and
     has a private `/tmp` — launch it yourself and write output under `$HOME`.

   **Bug found in `~/car-next` while doing this (not fixed — it is not this repo):** the admin
   dashboard crashes to a blank page with `TypeError: Cannot read properties of null (reading
   'toFixed')` at `src/pages/admin/dashboard.tsx:712` in `DashboardCard`. The API is fine and
   returns real aggregates (`totalRentals: 3, activeRentals: 1, totalRevenue: 6400,
   availableCars: 7`) but also `percentChangeActiveRentals: null` when there is no prior period,
   and the card calls `.toFixed()` on it unguarded. Any fresh install hits this. One-line guard.
   Because of it there is no KPI-dashboard screenshot; the gallery uses the vehicle-detail and
   vehicle-management pages, and the case-study copy credits the aggregation endpoints rather
   than claiming a rendered dashboard.
2. ~~**No Automation proof project**~~ — DONE 2026-07-30. Restored `~/social-ai-app` as
   `/work/social-command` (Social Command Center), tagged `cats: ["Automation", "AI"]`, so the
   `/work` Automation filter renders again and the Automations service card links to proof
   instead of a mailto. Its `next.config.ts` redirect was removed. Screenshots were captured by
   pointing headless Chromium at `~/social-ai-app/public/admin.html`:
   `chromium-browser --headless --force-device-scale-factor=2 --window-size=1500,2600
   --screenshot=$HOME/shot.png file:///home/pedro/social-ai-app/public/admin.html`
   — note snap Chromium has a private `/tmp`, so write the output under `$HOME`. The four
   `.webp` crops live in `public/images/work/social-command/`. The 8 JPGs in
   `~/social-ai-app/data/media/` are blank-blue failed generations, not usable.
3. **Real metrics in case studies** — DONE for the four projects with local repos. All six
   blocks in `src/lib/content.ts` were rewritten from repo docs (2026-07-30): Melow from
   `~/BotForge` README + TechSpec, C21 from `~/c21-web` SEO audits, MoneyGuard from
   `~/MoneyGuard` README + ROADMAP, LuxeDrive from `~/car-next/PORTFOLIO_CASE_STUDY.md`.
   Cabarete Villas and Ruleta have no local repo — their copy is unverified beyond a live
   HTTP check on cabaretevillas.com, so treat their claims as the weakest on the site.
4. **Spanish native pass** — ES copy in `content.ts` is Claude's translation in Pedro's voice;
   read through and adjust. The six case studies were retranslated on 2026-07-30 and are the
   freshest ES on the site, so start elsewhere.
5. **Pricing stance** — the concierge is now forbidden from naming any figure (it was inventing
   ranges like "$15k–$30k" in production). That's accurate but nothing self-qualifies visitors.
   Decide a real floor, then relax the rule in `src/app/api/concierge/route.ts`.
6. **BOOKING_URL** — empty constant in `content.ts`. Paste a Cal.com/Calendly link and the
   "Book a call" card appears on `/about#contact`.
7. **OG check** — preview links at opengraph.xyz after any metadata change. OG images are JPEG
   (not WebP) on purpose: LinkedIn's scraper is unreliable with WebP. Per-project OG images are
   still a nice-to-have; case studies currently use their own screenshot as `og:image` without
   declared dimensions.
8. **Nice-to-haves from the handoff** not yet done: WebGL/motion hero extras (deliberately
   skipped — concierge is the hero), a strict CSP (blocked on inline styles + inline
   JSON-LD/gtag), visual/mobile QA at 375px.

## Project status — verified 2026-07-30

`Project.status` in `content.ts` drives the case-study label; it used to hard-code
"in production" for all of them, which was false for two.

| Project | Status | Live | Local repo |
|---|---|---|---|
| melow | production | — (client deploy) | `~/BotForge` |
| c21-perdomo | production | c21perdomo.com (200) | `~/c21-web` |
| social-command | production | — (private Telegram bot) | `~/social-ai-app` |
| cabarete-villas | production | cabaretevillas.com (200) | none |
| ruleta | production | n/a (mobile app) | none |
| moneyguard | mvp | n/a — beta group | `~/MoneyGuard` |
| luxedrive | prototype | never deployed | `~/car-next` (dashboard crash — see backlog 1) |

Home features `slice(0, 6)`, so LuxeDrive falls off the home grid. `/work` shows all seven.
Every project now has a card image, and `npm test` is fully green (8/8).

**Do not use these repos for portfolio content** — `~/asset-insights-agent`, `~/coyote-ui`,
`~/coyote-cms-api`, `~/coyote-managed-api`, `~/ui-component-library` are InvestorFlow /
Coyote Software work. Employer IP, not Pedro's to publish.

## Fixed contact facts (don't re-ask)

Email `hello@pedrojimenez.dev` · GitHub `clusterpj` ·
LinkedIn `/in/pedro-jimenez-97343653` · Facebook page id `61591124986626`.
