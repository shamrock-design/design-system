# Contributing assets (designers)

Assets live in `packages/assets/<category>/` and ship to every app as a versioned package. Contribute via PR — CI validates automatically; no developer needed.

## Naming
`category-subject-variant.ext`, kebab-case: `empty-search-results.svg`, `loading-clover-spin.json`, `error-connection-lost.svg`.

## Export presets

- **SVG (illustrations):** outline all text, flatten transforms, viewBox preserved, no embedded raster. Use `currentColor` where the illustration should adapt to theme; literal colors only for genuinely fixed art.
- **Lottie:** Bodymovin export, assets embedded, no expressions unsupported by lottie-web; prefer `.lottie` (dotLottie) when the pipeline supports it.
- **Rive:** `.riv` runtime exports.
- **Raster:** prefer `.webp`; `.png` only when transparency + wide compat needed. Export @2x of intended display size, not source resolution.
- **Gif:** last resort — prefer Lottie/Rive for animation.

## Icons (separate package)
`packages/icons/svg/` — 24×24 grid, 1.5px stroke, `currentColor` only, kebab-case filename. The build **rejects** hardcoded colors and wrong viewBoxes. Match the existing line style (round caps/joins).

After merge, run `pnpm --filter @shamrock-design/assets build` (or let CI) to regenerate `manifest.json` — apps discover assets through it.
