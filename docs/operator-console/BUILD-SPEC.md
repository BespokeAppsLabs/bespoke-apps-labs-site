# Operator Console — Build Spec

Implementation spec for the Bespoke Applications Labs site redesign (v3).

**Visual spec (hosted, canonical):** https://claude.ai/code/artifact/f3139176-cb29-4b9e-a342-2a892d7b10fb
**Visual spec (local, offline):** [`console-canvas.html`](console-canvas.html) — open in any browser
**Artboard sources:** [`artboards/`](artboards/) — re-seedable
**Decision record:** [`docs/adr/0001-single-page-console.md`](../adr/0001-single-page-console.md)
**Status:** design complete, not yet implemented
**Replaces:** `components/v2/landing-page.tsx` (currently rendered by `app/page.tsx`)

---

## 1. What this is

One viewport-height console. **Nothing scrolls.** Six capability panels, three a side, wrap a
particle core. Each panel owns exactly one node on the core's ring, and each node is wired back
into the core. Selecting anything opens a dialog *over* the console rather than navigating away,
so the visitor never leaves the screen they arrived on.

The wiring is the argument: `core → spoke → node → wire → panel`. Hovering anywhere on that chain
lights the whole run. A visitor learns the shape of the studio by moving a mouse.

### Content map

| # | Panel | Node angle | Layer |
|---|---|---|---|
| 01 | Applications | 210° | Product |
| 02 | Agent Systems | 180° | Intelligence |
| 03 | Media Engine | 150° | Creative |
| 04 | Town Square | 330° | Commerce |
| 05 | Networks | 0° | Infrastructure |
| 06 | Academy | 30° | Capability |

Everything else lives outside the panel grid:

- **The Studio / Method / Disciplines** — three chips under the lockup, each opening a dialog.
- **Operating Rhythm** — a four-phase rail beneath the core (`map → frame → build → hand over`).
- **Engagement** — the address in the topbar plus the primary button on the rail.

---

## 2. Files

| # | File | Change |
|---|---|---|
| 01 | `app/globals.css` | Replace the `.labs-*` block with the tokens in §3. Keep the `prefers-reduced-motion` block and extend it per §8. |
| 02 | `content/capabilities.ts` | **New.** All copy in one typed module (§6). Panels and dialogs read the same records so they cannot drift. |
| 03 | `components/hq/field.tsx` | **New.** The r3f canvas: core, spokes, ring arcs. Takes `paused` and `activeIndex`. |
| 04 | `components/hq/console.tsx` | **New.** Grid shell, topbar, live clock, and the single `open` / `hot` state. |
| 05 | `components/hq/panel.tsx` | **New.** One presentational capability panel. |
| 06 | `components/hq/wires.tsx` | **New.** The SVG overlay that draws node → panel curves (§5.3). |
| 07 | `components/hq/dialog.tsx` | **New.** Refactor of `components/product-detail-modal.tsx` onto `@radix-ui/react-dialog` (already a dependency) for focus trap, Esc and scroll lock. |
| 08 | `app/page.tsx` | Render `<Console />`. Server-render every dialog body (§9). |
| 09 | `components/contact-form.tsx` | Reuse as-is inside the engagement dialog; restyle only. `app/api/send/route.ts` is untouched. |
| 10 | `app/v1/`, `app/v2/`, `components/version-toggle.tsx` | Delete once signed off. They are untracked scaffolding, not history. |

No new dependencies. `three@0.182`, `@react-three/fiber@9.5`, `@radix-ui/react-dialog@1.1.4`
and `lucide-react` are all already in `package.json`.

---

## 3. Tokens

Paste-ready for `globals.css`. Values are the console's, not approximations.

