# Brand — pedrojimenez.dev
> Living document. Updated as decisions are finalized in Claude Design.
> Tokens defined here become the source of truth for all code.
> **Phase 0 (color + type) — LOCKED.**
 
---
 
## Logo
- **Status:** [ ] Not started
- **Direction to explore:** Monogram "PJ" or wordmark "Pedro Jimenez" — must work at 32px favicon and full nav size
- **Feeling:** Mark should feel technical, precise — not playful, not aggressive
- **Constraint:** Must work on near-black background as primary context
- **Files:** none yet
---
 
## Color System
> Phase 0 — LOCKED. These hexes are the source of truth for all code.
 
### Core Tokens
| Token              | Hex                        | Usage                                        |
|--------------------|----------------------------|----------------------------------------------|
| --bg-base          | #08080F                    | Page background (deep blue-black)            |
| --bg-surface       | #101019                    | Cards, elevated panels                       |
| --bg-surface-hover | #16161F                    | Card hover state                             |
| --accent           | #FFB23E                    | Primary CTA, active states, highlights       |
| --accent-glow      | rgba(255,178,62,.15)       | Accent at 15% — ambient halos                |
| --accent-subtle    | rgba(255,178,62,.08)       | Accent at 8% — borders, fills                |
| --text-display     | #FFFFFF                    | Headlines, hero text                         |
| --text-body        | #C8C8D0                    | Body copy                                    |
| --text-muted       | #7A7A88                    | Labels, captions, secondary info             |
| --border           | rgba(255,255,255,.08)      | Hairlines (8% white opacity)                 |
| --border-accent    | rgba(255,178,62,.30)       | Accent-tinted borders for active cards       |
 
**System logic:** Amber is the *brand* (Pedro). It carries CTAs, active states, highlights.
Differentiates from the cool-leaning dev-portfolio default. Passes WCAG AA on `--bg-base`.
 
### AI State Colors
> The cool-violet family is reserved for AI presence ONLY — never used as a brand accent.
> This warm(brand) / cool(machine) split is what makes AI activity read as its own signal.
 
| Token              | Hex      | Usage                                        |
|--------------------|----------|----------------------------------------------|
| --ai-listening     | #6E8BFF  | Pulse color when AI is receiving input       |
| --ai-processing    | #9B6BFF  | Glow color during AI computation             |
| --ai-responding    | #C8A8FF  | Stream color as AI outputs text              |
 
---
 
## Typography
> Phase 0 — LOCKED.
 
### Typefaces
| Role     | Font Family        | Weight(s)   | Notes                                                        |
|----------|--------------------|-------------|--------------------------------------------------------------|
| Display  | Space Grotesk      | 600, 700    | Hero, H1–H2. Full Latin-Extended (EN+ES verified).          |
| Body     | Inter              | 400, 500, 600 | 14–16px, high legibility                                   |
| Mono     | JetBrains Mono     | 400, 500    | Code, AI output, technical labels                            |
 
> **Optional upgrade:** Clash Display (Fontshare) is the higher-personality display alternative.
> A/B against Space Grotesk post-launch. Before locking, confirm its glyph coverage for
> ES accents (á é í ó ú ñ ü) — verify when wiring fonts.
 
### Type Scale
| Step    | Size  | Weight | Leading | Usage              |
|---------|-------|--------|---------|--------------------|
| --t-xs  | 11px  | 500    | 1.4     | Badges, eyebrows   |
| --t-sm  | 13px  | 400    | 1.5     | Captions, labels   |
| --t-base| 15px  | 400    | 1.65    | Body copy          |
| --t-md  | 18px  | 500    | 1.5     | Lead paragraphs    |
| --t-lg  | 24px  | 600    | 1.3     | Section headlines  |
| --t-xl  | 36px  | 700    | 1.15    | H2, major headings |
| --t-2xl | 56px  | 700    | 1.05    | H1, hero subtitle  |
| --t-3xl | 80px+ | 700    | 1.0     | Hero display text  |
 
---
 
## Motion Tokens
> Eases locked Phase 0; durations as previously specified. Re-confirm during component build.
 
| Token               | Value                            | Usage                              |
|---------------------|----------------------------------|------------------------------------|
| --ease-default      | cubic-bezier(0.4, 0, 0.2, 1)     | Standard UI transitions            |
| --ease-spring       | cubic-bezier(0.34, 1.56, 0.64, 1)| Interactive, physical feel         |
| --ease-out-expo     | cubic-bezier(0.16, 1, 0.3, 1)    | Entrance animations                |
| --duration-instant  | 80ms                             | Immediate feedback (button press)  |
| --duration-fast     | 150ms                            | Micro-interactions, hovers         |
| --duration-default  | 300ms                            | Standard transitions               |
| --duration-slow     | 600ms                            | Section entrances, reveals         |
| --duration-ai       | 2400ms (2–4s range)              | AI breathing/pulse cycles          |
 
---
 
## AI Visual Identity
Design system rules for how AI presence is communicated visually.
 
### Processing State
- Never a spinner
- Options: scan line, breathing border, token dot stream
- Color: `--ai-processing` (#9B6BFF). Pulse on `--duration-ai`, eased in/out.
### Concierge Surface
- Not a chat bubble — feels like the site itself speaking
- Opens as a command palette / portal in the layout
- Background `--bg-surface`, border `--border-accent` on active, AI-violet glow on activity
### Ambient Intelligence
- Subtle particle field or edge glow on the hero — tied to actual AI activity
- Pulse rate: 2–4s cycle (`--duration-ai`), eases in/out, never frantic
- Opacity: low enough to not distract, present enough to feel alive
---
 
## CSS Token Block (drop into globals.css)
```css
:root {
  --bg-base:#08080F; --bg-surface:#101019; --bg-surface-hover:#16161F;
  --accent:#FFB23E;
  --accent-glow:rgba(255,178,62,.15); --accent-subtle:rgba(255,178,62,.08);
  --text-display:#FFFFFF; --text-body:#C8C8D0; --text-muted:#7A7A88;
  --border:rgba(255,255,255,.08); --border-accent:rgba(255,178,62,.30);
  --ai-listening:#6E8BFF; --ai-processing:#9B6BFF; --ai-responding:#C8A8FF;
  --ease-default:cubic-bezier(.4,0,.2,1);
  --ease-spring:cubic-bezier(.34,1.56,.64,1);
  --ease-out-expo:cubic-bezier(.16,1,.3,1);
  --duration-instant:80ms; --duration-fast:150ms;
  --duration-default:300ms; --duration-slow:600ms; --duration-ai:2400ms;
}
```
 
---
 
## Voice & Tone
- **Language:** EN primary, ES secondary
- **Personality:** Pedro himself — casual, direct, technical
- **Never:** "How can I help you today?", corporate jargon, buzzword stacking
- **Always:** Short sentences. Active voice. Specific > vague.
- **Copy rule:** If it could appear on any other dev's site, rewrite it.
---
 
## Brand Don'ts
- No acid green, no cyan, no generic purple accents (violet is AI-state only, never brand)
- No stock illustrations or generic icon packs
- No carousel testimonials
- No "ninja / rockstar / guru" language
- No agency positioning — this is Pedro, not a team