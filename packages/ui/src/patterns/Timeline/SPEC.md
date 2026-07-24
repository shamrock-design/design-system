# Timeline — SPEC

## Purpose
A swimlane Gantt: lay time-anchored items on a real time axis, grouped into lanes, so
concurrency, overruns, and a live "now" partition are visible at a glance. Use for
run/schedule observability (a weekly batch, a DAG execution). NOT a chart (no encoded
metric axis) and NOT a table — reach for `DataTable` when order/columns matter more than
time position. Lives in `@shamrock-design/ui` because it is pure token-driven layout, not
a plotting library.

## Reference
Planning Observability "Timeline DAG": `refs/apps/Planning/planning-observability/components/Timeline.tsx`,
`refs/apps/Planning/app/assets/views/timeline.js`, and the `.tlaxis / .tick / .tllane /
.tlnode / .tlnowline / .tltask` rules in that app's `globals.css`. The RUNS across IBP/ECC/BW
lanes — finished/running/overdue/aborted bars, a gate, a "didn't run" ghost, and the red NOW
rule — are the canonical example (see the `WeeklyRun` story).

## Anatomy
- **scroll / canvas** — the horizontally scrollable surface (`laneWidth + plotWidth`).
- **axis** — sticky top; `tick` marks + machine-face `ddd HH:mm` labels; sticky top-left `axisCorner`.
- **lane** (`role=row`) — sticky `laneLabel` (`role=rowheader`) gutter + a plot region.
- **item** (`role=gridcell`) — a **bar** (start→end) with a 3px left status color-bar, a status
  **dot**, a truncated **label** (title tooltip), optional system **Tag**, **time**, **GATE** badge; or
  a **diamond** milestone (no `end`). **ghost** items are dashed + faint with a "didn't run" tag.
- **nowLine** — 2px `status-critical-base` vertical rule + a "NOW" tag.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `TimelineItem[]` | required | `{ id, lane, label, start, end?, status, gate?, ghost?, system? }` |
| `lanes` | `string[]` | derived | explicit top→bottom order; empty lanes still render |
| `start` / `end` | `Date` | min/max of items | the visible window |
| `now` | `Date` | — | draws the NOW rule when inside the window |
| `tickEvery` | `hour \| day \| auto` | `auto` | `auto` → day beyond a 48h span |
| `laneWidth` | `number` | `160` | left gutter px |
| `rowHeight` | `number` | `34` | sub-row pitch px |
| `onItemClick` | `(item) => void` | — | makes items `<button>` with a focus ring |
| `emptyMessage` | `ReactNode` | default sentence | shown when no items and no lanes |
| `aria-label` | `string` | `"Timeline"` | names the grid |

## Exported helpers (pure, unit-tested)
- `timeScale(window, plotWidth)` → `{ x, clampX, plotWidth, start, end, spanMs }`;
  `px = (t - start) / (end - start) × plotWidth`, zero-span guarded.
- `tickMarks(window, tickEvery)` → `{ date, label, major }[]` (hour/day/auto).
- `resolveTickUnit`, `formatAxisLabel` (`ddd HH:mm`), `formatDuration` (largest two units).

## States matrix
Per status (`neutral · info · success · warning · critical · pending · running`): bar fill.
Calm/exception-first — **only `warning`/`critical` fill saturated**; `pending` is a hollow outline;
everything else is muted grey with the status carried by the 3px edge + dot. `running` dot pulses.
Cross-cutting: milestone (no `end`), gate, ghost, interactive (button) vs static, empty.

## Behavior & keyboard
No Base UI — pure layout. Sticky axis (top) + sticky lane gutter (left) survive scroll; the plot
scrolls horizontally (`overflow: auto`). With `onItemClick`, items are native `<button>`s: `Tab`
to focus (ring via `accent-focus-ring`), `Enter`/`Space` to activate. Bars/labels position by px
mapped from time; out-of-window items clamp to the edge.

## ARIA
`role=grid` (lanes container, `aria-label`) → `role=row` (lane) → `role=rowheader` (gutter) +
`role=gridcell` (items). Interactive items carry a full `aria-label` (lane, label, status, gate/ghost,
time). Axis, gridlines, and NOW rule are `aria-hidden` decoration.

## Tokens consumed
`color.status.<s>.{base,bg,text}`, `surface.solid`, `color.border.{hairline,hairline-strong,divider}`,
`color.text.{primary,secondary,tertiary,subtle}`, `color.accent.focus-ring`, `font.family.machine`,
`font.size.{micro,caption,meta}`, `font.weight.*`, `font.tracking.*`, `space.*`, `radius.{none,circle}`,
`motion.*`, `z.sticky`. Geometry (positions, plot width, row pitch) is runtime px — intrinsic to a Gantt,
not a magic-number violation.

## Do / Don't
- Do: normalize foreign statuses with `mapLegacyStatus()` before building items ("Finished"→`success`,
  "Aborted"→`critical`, "Overdue"→`warning`).
- Do: pass a `now` to anchor the run against the clock; put the timezone once at page level ("All times PST").
- Don't: encode a metric on the x-axis — this is a time axis only.
- Don't: make nominal ("done") bars green — color is scarce; a screen that's colorful when everything is
  fine is wrong. Saturation is reserved for late/failed.

## Open questions
- Dependency edges (bar→bar arrows) and zoom controls exist in the benchmark; deferred until a consumer
  needs them.