```css
:root {
  /* ground */
  --ground:      #050b09;   /* page. near-black with a forest cast, never pure black */
  --panel-bg:    rgba(7,15,13,.8);
  --panel-line:  rgba(199,163,90,.15);
  --hair:        rgba(199,163,90,.08);   /* row separators */

  /* brand — sampled from the logo file, do not re-derive */
  --brand:       #008F64;   /* master value, full strength on light surfaces */
  --brand-dark:  #161A22;   /* wordmark colour on light surfaces */
  --brand-on-dk: #00B87E;   /* same hue lifted for the near-black ground */

  /* accent + state */
  --accent:      #c7a35a;   /* all chrome: rules, labels, corner ticks, primary action */
  --live:        #34d399;   /* STATE ONLY — clock dot, current phase, lit circuit */

  /* text */
  --paper:       #f3f0e7;
  --text:        #b8c5bc;
  --muted:       #6f7f76;
  --micro:       #6a7a72;

  --radius: 0;               /* everything is square. no exceptions */
}
```

**Rules that matter more than the values:**

- `--live` is a *state*, never decoration. If everything is emerald, nothing is live.
- `--accent` carries every piece of chrome. `--brand-on-dk` is reserved for the logotype.
- Radius is zero throughout. The one curve in the design is the core.

> **Open:** the logo contains no gold. Its only colours are `#008F64` and `#161A22`. Gold carried
> over from the previous site and was chosen as the accent before the logo file existed. A
> green-only console is a single token change (`--accent: #00B87E`). See §11.

---

## 4. Type

Two families. Anything a person reads as **language** is Jakarta; anything read as **data** is Mono.

```css
--font-sans: "Plus Jakarta Sans", "Helvetica Neue", sans-serif;  /* 300 400 500 600 700 */
--font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;   /* 400 500 700 */
```

| Role | Spec |
|---|---|
| Logotype `<Bespoke/>` | Jakarta 600, `letter-spacing: -.03em` |
| Logotype descender `applications labs` | Jakarta 300, `letter-spacing: .6em`, lowercase, never above 14px |
| Dialog titles | Jakarta 600, 33px / 1.08, `-.03em` |
| Panel names | Jakarta 600, 16.5px / 1, `-.025em` |
| Body | Jakarta 400, 12–14.5px / 1.65 |
| Data, clock, slugs | Mono 400–500, 10–12px |
| Micro-labels | Mono 400, 9px, `.2em`, uppercase |
| Node labels | Mono 500, 11px, `.1em`, uppercase |

**The logotype face was identified by measurement, not by eye.** Glyph widths, x-height and
bracket proportions were taken off the logo file and matched against eight candidates. Plus
Jakarta Sans 600 came within 2.7% on every metric; its native `<` is 0.668 of cap height against
the artwork's 0.660. Montserrat was 5.9% off and visibly wider. Poppins was never a candidate —
its `a` is single-storey, the logo's is double.

### Logotype markup

```html
<span class="logo"><b>&lt;</b>Bespoke<i>/</i><b>&gt;</b></span>
<span class="logo-sub">applications labs</span>
```

`b` (brackets) inherits size. `i` (slash) is `.94em`. Both are `--brand-on-dk`. The wordmark is
`--paper`. `.logo-sub` needs `margin-right: -.6em` so the trailing letter-space does not break
centring.

> If the original **vector** logo exists, ship that instead for the lockup. The supplied file is a
> white-background raster and cannot sit on a dark ground without keying. Live text is the correct
> fallback, not the ideal.

---

## 5. Geometry

The artboard is authored at a fixed **1440 × 900**. Those numbers are a *reference frame*, not the
implementation — §5.4 covers deriving them at arbitrary viewport sizes. Build the fixed case first,
then parameterise.

### 5.1 Console grid

```
topbar        46px, border-bottom 1px --panel-line
grid          height 854, padding 18px 22px 22px
columns       280px | minmax(0,1fr) | 290px      gap 18
panels        3 a side, flex 1 → 260.67px each, stack gap 16
centre column 790 wide  →  stage 790 × 566
```

Centre column stack: lockup **130** / stage **flex** / rhythm rail **118**.

### 5.2 Core and nodes

```
stage box       790 × 566, origin at its centre (395, 283)
console centre  (715, 477)
node radius     NR = 330
node angles     [210, 180, 150, 330, 0, 30]     ← two arcs of three, not a full ring
core radius     R  = 126 × coreScale            (coreScale default 2 → R = 252)
ring arcs       138°–222° and −42°–42°, dashed overlay [2,24], offset −(t×9) mod 26
spokes          from  min(R × 1.06, NR − 96)  to  NR − 40
node disc       66px   ·  node box 116px  ·  label 11px mono
```

