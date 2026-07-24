# @shamrock-design/charts — package SPEC

Thin, token-fed [visx](https://airbnb.io/visx/) wrappers implementing the Shamrock dataviz
method. Five components + shared `lib/` helpers. Every mark, color, and type role reads a
`--sh-*` token — no hex, no magic px (canon #2, #8).

## Non-negotiables baked in

- **Series colors are fixed-order categorical** (`--sh-color-chart-cat-1..5`), assigned by series
  index and never cycled. `seriesColor(i)` throws in dev past slot 5 — fold extras into "Other"
  or facet. A series may pass `colorIndex` to pin its hue so filtering out siblings never repaints
  the survivors (color follows the entity).
- **One y-axis only.** There is no dual-axis API.
- **Status colors are never series colors.** Status tones exist only on the inline glyphs
  (Sparkline/MiniDonut) and only beside a visible status label (canon #4).
- **Marks:** 2px lines; 8px hover markers (`r=4`) with a 2px surface ring; sharp-cornered bars with
  2px surface gaps between stacked segments and between adjacent bars; thin sequential ring on the
  donut. Grid = `--sh-color-chart-grid` hairlines; axis text = `--sh-color-chart-axis` in the
  machine face at 10px. No outer border, no axis domain stroke, no ticks (labels only).
- **Text wears text tokens, never the series color.** A colored 8px square swatch carries identity
  in legends and tooltips.
- **Legend** is rendered for ≥ 2 series (a flex row above the plot); a single series shows none —
  the title names it.
- **Hover by default.** LineChart → crosshair + shared nearest-x tooltip listing every series at the
  hovered x. Bar/Donut → per-mark tooltip. The tooltip is a solid-ink bubble
  (`--sh-color-text-primary` bg, inverse text, caption size).

## Components

| Component | Job | visx used |
|---|---|---|
| `LineChart` | change over time / linear x | scale (time+linear), axis, grid, group, shape (Line/Circle), responsive |
| `StackedBarChart` | magnitude split into parts across categories | scale (band+linear), axis, grid, group, shape (Bar) |
| `DonutChart` | composition of a whole + hero total | shape (Arc), group |
| `Sparkline` | inline trend, no chrome | — (pure path helper) |
| `MiniDonut` | 12–16px inline progress ring | shape (Arc), group |

## `lib/` helpers

- `seriesColor(index)` / `toneColor(tone)` — the color contract.
- `math.ts` (pure, unit-tested): `stackSegments`, `donutArcs`, `nearestIndex`, `buildLinePath`
  (linear + Fritsch–Carlson monotone cubic).
- `Legend`, `ChartTooltip` — shared presentational pieces.
- `useNearestX(xPixels)` — pointer → nearest datum index.
- `AutoWidth` — explicit `width` (tests) or `ParentSize` measurement (runtime).

## Decisions beyond the brief

- **Path generation is hand-rolled in `lib/math.ts`, not `@visx/shape` `LinePath`.** `@visx/vendor`
  and `d3-shape` are not direct dependencies of this package, so a curve factory (`curveMonotoneX`)
  is not importable under pnpm's strict resolution. Owning `buildLinePath` keeps curve math pure and
  directly unit-testable (exactly what the brief asks for) and removes a fragile transitive import.
  Everything else still uses visx (`Bar`, `Arc`, `Line`, `Circle`, scales, axes, grid, group,
  responsive).
- **Tooltip is a positioned `<div>`, not a `@visx/tooltip` portal** — simpler, inherits tokens,
  trivially testable. `x` is clamped inside the plot; `pointer-events: none`.
- **Dev-guard reads `process.env.NODE_ENV` via a `globalThis` cast** so the DTS build stays clean
  without an `@types/node` dependency.
- **`horizontal` StackedBarChart is not implemented** — future work; the vertical stack covers the
  operational cases (pass/fail/retry per day).
- **Sparkline stroke is 1.5px** (vs the 2px canon for full charts) — an inline-glyph exception at
  24px height; documented here.
