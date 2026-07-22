# Elevation

Shamrock is **border-first, shadow-second**:

- Resting cards/panels: glass surface + 1px hairline border. No shadow.
- Hover-lift (interactive cards): `translateY(-2px)` + `--sh-shadow-2`, `--sh-motion-duration-fast` + `--sh-motion-easing-standard`.
- Overlays (popover/dropdown): `--sh-surface-overlay` + hairline + `--sh-shadow-1`.
- Modals: `--sh-shadow-3` over `--sh-surface-scrim`.
- Drawers: `--sh-shadow-drawer` (directional) + left hairline.
- Focus: `box-shadow: 0 0 0 3px var(--sh-color-accent-focus-ring)` — never `outline: none` without it.

Z-index only from tokens: `--sh-z-{base,sticky,drawer,modal,toast,tooltip}`. Glass surfaces need `backdrop-filter: blur(12–22px)` to read as glass; solid `--sh-surface-solid` is for dense data areas (tables) where blur hurts legibility.