Nodes sit in **two arcs facing their panel banks**, not a full ring. A complete circle at r330
would be cut off top and bottom by the 566px stage, and two arcs read better against two columns
anyway.

`coreScale` is deliberately a variable. The design ships at **2** (twice the original radius, four
times the area). Above ~2.2 the core overruns the frame and swallows the node ring — keep the
clamp.

### 5.3 Wires (node → panel)

Panel header ports, in console coordinates:

```
left  x = 302        right x = 1128
y     = 87 , 363.67 , 640.34        (= 64 + 23 + n × 276.67)
```

Each wire is a quadratic curve from the node to its port:

```
start   node centre, pushed 40px toward the port   (clears the 66px disc)
control (portX + side × 100,  (portY + nodeY) / 2)   side = +1 left, −1 right
end     the port
```

Wires live in an **SVG overlay at `z-index: 1`**, beneath the panels (`z-index: 2`). Panel
backgrounds are opaque enough (`rgba(7,15,13,.8)`) to hide the tails, so wires read as emerging
from under the panel.

### 5.4 Deriving geometry at runtime — read this before building

The artboard hardcodes pixel coordinates. **Do not port those constants literally.** In the real
build:

1. Measure the stage with a `ResizeObserver`. Derive `NR = min(stageW/2 − 60, stageH/2 − 55)` and
   `R = min(NR × 0.76, stageH/2 − 30)`.
2. Compute node positions from `angle` + `NR` and place them with CSS percentages of the stage, so
   they stay glued to the canvas the core is drawn on.
3. Draw wires from **measured** positions, not computed ones: `getBoundingClientRect()` on each
   node and each panel header port, converted into the overlay's coordinate space. This is the only
   approach that survives panel content of varying height, font loading, and zoom.
4. Recompute on resize and after `document.fonts.ready` — panel heights shift when Jakarta loads,
   which moves the ports.

Parallax moves the **whole plate** (canvas *and* node buttons together) via one transform on their
shared parent. Applying it inside the canvas only will visibly detach the spokes from the discs.

---

## 6. Content model

```ts
// content/capabilities.ts
export type Capability = {
  id: 'apps' | 'agents' | 'media' | 'square' | 'networks' | 'academy';
  n: '01' | '02' | '03' | '04' | '05' | '06';
  name: string;
  short: string;        // panel sub-line, ~90 chars
  meta: string;         // "Product layer"
  bars: [number, number, number];  // the per-capability signature glyph
  angle: number;        // node position, degrees
  dialog: {
    title: string;      // one sentence, sets the claim
    body: string;       // 2–3 sentences
    aLabel: string; items: string[];   // "What it covers"
    bLabel: string; bText: string;     // "Typical shape"
  };
};
```

The **signature glyph** is three bars of per-capability heights — a functional indicator, not the
logo. The logo is the bracket mark and is used only for the brand.

All copy is drawn from the current site (`components/v2/landing-page.tsx` and `README.md`).
**Nothing was invented.** There are deliberately no metrics, client logos or testimonials. Where a
hard fact would be needed it is absent rather than fabricated.

---

## 7. Motion

Every piece already exists in the repo. Nothing new to install.

| Existing | From | New role |
|---|---|---|
| `ParticleField` | `v2/atmosphere-scene.tsx` | The core: ~620 points — 360 shell, 240 cloud, 16 emerald pulses. Recolour to gold/emerald/paper. 900 desktop, 300 mobile. |
| `DataRings` | `v2/atmosphere-scene.tsx` | The two ring arcs. Keep the counter-rotation, move to gold hairlines. |
| `FloatingDebris` | `v2/monolith-scene.tsx` | Ambient drift outside the ring. Drop opacity so it reads as depth. |
| `CinematicCamera` | `v2/monolith-scene.tsx` | Slow parallax. Reduce the orbit radius — the console is fixed; the field should breathe, not swing. |
| lerp rig (`MathUtils.lerp`, 0.04) | `v1/floating-cards-scene.tsx` | Node hover and select easing. |
| Modal transition | `product-detail-modal.tsx` | Dialog entrance, retimed 500ms → 340ms. |
| `Monolith` | both scenes | **Retire.** A monolith is an object you look at; a core is a system you are inside. |

