# ADR 0001 — Single-page operator console with dialog navigation

**Status:** Superseded by [ADR 0002](0002-woven-studio.md) (2026-10-09)
**Date:** 2026-08-27
**Supersedes:** the scrolling editorial layout in `components/v2/landing-page.tsx`
**Spec:** [`docs/operator-console/BUILD-SPEC.md`](../operator-console/BUILD-SPEC.md)

---

## Context

The public site had gone through three identities in six months — a floating-card WebGL deck
(`/v1`), an editorial systems-studio scroll (`/v2`, currently live at `/`), and assorted
half-migrations. All three shared one problem: the site *described* a systems studio in prose
instead of *behaving* like one.

The brief was to make a visitor feel they had arrived in their own operational HQ, using an
Agentic-OS reference screen, while keeping the existing three.js motion work.

## Decision

**One viewport-height console. Nothing scrolls. Every section opens as a dialog over it.**

Three structural commitments follow from that:

1. **The panels are the navigation.** Six panels, one per capability, three a side. Not "sections
   about us" — the six things the studio sells, each with its deliverables listed in place.

2. **The core is wired to the panels.** A particle core sits centre; six nodes ring it, each owning
   exactly one panel; spokes run core→node and wires run node→panel. Hovering any link in that
   chain lights the whole run. The wiring is not decoration — it is the explanation of how the
   studio's parts relate, delivered by moving a mouse rather than by a paragraph.

3. **Layout follows the wiring, not the other way round.** When the geometry demanded it, content
   moved: Method, Disciplines and The Studio became chips under the lockup; Operating Rhythm became
   a rail beneath the core; Engagement became the topbar address plus the primary button. Nodes sit
   in two arcs of three rather than a full ring, because a full ring puts nodes at top and bottom
   with no panel to connect to.

## Consequences

### Accepted costs

- **SEO requires deliberate work.** Dialog-only content is invisible to crawlers. All ten dialog
  bodies must be server-rendered and merely *revealed* by the dialog, and each dialog needs shallow
  routing (`/?panel=agents`) to be linkable at all. Without both, the studio has exactly one URL.
  This is the single highest-risk item in the build.
- **No room for growth by addition.** A fixed viewport cannot absorb a seventh capability without a
  redesign. That constraint is intentional — it forces the site to stay a statement rather than
  drifting into a brochure — but it is real, and a seventh service means revisiting the geometry.
- **Geometry must be computed, not hardcoded.** Wires connect two independently-laid-out elements,
  so endpoints have to be measured at runtime and recomputed on resize and after webfont load. This
  is more work than a static layout and is the most likely source of build defects.

### Gains

- Nothing is thrown away: every motion piece (`ParticleField`, `DataRings`, `FloatingDebris`,
  `CinematicCamera`, the lerp rig, the modal transition) carries over from `/v1` and `/v2`, and no
  new dependency is introduced.
- One state variable (`open` / `hot`) drives the entire interface.
- The dialog is a refactor of the existing `product-detail-modal.tsx` onto `@radix-ui/react-dialog`,
  which is already installed — so focus trap, Esc and scroll lock come for free and the modal's
  accessibility debt is retired in the same change.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep the `/v2` editorial scroll, restyle it | Solves nothing. The complaint was that the site reads as a document, and scrolling is what makes it one. |
| Multi-page site with real routes per capability | Better for SEO, worse for the brief. Six near-identical pages of a studio's own marketing is exactly the "digital theatre" the copy disclaims. |
| Keep the `/v1` floating-card deck | Already rejected once, for cause: the fixed card layer overlapped later sections and rendered partly offscreen on mobile (see wiki, 2026-06-02 audit). |
| Obsidian-style force graph as the core | Built and rejected in review. A live graph of the studio's own content is legible but reads as a tool's debug view, not as a system you are inside. The particle core with explicit wiring says the same thing with more authority. |

## Notes

- **Brand:** the logo file yields `#008F64` green and `#161A22` charcoal, and contains **no gold**.
  The gold accent predates the logo and was chosen before the file existed. It is retained by
  explicit decision, and is one token away from being dropped.
- **Typography:** the logotype face was identified by measuring glyph and punctuation proportions
  off the artwork against eight candidates — Plus Jakarta Sans 600, within 2.7%. It carries the
  whole interface. The editorial serif used in earlier drafts was removed: against a geometric
  logotype it made the console read as two brands stacked on each other.
- **Honesty constraint:** the page carries no metrics, client logos or testimonials, because none
  were verifiable. This is a deliberate continuation of the `README.md` principle, not an omission
  to be filled with plausible numbers later.
