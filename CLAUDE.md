# Shamrock Design System

Token-driven, **color-agnostic** design system for the Shamrock/3Frames ecosystem: internal products + white-labeled client solutions. Storybook is the workshop; packages publish to GitHub Packages.

## Coordination (multi-agent — read first)

More than one agent/session may work here at once. **Before editing anything, read [`docs/coordination.md`](docs/coordination.md), claim your scope there, and never touch a path inside another agent's active claim.** Parallel work is decomposed and assigned by whoever holds the Orchestrator role on that board — don't start overlapping work independently. Re-read shared barrels (`packages/ui/src/index.ts`, `packages/charts/src/index.ts`, `apps/smoke/src/App.tsx`) right before writing them; they change under you.

## Commands

- `pnpm turbo build` — build everything (tokens → ui/icons → apps)
- `pnpm turbo test typecheck` — all tests + typechecks
- `pnpm storybook` — run the workshop locally (port 6006)
- `pnpm changeset` — record a version bump (required for any `packages/*` change)

## Repo map

- `packages/tokens` — DTCG JSON sources (`src/primitive|semantic|themes`) compiled by `scripts/build.mjs` to `--sh-*` CSS vars + typed JS. Themes are enforced by `scripts/check-theme-contract.mjs`.
- `packages/ui` — React components. CSS Modules + `--sh-*` vars only. Primitives: `Stack`, `Inline`, `Grid`, `Text`, `VisuallyHidden`, `Aurora`. Canonical status enum: `src/constants/status.ts`.
- `packages/icons` — `svg/` sources → `scripts/build-icons.mjs` → generated `<Icon name>` components.
- `packages/assets` — illustrations/lottie/rive/gifs/raster + generated `manifest.json`.
- `apps/workshop` — Storybook 9 (react-vite), theme toolbar Neutral/Clover/Violet.
- `apps/smoke` — scratch consumer; will host the permanent benchmark-rebuild pages.
- `docs/` — ADRs, guidelines, consuming docs, figma-sync playbook.
- `refs/` — gitignored reference material (benchmark apps + app screenshots) that defined the canon.

## The canon (imperative — do not violate)

1. **Radius is 0.** Sharp corners everywhere. Only status dots/orbs (`--sh-radius-circle`) and count pills (`--sh-radius-pill`) may round.
2. **The core is colorless.** Components reference ONLY semantic tokens (`--sh-color-accent-*`, `--sh-color-text-*`, `--sh-surface-*`, …). Never a brand hex, never `--sh-green-*`/`--sh-violet-*` (those don't exist in core.css by design).
3. **Themes may only set `color.accent.*` and `font.*`** — CI-enforced. Never add radius/shadow/spacing to a theme file.
4. **Status is signal, not brand.** Status colors are theme-invariant and come from the enum in `@shamrock-design/ui` (`neutral|info|success|warning|critical|pending|running`). Always dot + text label, never color alone.
5. **Color is a scarce, earned resource.** Nominal states render calm/gray; saturated color = exception. A screen that's colorful when everything is fine is wrong.
6. **Machine values** (timestamps, IDs, durations, counts) use `Text variant="machine"` / `--sh-font-family-machine`.
7. **No naked numbers.** Metrics always render against a baseline ("+35 min vs plan").
8. **No raw values in components.** No hex colors, no magic px — tokens/primitives only. Type via `<Text>`, spacing via `Stack/Inline/Grid` gaps or `--sh-space-*`.
9. Glassmorphism surfaces (`--sh-surface-panel/card/overlay`) sit over the `<Aurora />` backdrop; hairline borders (`--sh-color-border-hairline`) over shadows for cards.

## Workflow

- New components: copy `docs/component-spec-template.md` to the component folder as `SPEC.md` first; stories required (`Default` + `AllVariants`); a11y must pass in Storybook.
- Any `packages/*` change needs a changeset. `tokens/ui/icons` are version-linked.
- Figma work: read `docs/figma-sync.md` before touching anything Figma-related. Code is the source of truth.
- Before designing anything new, read `docs/guidelines/`.
