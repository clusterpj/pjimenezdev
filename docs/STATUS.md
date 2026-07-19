# Project status & backlog

Last updated: 2026-07-19. This is the pick-up-where-we-left-off doc.
Architecture and conventions live in `CLAUDE.md`; this file tracks state and pending work.

## Shipped (live at https://pedrojimenez.dev)

**Production design rebuild** (commit `f8d7f46`) — the "Website production design system"
handoff implemented 1:1:

- Routes: `/` (hero = live concierge), `/work` (filters), `/work/[slug]` (8 case studies),
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

0. **Web Analytics beacon** — Pedro: Cloudflare dashboard → Analytics & Logs →
   Web Analytics → Add site (pedrojimenez.dev, disable automatic setup) → copy the beacon
   token. Then add to `src/app/[lang]/layout.tsx` before `</body>`:
   `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "TOKEN"}' />`.
   Wrangler's OAuth token has no RUM scope, so this can't be done from the CLI.
1. **Project thumbnails** — the biggest remaining visual gap. For each of the 8 projects:
   16:10 WebP at `public/images/projects/<project-id>/thumb.webp` (1600×1000, ≤150KB), plus
   optional `hero.webp` (2400×1200) for top projects. Preferred: real screenshot framed on a
   dark backdrop; pure-AI conceptual scenes only where no screenshot exists. Then wire:
   thumbnail band on work cards (home + /work) and hero band on `/work/[slug]`.
   Conceptual-scene prompt cores (combine with the style recipe below):
   | Project | Concept |
   |---|---|
   | melow | real screenshot preferred (odontogram chart or WhatsApp intake flow) — has an actual UI |
   | c21-perdomo | Caribbean modern house at dusk, amber windows, translucent listing-card UI overlay |
   | moneyguard | hand holding phone with a red "hold on" intervention alert, pesos blurred behind |
   | cabarete-villas | beachfront villa at golden hour, floating calendar/availability overlay |
   | ruleta | neon prize wheel mid-spin at a dark event booth, motion blur, confetti |
   | luxedrive | luxury SUV in dark showroom, fleet-dashboard hologram above the hood |
   | social-command | one Telegram message exploding into four platform icons, light trails |
   | seo-blog | terminal window growing into a tree of document pages, green/amber glow |
   Image style recipe (keep every asset in this look):
   > editorial, very dark navy-black background (#08080F), single warm amber rim light,
   > subtle cool violet fill like monitor glow, cinematic, no text
2. **Real metrics in case studies** — problem/build/outcome copy in `src/lib/content.ts` was
   drafted from one-liners with NO invented numbers; replace with real figures where they exist.
   Melow (`f8d7f46`→`a9ed180`) is done as the template: real product details, renamed from
   BotForge, with a redirect from the old `/work/botforge` URL in `next.config.ts`.
3. **Spanish native pass** — ES copy in `content.ts` is Claude's translation in Pedro's voice;
   read through and adjust.
4. **OG check** — preview links at opengraph.xyz after any metadata change; consider per-project
   OG images once project thumbs exist (currently all reuse `og/home.png`).
5. **Nice-to-haves from the handoff** not yet done: per-project OG meta images, WebGL/motion
   hero extras (deliberately skipped — concierge is the hero), Vitest when logic warrants it.

## Fixed contact facts (don't re-ask)

Email `hello@pedrojimenez.dev` · GitHub `clusterpj` ·
LinkedIn `/in/pedro-jimenez-97343653` · Facebook page id `61591124986626`.
