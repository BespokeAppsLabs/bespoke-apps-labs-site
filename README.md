# Bespoke Applications Labs

Public site for Bespoke Applications Labs: a systems studio that builds custom applications, AI operators, media engines, BespokeOS, and infrastructure for serious businesses.

## Design direction

The homepage uses an editorial systems-studio identity rather than a generic software dashboard:

- **Palette:** deep forest, emerald/mint, paper, and gold.
- **Identity:** a geometric Bespoke monogram and technical-drafting details.
- **Content:** applications, agent systems, media, BespokeOS, networks, and academy—without fabricated metrics or internal implementation language.
- **Accessibility:** responsive layout, semantic navigation, visible text contrast, and reduced-motion support.

## Redesign in progress — Operator Console (v3)

Design is complete and specced in [`docs/operator-console/`](docs/operator-console/); the build has
not started. `app/page.tsx` still renders the current `/v2` landing page.

- [`docs/operator-console/BUILD-SPEC.md`](docs/operator-console/BUILD-SPEC.md) — implementation spec
- [`docs/operator-console/console-canvas.html`](docs/operator-console/console-canvas.html) — visual spec, opens offline in any browser
- [`docs/adr/0001-single-page-console.md`](docs/adr/0001-single-page-console.md) — decision record

## Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 for the base stylesheet import
- Lucide icons
- Resend endpoint retained at `POST /api/send` for the legacy contact form; it requires `RESEND_API_KEY`.

## Development

```bash
yarn dev
yarn lint
yarn build
```

The production site is served from `/`. The prior implementations remain available at `/v1` and `/v2` while the migration is in progress.

## Verification

`yarn lint` and `yarn build` pass. In a restricted sandbox, the Next.js/Turbopack CSS worker may fail to bind its internal port; run the build with normal host permissions in that environment.
