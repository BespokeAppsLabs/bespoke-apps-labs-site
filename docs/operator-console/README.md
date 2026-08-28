# Operator Console — design deliverables

Everything for the v3 site redesign. Start with the build spec.

| File | What it is |
|---|---|
| [`BUILD-SPEC.md`](BUILD-SPEC.md) | The implementation spec. Tokens, type, geometry, motion constants, component contracts, acceptance criteria. |
| [`../adr/0001-single-page-console.md`](../adr/0001-single-page-console.md) | Why it is a single page with dialog navigation, what that costs, what was rejected. |
| `console-canvas.html` | **The visual spec, self-contained.** Open it in any browser — no server, no build, no network. Pan/zoom canvas with four artboards. |
| `artboards/*.dc.html` | Source for each artboard. Edit these, then re-seed (below). |
| `artboards/canvas.json` | Artboard positions, sticky notes, launch view. |

## The canvas

**Hosted (canonical, always current):**
https://claude.ai/code/artifact/f3139176-cb29-4b9e-a342-2a892d7b10fb

That URL is stable — re-publishing updates it in place rather than minting a new one. It is private
to the Bespoke account until shared from the page's own share menu.

**Local:** `console-canvas.html`. Double-click it. Identical content, works offline and after any
account change, but it is a snapshot — it does not track later edits to the hosted version.

Four artboards:

1. **Console — desktop** (1440×900, interactive) — hover a panel or node to light its circuit; click anything to open its dialog.
2. **Entry sequence** — the first 2.2 seconds of a cold load.
3. **Console — mobile** (390×844, interactive).
4. **System sheet** — palette, type ramp, anatomy, motion carry-over, build order, open decisions.

## Regenerating the local copy

`console-canvas.html` is 2.5MB because the canvas editor is embedded in it. It is generated from
`artboards/`, so it can be rebuilt at any time and does not have to live in git if that becomes
annoying — the `.dc.html` files are the real source and total under 100KB.

Ask Claude Code to re-seed the canvas from `docs/operator-console/artboards/`, or run the
`/design` skill's `seed-canvas.mjs` against those files.

## Status

Design complete. Not implemented. `app/page.tsx` still renders `components/v2/landing-page.tsx`.

Five decisions in §11 of the build spec need a call before the build starts — the gold-vs-logo
question and the SEO approach are the two that matter.