### Constants

```
pointer ease      k = 0.075   (0.02 while a dialog is open)
yaw   target      mouseX × 0.46 rad
pitch target      −mouseY × 0.34 rad
plate tilt        rotateY(ry × 11°)  rotateX(−rx × 9°)
idle spin         yaw += 0.0019 / frame
breathing         R × (1 + sin(t × 0.55) × 0.03)
projection        d = 2.9 / (2.9 + z)
spoke impulse     (t × 0.55) mod 1 along the spoke
dialog entrance   340ms, scale .96→1, translateY 14→0, cubic-bezier(.2,.8,.2,1)
```

**The field settles when a dialog opens.** Rotation stops, the pointer lerp drops to 0.02, and the
active circuit stays lit. The stillness is what makes the dialog feel like it took focus — this is
not an optimisation, it is the interaction.

One `<Canvas>` behind the console, `dpr={[1, 1.5]}`, `pointer-events: none`.

---

## 8. Responsive and reduced motion

| Breakpoint | Behaviour |
|---|---|
| ≥ 1100px | Full console as specced. |
| < 1100px | Three columns collapse to one. Core shrinks; capability list becomes the hero. |
| < 700px | Dialogs become bottom sheets. Spokes are dropped — at 390px they are 10px stubs. Node discs 52px, unlabelled (the list below names them). |

Hit targets never below **44px** in mobile content. Node discs are 66px desktop, 52px mobile.

Extend the existing `prefers-reduced-motion` block: freeze the canvas to a single static frame,
disable the dash animation on arcs and wires, skip the boot sequence entirely, and keep the dialog
transition under 120ms.

---

## 9. SEO — the decision that can quietly cost traffic

A single page whose content exists only inside dialogs is **invisible to crawlers**.

**Required:** server-render all six capability bodies plus the four aux dialogs into the DOM. The
dialog *reveals* an existing node; it does not mount new content. Use `@radix-ui/react-dialog` with
the content already present and visually hidden, not conditionally rendered.

Add shallow routing so each dialog is linkable and the back button closes it:

```
/?panel=agents   →  opens the Agent Systems dialog
```

Cheap now, awkward to retrofit. Without it there is exactly one shareable URL for the whole studio.

---

## 10. Acceptance criteria

- [ ] Page occupies exactly one viewport at 1440×900. No scrollbar.
- [ ] All six panels, six nodes and six wires render; each wire terminates at its own panel header.
- [ ] Hovering a panel lights its node, spoke and wire; the other five drop back.
- [ ] Opening a dialog latches the circuit and settles the field.
- [ ] Dialog traps focus, closes on Esc, scrim click and ✕, and returns focus to the opener.
- [ ] Every dialog body is present in view-source with JS disabled.
- [ ] `/?panel=agents` deep-links; browser back closes the dialog.
- [ ] Wires stay attached to node and port after resize and after webfont load.
- [ ] `prefers-reduced-motion` yields a static core and no boot sequence.
- [ ] Node labels legible at 100% zoom; all hit targets ≥ 44px.
- [ ] `yarn lint` and `yarn build` pass.

---

## 11. Open items — need a decision before build

| Item | Detail |
|---|---|
| **Gold vs the mark** | The logo is green and charcoal only. Gold predates the logo file. One token change to go green-only. |
| **Logo vector** | Supplied file is a white-background raster. Live text is the fallback; ship the vector if it exists. |
| **Timezone** | Clock is `Africa/Johannesburg`. Confirm, or switch to visitor-local. |
| **Contact address** | `hello@bespokelabs.dev` is carried from the current site. Confirm it is monitored before launch. |
| **Proof** | No metrics, logos or testimonials exist on the page because none were verifiable. Real named client work belongs in the Studio dialog and would outperform everything else on the page. |
