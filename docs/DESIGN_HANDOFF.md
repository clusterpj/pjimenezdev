# Design Handoff — pedrojimenez.dev

Brief for Claude Design. Produce Figma designs for the surfaces listed below. Tokens, fonts, and existing primitives are locked — do not redesign them. Use them as your building blocks.

---

## Locked System (do not change)

### Color tokens
```
--bg-base: #08080F          (page background)
--bg-surface: #101019       (cards, panels)
--bg-surface-hover: #16161F (card hover)
--accent: #FFB23E           (brand amber — CTAs, active states, highlights ONLY)
--accent-glow: rgba(255,178,62,.15)
--accent-subtle: rgba(255,178,62,.08)
--text-display: #FFFFFF
--text-body: #C8C8D0
--text-muted: #7A7A88
--border: rgba(255,255,255,.08)
--border-accent: rgba(255,178,62,.30)
--ai-listening: #6E8BFF     (AI states ONLY — never use as brand color)
--ai-processing: #9B6BFF
--ai-responding: #C8A8FF
```

**Color rule:** Amber = Pedro's brand. Cool violet = AI state only. These two signal systems must never cross.

### Typography
| Role | Font | Weights |
|------|------|---------|
| Display | Space Grotesk | 600, 700 |
| Body | Inter | 400, 500, 600 |
| Mono | JetBrains Mono | 400, 500 |

Type scale: 11px (badges/eyebrows) → 13px (captions) → 15px (body) → 18px (lead) → 24px (section heads) → 36px (H2) → 56px (H1) → 80px+ (hero display). Display leading: 1.0–1.15. Body leading: 1.65.

### Grid
- Desktop: 12-col, max-width 1280px, 48px horizontal padding
- Mobile: 4-col, 375px baseline, 20px horizontal padding

### Existing built components (reuse in your designs)
- **Button** — variants: primary (amber fill), secondary (amber border), ghost (transparent), danger. Sizes: sm, md, lg.
- **Card** — bg-surface, 1px border (`--border`), radius 16px, 24px padding. Variants: default, `accent` (border-accent + amber glow on hover), `ai` (violet glow).
- **Badge** — pill shape, 11px mono uppercase. Variants: accent, ai, success, danger, neutral.
- **Tag** — 13px body. States: active (amber text + accent-subtle bg + accent border), inactive (muted text + surface bg).
- **AIStateIndicator** — colored dot (10/14/20px) with breathing animation. States: idle (gray), listening (blue), processing (purple), responding (light purple).

### Motion principles
- Entrance: orchestrated fade+slide-up, not simultaneous
- Hover: 150ms, feel physical
- AI states: breathing/pulsing 2–4s cycles, never frantic
- Processing: never a spinner — use scan line, breathing border, or dot stream

---

## Batch 1 — Design these first

These unblock the home page and the Concierge overlay.

---

### Surface 1A — Services section

**6 service cards in a 3×2 grid** (desktop). 2 columns on tablet, 1 column on mobile.

Each card uses the existing `Card` component base (bg-surface, radius-lg, 24px padding) and adds:
- A **micro visual identity** — a small abstract glyph or SVG shape unique to each service. Not stock icons. Think: simple geometric forms, line-art symbols, something that feels crafted. Contained in a ~40px square area, amber or muted-white, on a slightly elevated circle/square bg.
- **Service name** — Space Grotesk 600, ~22px
- **One-line description** — Inter 400, 15px, `--text-body`
- **Hover state** — border shifts to `--border-accent`, subtle amber glow (`--accent-glow`) in box-shadow
- **Ghost CTA** — "Tell me more →" appears on hover (ghost Button sm), triggers Concierge pre-filled with service name

The 6 services:
1. AI & Integrations — LLM apps, agents, RAG pipelines, API integrations
2. Automation — End-to-end workflow automation, ops pipelines
3. Web Apps — Full-stack applications, SaaS products, dashboards
4. Mobile Apps — iOS & Android, React Native
5. Motion & 3D — Motion graphics, 3D visuals, creative tech
6. Design & Prototyping — UI/UX, design systems, interactive prototypes

Section anatomy:
- Section eyebrow: `// services` — JetBrains Mono 400, 11px, `--text-muted`, letter-spaced
- Section heading: Space Grotesk 700, ~36px, `--text-display`
- Cards grid below

---

### Surface 1B — Enhanced Work/Portfolio cards

