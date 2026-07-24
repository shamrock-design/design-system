# CascadeTimeline — SPEC

## Purpose
The design system's flagship run view: a **dependency-sorted waterfall** on a sticky
horizontal time axis with an **in-place accordion ego-graph**. Steps are laid one per
row in topological order so every dependency points down-and-right by construction —
the timeline doubles as a lineage view with **zero resting edges**. Clicking a row
blooms a bounded 3-column local graph (needs · N → step → unlocks · N) directly beneath
it, so dependency ink never sprawls across the chart.

Not for: a plain schedule Gantt with no dependencies (use a simpler Timeline), the
node-link/model-editor authoring view (this is a run/observation lens, not the editor),
or dense >~120-step runs where a matrix/super-graph reads better.

## Reference
Ported 1:1 from the benchmark `refs/apps/Planning/planning-observability/components/CascadeTimeline.tsx`
+ `cascade.module.css` (the "F1 Cascade Timeline", Malik's pick — see
`refs/apps/Planning/timeline-dependency-directions.md` shortlist v2, direction F1).
Formalized onto `--sh-*` tokens. Selectors mirrored: `.axis/.tick/.tickMajor/.dayChip`
sticky axis; bars `.bDone/.bFail/.bRun/.bGhost/.bReady/.bLocked`; `.nowLine/.nowTag`;
`.rowKin` green inset ledge; accordion panel (`.panel/.chip/.chipCenter/.edges/.foot`).

## Anatomy
- **root / scroll / canvas** — viewport-bounded, scrolls in both axes.
- **axis** (sticky top) — `axisCorner` (sticky-left day chip + "topo ↓ · time →" legend),
  hour `tick`s (major at midnight / every 6h), `nowTag`.
- **gridLayer** — full-height hour grid + red `nowLine`, clipped to the clock region.
- **row** (`<button>`) — `labelCell` (sticky left: `gutterL ◀N`, `seq`, status `dot`,
  `name`, `GATE`, `GHOST`, `gutterR N▶`) + `clockCell` (the `bar`, on-select `timeChip`).
- **panel** (accordion) — sticky-left `panelInner`: bracket `edges` (SVG, bounded),
  `colHead`s, `close`, upstream/downstream `chip`s, `chipCenter`, `foot` rollups.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `steps` | `CascadeStep[]` | — | dependency-sorted internally |
| `now` | `Date` | — | draws the red NOW line only when set |
| `start` / `end` | `Date` | data extent | pin the time window |
| `onStepClick` | `(step) => void` | — | fires on row **and** ego-graph chip activation |
| `expandedId` | `string` | — | controlled open ego-graph (with `onExpandedChange`) |
| `onExpandedChange` | `(id \| null) => void` | — | reports open/close/walk |
| `height` | `number` | `520` | viewport height (rows scroll inside) |

`CascadeStep`: `{ id, label, technical?, start, end?, status: Status, needs?, unlocks?, ghost?, gate?, kin? }`.

## States matrix
Per row the bar treatment is derived from the status enum (calm/exception-first):
`success → done` (muted ink), `running → run` / `warning → late` (amber),
`critical → fail` (red), `info → ready` (outline), `pending|neutral → locked` (outline),
`ghost → ghost` (dashed amber, overrides). Row: default · hover · focus-visible ·
selected · kin. Panel: one open at a time (controlled + uncontrolled).

## Behavior & keyboard
Static (no Base UI). Rows are buttons: `Enter`/`Space` toggle the ego-graph
(`aria-expanded` + `aria-controls`); `Escape` collapses. Chips walk the chain (set
selection to the neighbour, auto-reported via `onExpandedChange`). One ego-graph open at
a time. Real horizontal scroll with a sticky top axis and sticky-left label column; the
ego-graph is pinned (`position: sticky; left: 0`) so it never scrolls out of view. Day
chip follows `scrollLeft`.

## Tokens consumed
Ink `--sh-color-ink-{4,5,6}`, hair `--sh-color-hair-{1,2,3,4}` / `--sh-color-border-hairline*`,
amber `--sh-color-amber-{base,bg,text}`, status `--sh-color-status-{success,critical,info,pending}-base`,
glass `--sh-color-glass-{2,3,4}` / `--sh-surface-{panel,overlay,solid}`, machine face
`--sh-font-family-machine`, `--sh-font-size-{micro,caption,meta,body}`, spacing `--sh-space-*`,
`--sh-radius-{none,circle}`, `--sh-motion-*`, `--sh-shadow-1`, `--sh-z-sticky`,
`--sh-color-accent-focus-ring`.

## Do / Don't
- **Do** keep the calm zero-line rest state; reveal one step's ~5 edges only on select.
- **Do** render `done` as muted ink; reserve saturated color for running/late/failed.
- **Don't** draw all dependency edges at once (the spaghetti this pattern exists to kill).
- **Don't** color a bar's state by hue alone — fill/pattern (solid/outline/dashed) + the
  accessible row name carry the state redundantly.

## Decisions beyond the benchmark
- **Red NOW line** (spec) instead of the benchmark's neutral ink line.
- **24-hour clock** (`HH:mm` / `ddd HH:mm`) per `docs/guidelines/date-time-format.md`,
  not the benchmark's AM/PM.
- **Real horizontal scroll + sticky columns** replaces the benchmark's `--panx`
  vertical-scroll-driven pan (matches the "horizontal scroll with sticky axis" brief).
- Dropped the app-specific scrubber/minimap/router — out of this component's API.
- `running` maps to the amber (saturated in-flight) treatment per the F1 port, even though
  the Shamrock `status.running` token is blue; the accordion neighbour dots use the true
  status-enum colors (a met need earns success green).

## Helpers (pure, tested — `./helpers.ts`)
`dependencySort` (stable, cycle-safe topo), `egoGraph`, `kinSet`, `blocksCount`,
`forwardAdjacency`, `timeBounds`, `pxPerMinute`, `scaleTime`, `buildTicks`, `barState`,
`formatClock`, `formatDayClock`, `formatDuration`.

## Open questions
- Slack-sort / scrub-play "modes" from the F1 write-up are intentionally out of scope for
  v1; revisit if the run view needs them.
