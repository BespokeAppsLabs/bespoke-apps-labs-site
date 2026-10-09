# ADR 0002 — Woven Studio: scrolling homepage guided by a live 3D NOVA

**Status:** Accepted
**Date:** 2026-10-09
**Supersedes:** [ADR 0001](0001-single-page-console.md) — the single-viewport operator console
**Design canvas:** claude.ai/artifact/HL3nQdfGSWHhu6NjagcbN7 (private to the Bespoke account)

## Context

The console hid every section behind dialogs. The Boss asked for a more professional, unique site
built on motion graphics, with NOVA — the studio's own social-media agent — introduced on the page as
a guide. Green and gold stay.

## Decision

- **One scrolling page, fully server-rendered.** Every word is in the HTML; motion only reveals it.
  Sections are anchors: `#top #manifesto #layers #agents #os #method #work #founder #contact`.
- **Motion:** GSAP ScrollTrigger + Lenis. Pinned horizontal Services pan, pinned Agents pipeline,
  scrubbed manifesto, 3D OS reveal, method thread, parallax. `prefers-reduced-motion` gets none of it.
- **NOVA in real 3D.** `components/nova/pearl.ts` ports the v2 Pearl from
  `social_agent/skills/animate/elements/v2` to one transparent three.js canvas that flies from the
  hero to a dock as the page scrolls. Static fallback when WebGL is unavailable.
- **Narrated tour.** Scripted lines in `content/woven.ts`, voiced by `scripts/nova-tour-audio.sh`
  (Voicebox `Nova-Video`) to `public/nova/tour/*.mp3`. The tour scrolls for the visitor, pauses and
  continues from a red button, and is opt-out via an audio toggle.
- **Earlier versions removed.** `/v1` and `/v2` 308 to `/`; their components and the console are deleted.
- **Type:** Unbounded (self-hosted, OFL) for display, Geist Sans/Mono for text — no Google Fonts at build.

## Consequences

- Live, model-backed answers from NOVA (Agents SDK + OpenRouter) are deliberately deferred until after
  launch; until then she can only say approved copy.
- Changing a tour line requires regenerating its clip (`scripts/nova-tour-audio.sh <id>`), which needs
  local Voicebox.
- The page carries three.js, GSAP and Lenis; the WebGL loop and the loom canvas pause off-screen.