The existing cards (in the Portfolio Preview section on the home page) need three additions:
- **Thumbnail area** — 16:9 aspect ratio at top of card. For now: a placeholder with a category-specific glyph or gradient, not a blank gray box. Each project should feel visually distinct.
- **Result line** — one line directly below thumbnail. JetBrains Mono 400, 12px, `--accent` color. Format: "↑ 3× faster deployment cycle" or "Shipped in 6 weeks"
- **Stack badges** — at the bottom of the card using `Badge` neutral variant. e.g., "Next.js", "Python", "Cloudflare"

The rest of the card (project name, description, tags) stays the same.

---

### Surface 1C — Testimonials section

**3–5 testimonial blocks** in a static layout integrated into scroll flow. No carousel. No stars.

Options for layout (pick the strongest):
- A: 3-column grid, each block a `Card` (default variant)
- B: Large alternating quote blocks, full content width, with a subtle left-border accent line

Each block:
- Quote text — Inter 400 italic, ~18px, `--text-body`, generous leading
- Name — Space Grotesk 600, 15px, `--text-display`
- Role + company — Inter 400, 13px, `--text-muted`
- Optional project reference using existing `Tag` (neutral, inactive state)

No avatar photos unless Pedro provides real ones.

Section eyebrow + heading same pattern as Services.

---

### Surface 1D — Blog Preview section

**3 article cards** in a horizontal row (desktop), stacked on mobile.

Each card:
- Title — Space Grotesk 600, ~18px
- Category — `Badge` neutral variant
- Reading time — JetBrains Mono 400, 11px, `--text-muted`
- Excerpt — Inter 400, 14px, `--text-body`, 2-line clamp
- Date — JetBrains Mono 400, 11px, `--text-muted`
- Hover state: border → `--border-accent`, lift -2px

Section ends with a "Read more →" ghost Button CTA pointing to `/blog`.

---

### Surface 1E — Footer

**3-column layout**, full-width, background `--bg-base`, 1px top hairline border (`--border`).

Columns:
1. Left — Logo (`pedro.j` wordmark matching Nav, same amber dot) + one-line tagline in `--text-muted`
2. Center — Navigation links (Work, Services, Blog, Contact) + language toggle (EN / ES)
3. Right — Social icons: GitHub, LinkedIn, X. Inline SVG, `--text-muted`, hover → `--text-display`. No external icon library.

Bottom bar (below columns): `© Pedro Jimenez — pedrojimenez.dev` centered or left-aligned, JetBrains Mono 400 11px `--text-muted`.

---

### Surface 2 — Nav updates

Two additions to the existing fixed navigation bar:

**Language toggle:** `EN | ES` pill. Current language in `--accent`, other in `--text-muted`. Pill shape (border-radius full), border `--border`, fits between the nav links and the CTA button. ~13px mono.

**Concierge trigger:** Sits left of "Start a project" CTA. Options:
- A: `// ask` label in JetBrains Mono 11–12px with a small AI state dot beside it
- B: A minimal icon button (terminal/prompt icon or simple circle)

When the Concierge overlay is open or AI is active, the `AIStateIndicator` dot on this trigger animates (breathing, in the current AI state color).

Design both options, recommend one.

---

### Surface 3 — Concierge command palette overlay

The main AI surface. Not a chat bubble. Feels like the site itself speaking — a command palette or portal that materializes over the page.

**5 frames to design:**

**Frame 1 — Closed**
Just the Nav trigger button (Surface 2). Nothing else visible.

**Frame 2 — Opening / Idle**
- Backdrop: `rgba(8,8,15,.80)` with 8px blur covering entire page
- Panel: centered, `max-width: 640px`, `width: 90vw`. bg-surface, radius-xl (20–24px), subtle border (`--border`).
- Content: `pedro.ai` label in JetBrains Mono 12px `--text-muted` at top of panel. Empty input field below. Placeholder: "Ask me anything — services, pricing, availability…". Keyboard shortcut hint: `⌘K` or `Ctrl+K` shown subtly at bottom-right of panel in mono muted.
- Entry animation direction: scale from 0.96 + fade in (no slide)

**Frame 3 — Listening**
User is typing. No AI response yet.
- Border shifts to `rgba(110,139,255,.45)` (listening blue tint)
- `AIStateIndicator` dot in `--ai-listening` color visible in or near the input
- Subtle listening glow in box-shadow

