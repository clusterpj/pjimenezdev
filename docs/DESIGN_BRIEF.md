# Design Brief — pedrojimenez.dev
 
## The Person
Pedro Jimenez — full-stack developer, solo, Santiago Dominican Republic.
Builds AI systems, automations, web/mobile apps, motion graphics, 3D.
Personal site, not an agency. The brand IS Pedro.
 
## The Job This Site Does
Convert global visitors (startups, founders, companies) into clients.
Communicate: Pedro is elite, versatile, and ships real things.
But more than that — the site itself must be proof of what Pedro can build.
A visitor should leave thinking "I've never seen a portfolio do that."
 
---
 
## The Core Idea
This is not a portfolio with AI features bolted on.
This is an AI-integrated entity that happens to present a portfolio.
 
The site behaves like it's aware of the visitor.
It reacts. It thinks. It responds. It surfaces the right thing at the right time.
Every design decision — color, motion, layout, type — must support that feeling.
 
If a section could exist on any other developer's site, it's not done yet.
 
---
 
## Visual Direction
 
### Tone
Dark. Premium. Techy.
The intersection of a high-end developer tool and a sci-fi operating system.
NOT: generic dark portfolio with acid green. NOT: startup SaaS template. NOT: Dribbble shot.
It should feel like something Pedro himself would build and be proud of.
References in spirit (not to copy): Linear.app, Vercel, Basement Studio, Resend.
 
### Palette Direction
- **Background:** Near-black with depth — deep blue-black (e.g. #08080F) not flat #000 or #111
- **Primary accent:** One strong unexpected color — not green, not cyan, not purple — earn it. Consider a desaturated electric amber, a cold violet, or a burnt indigo.
- **Glow:** Same accent at low opacity — used for ambient halos, AI activity pulses, card borders
- **Surface:** Elevated cards — slightly lighter than bg, micro border at ~8% opacity white
- **Text body:** Off-white ~#C8C8D0
- **Text display:** Pure white #FFFFFF
- **Danger / alert:** Reserved for AI processing states only
### Typography Direction
- **Display:** Geometric or humanist with real personality. Options to explore: Syne, Cabinet Grotesk, Clash Display, Neue Machina. Must feel like a considered choice, not a Google Fonts default.
- **Body:** Clean, legible at 14-16px. Options: Inter (only if paired with a strong display face), Plus Jakarta Sans, DM Sans.
- **Mono:** JetBrains Mono or Geist Mono — for code snippets, technical labels, AI output text
- **Scale:** Tight leading for display (1.0–1.1), comfortable for body (1.6–1.7)
- **Language support:** Full Latin Extended for EN + ES accented characters (á é í ó ú ñ ü)
### Layout Principles
- Generous whitespace — even in dark themes, space is premium
- Sections each have their own identity while sharing the system
- Full-bleed moments punctuated by contained content blocks
- Grid: 12-col desktop, 4-col mobile, consistent gutter
- Max content width: ~1280px, hero can go edge-to-edge
---
 
## AI as Design Material
The AI is the atmosphere — not a feature, not a widget.
Every visual state must account for intelligence being present.
 
### States every interactive component needs:
- **Default** — resting state
- **Listening** — user is interacting, AI is receiving input
- **Processing** — AI is computing (elegant, not a spinner)
- **Responding** — AI output arriving (typewriter or stream-style)
### Specific AI UI surfaces:
1. **Concierge** — Not a chat bubble. More like a command palette or a portal that opens in the layout. The site's own voice, not a third-party widget.
2. **Estimator** — Full-screen or drawer overlay. Conversational input, structured AI output. Feels like a tool Pedro built, not a form.
3. **Ambient glows** — Particles or edge glows that pulse subtly during AI activity. Tied to real events, not looping decorations.
4. **Processing indicator** — A unique, branded loading state. Could be a scan line, a breathing border, a token stream. Not a spinner.
The visual language must make the site look like a system that is aware.
 
### Motion Principles
- Entrance animations: orchestrated, not simultaneous, not bouncy
- Scroll-triggered reveals: yes — disciplined, directional
- Hover states: meaningful, 150–200ms, feel physical
- AI states: breathing/pulsing at ~2–4s cycles, never frantic
- Page transitions: feel computed — like the interface is rendering for this visitor
- No gratuitous loops. Motion serves meaning.
---
 
## Section-by-Section Design Intent
 
### Hero
The strongest first impression. Must communicate in under 3 seconds:
- Who Pedro is
- That this site is unlike anything they've seen
- That something intelligent is present
Not a headline + subheadline + CTA button. That's the template.
The hero IS the thesis — visually and in copy.
The reactive background (WebGL / Canvas) lives here. Responds to cursor, scroll, time of day.
 
### Services
6 services: AI, Automations, Web Apps, Mobile Apps, Motion & 3D, Design.
Must communicate breadth without feeling scattered.
Each service has a micro visual identity within the system.
Not a grid of icons and bullet points — that's a brochure.
 
### Portfolio / Case Studies
Cards with real visual weight. Show the work, not just describe it.
Each card communicates: what it is, what stack, what result.
The AI surfaces relevant case studies based on what the visitor is reading.
 
### Testimonials
Social proof but not boring. Integrate into the flow, not a carousel.
 
### Blog
Clean reading experience. AI-surfaced related posts. Code blocks styled with the mono system.
 
### Contact / Book a Call
Direct. One action. Pedro's time is valuable — the design should communicate that.
Option: the AI Concierge handles initial qualification before routing to a calendar.
 
---
 
## What Claude Design Builds First
 
1. **Color system** — 6-8 named tokens, light/dark surfaces, glow variants
2. **Typography system** — display + body + mono pairing, full scale
3. **Hero section** — full composition, reactive background concept
4. **Services section** — layout and card system
5. **Component seeds** — button states, card variants, nav, badges, AI states
---
 
## Constraints
- Mobile-first responsive (375px baseline)
- WCAG AA minimum accessibility
- No heavy assets in critical render path — WebGL loads after TTI
- Bilingual EN/ES from day one — all components designed with longer ES strings in mind
- Cloudflare Pages deployment — no Node.js-only dependencies in critical path