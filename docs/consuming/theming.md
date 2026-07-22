# Theming

Shamrock's core is **colorless**: `core.css` ships a fully usable monochrome UI. A theme file remaps the accent slot (and optionally fonts) under `[data-theme="<name>"]`.

## Using a theme

Import `core.css` + exactly one theme css, set `data-theme` on `<html>` (or any subtree — theming is scoped, so a white-label preview pane can carry its own `data-theme`).

Built-in themes: **clover** (green, client benchmark), **violet** (internal purple, swaps UI font to Inter).

## What a theme may change — and may not

| Themable | Fixed canon |
|---|---|
| `color.accent.*` (8 slots) | status colors, text/border roles, surfaces |
| `font.family.*` | radius (0), shadows, spacing, motion, z |

This is CI-enforced (`check-theme-contract.mjs`), not a convention.

## Creating a client theme

1. Add `packages/tokens/src/themes/<client>.json` defining the 8 `color.accent.*` slots (base, emphasis, strong, subtle-bg, subtle-text, subtle-border, on-accent, focus-ring) — reference new primitives you add to `primitive/color.json`, or literal hex.
2. Pick `on-accent` for contrast against `base` (dark ink for light accents like the green; white for dark accents like the violet). Verify ≥ 4.5:1.
3. `pnpm changeset` (minor on tokens), PR. The build emits `theme-<client>.css` automatically and the workshop toolbar picks it up.

Accent slot semantics: `base` = fills/CTAs/active states · `emphasis` = hover/text-on-light · `strong` = deep small-label text · `subtle-*` = tinted badge/selection surfaces · `focus-ring` = focus outline.