**Frame 4 — Processing**
User sent a message. AI is computing.
- 3 dot-bounce loading indicator (using existing `dot-bounce` CSS animation pattern — dots bounce vertically, staggered, in `--ai-responding` color)
- Border shifts to `rgba(155,107,255,.45)` (processing purple tint)
- Box-shadow: ai-processing glow

**Frame 5 — Responding**
AI is streaming a response. Message thread is visible.
- Panel grows to show thread. Max height: ~70vh, then thread scrolls internally.
- User messages: right-aligned bubble, `--accent-subtle` bg, rounded (16px 16px 4px 16px)
- AI messages: left-aligned, `--bg-surface` (slightly elevated), rounded (16px 16px 16px 4px), JetBrains Mono font
- Author labels above each bubble: "You" and "pedro.ai" in 11px mono muted
- Thread above input, input stays pinned at bottom of panel

Input area (all active states): `AIStateIndicator` dot positioned left inside the input, send button right side (amber when active, muted when idle).

---

## Batch 2 — Design after Batch 1 is approved

These unblock the inner pages (/work, /blog, /contact) and the Estimator.

---

### Surface 4 — Estimator drawer

Activated from the Services section and Contact page. Right-side drawer on desktop (480px wide), bottom sheet on mobile.

**3 states:**

**Input state:**
- Drawer header: "Project Estimator" (Space Grotesk 600, ~20px) + close button (×)
- Large textarea: "Describe your project in plain language…" (Inter 400, 15px)
- Category select dropdown (using existing `Select` component styling)
- Primary Button "Get estimate" at bottom

**Processing state:**
- Breathing border glow in `--ai-processing` color (the existing `ai-breathe` CSS keyframe)
- Drawer content fades to 50% opacity
- "Estimating…" label in mono muted

**Output state:**
- Result card inside drawer: category `Badge`, scope as a bulleted list (Inter 400 14px), timeline + budget as two stat blocks side-by-side (Space Grotesk 700, ~28px values, mono label above each), notes in 13px muted italic
- Two buttons below: "Send to Pedro" (primary — pre-fills Concierge with the estimate) and "Start over" (ghost)

---

### Surface 5 — /work page

**Filter bar:** Horizontal scrolling pill tabs: All | AI | Web | Mobile | Automation | Motion | 3D. Active tab: amber fill + dark text (like primary Button but smaller/pill). Inactive: ghost/muted. Uses same visual language as `Tag` active state.

**Grid:** 3 columns desktop, 2 tablet, 1 mobile. Each card is the enhanced Work card from Surface 1B.

**Empty state:** If no projects match a filter — mono muted label "No projects in that category yet." centered in the grid area.

---

### Surface 6 — /work/[slug] case study

Full-page layout. Structured sections:

1. **Header** — full-width hero area (image or rich color field with project glyph). Project name `--t-2xl`, category `Badge`, year in mono.
2. **The Problem** — prose section, Inter 400 16px, 1.7 leading, max-width 720px centered.
3. **The Approach** — same prose treatment
4. **The Build** — same, may include code blocks (JetBrains Mono, `--bg-surface` bg, 1px border)
5. **The Result** — callout treatment — slightly elevated card or wide accent-bordered block for the key outcome stat/quote
6. **Stack** — horizontal `Tag` list (neutral inactive) for technologies used
7. **Next project** — single Card linking to next case study. Shows project name + category.

---

### Surface 7A — /blog index

Same card layout as Blog Preview section (Surface 1D) but full grid. Filter bar same as /work (categories: AI, Dev, Design, Behind the Build, Misc).

---

### Surface 7B — /blog/[slug] article

- **Reading progress bar** — thin (2–3px) amber line at very top of viewport, fixed, fills left-to-right as user scrolls.
- **Article header** — title (Space Grotesk 700, `--t-xl`), date + reading time in mono muted, category `Badge`
- **Prose** — Inter 400 16px, 1.8 leading, max-width 720px centered. Code blocks: JetBrains Mono, `--bg-surface` background, 1px `--border`, radius-md.
- **Related articles** — 2-col cards at bottom using Blog card from Surface 1D
- **Bottom CTA** — ai-variant `Card` with copy like "Have questions? Ask pedro.ai →" — clicking opens Concierge overlay

---

## Deliverable format

For each surface: annotated Figma frames with component states labeled, spacing noted, and any motion behavior described in a note. Hand back to Claude Code when Batch 1 is complete.
