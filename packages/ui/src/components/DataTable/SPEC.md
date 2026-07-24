# DataTable — SPEC

## Purpose
THE tabular-data workhorse: dense, calm, solid-surface tables for run histories, user/LLM/execution lists, and report inventories. Headless-ish — data, sorting logic, selection state, and pagination state all live OUTSIDE; the component renders rows and emits intents. NOT for key-value detail panes (use a definition-list pattern) and NOT for card grids (use `Grid`).

`Pagination` ships alongside as its own export: it is THE unified pagination pattern, replacing the two divergent RapidX/Cognito paginators. It works with any paged region, not just tables.

## Reference
RapidX Job Runs/History (sortable timestamp columns, status pills, system tags). Cognito user/LLM/execution tables. CM Data Integrity Data Coverage (`docs/figma/refs/data-coverage.md`): 40px THead, 52px rows, hairline dividers (`Vector 802`), trailing 48px chevron column, expandable `Tr- Current Reports` row (Default/Hover/Opened 52→324px), shared pagination bar ("Showing … rows of 11,265" + "Page 1 of 35" + prev/next). Trends & Cases (`trends-and-cases.md`): "Sample failing records" table — small gray caps TH, sortable `DATE ▾`, machine-face key strings, identical pagination.

## Anatomy
`wrapper` (solid surface + hairline border, x-scroll) → `table` → `thead`/`th` (label-caps) with optional `sortButton` + `sortIcon` → `tbody` `row`s → `td` cells (`mono`, `alignRight`, `truncate`, or `cellLines` primary + `sub` line) · leading `checkbox` column (selection) · trailing `expandButton`/`chevron` column (expandable) · `expandedRow` > `expandedCell` (colSpan) > `expandedPanel` (sh-rise) · `skeleton` bars (loading) · `emptyCell` (empty) · `pagination` bar (`paginationTotal` + `pageButton`s + `ellipsis`).

## Props

### `Column<Row>`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `key` | string | required | Also the default cell accessor (`row[key]`) and the sort key |
| `header` | ReactNode | required | Rendered in label-caps (uppercase micro, text-tertiary) |
| `render` | `(row) => ReactNode` | `row[key]` | |
| `sortable` | boolean | false | Header becomes a `<button>`; ⇅ affordance |
| `align` | `left \| right` | `left` | Right for numerics/durations |
| `width` | string | — | Sets width + max-width; enables single-line ellipsis truncation |
| `sub` | `(row) => ReactNode` | — | Second gray line → 2-line cell (name over technical sub-label) |
| `subMono` | boolean | false | Sub line in machine face (`/IBP/MDMR_EXECUTE`) |
| `mono` | boolean | false | Whole cell in machine face (timestamps, IDs, durations) |

### `DataTable<Row>`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `Column<Row>[]` | required | |
| `rows` | `Row[]` | required | Already sorted/filtered/paged by the consumer |
| `rowKey` | `(row) => string` | required | Stable identity; drives selection + expansion |
| `sort` | `{ key, dir: "asc" \| "desc" }` | — | Controlled. Component only renders indicators + emits |
| `onSortChange` | `(s) => void` | — | Click cycles asc → desc → asc |
| `expandable` | `(row) => ReactNode \| null` | — | Trailing chevron column (per Figma ref); `null` = row not expandable. Panel spans all cols in a second `<tr>`, animated `sh-rise`. Expansion state is internal |
| `onRowClick` | `(row) => void` | — | Adds pointer cursor; clicks on inner buttons/inputs/links don't bubble to it |
| `selection` | `{ selected: Set<string>, onChange(next) }` | — | Leading checkbox column + header select-all (indeterminate when partial) |
| `empty` | ReactNode | "No rows yet." | Rendered centered when `rows` is empty and not loading — pass an `EmptyState` per `docs/guidelines/empty-states.md` |
| `loading` | boolean | false | 5 pulse-skeleton rows (`sh-pulse`), `aria-busy` on table |
| `density` | `regular \| compact` | `regular` | ~52px vs ~36px row pitch |

### `Pagination`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `page` | number (1-based) | required | |
| `pageCount` | number | required | |
| `onPageChange` | `(page) => void` | required | |
| `totalLabel` | string | — | Left-aligned machine-face summary, e.g. "Showing 1–10 of 11,265" |

`paginationItems(page, pageCount)` is exported for reuse/testing: window of 5 page numbers with ellipsis (`page 7 of 35 → 1 … 6 7 8 … 35`; ≤7 pages → all).

## States matrix
Row: default · hover (`--sh-color-accent-subtle-bg`, the low-intensity accent tint) · clickable (cursor) · expanded (chevron rotates, panel rises) · selected (checkbox checked). Header: static · sortable (hover darkens, focus ring) · sorted asc/desc (▲/▼ in accent; idle ⇅ in faint). Table: loading (skeleton) · empty. Checkbox: unchecked · checked · indeterminate (header only) · focus-visible. Pagination: current page (accent fill) · hover · disabled prev/next at bounds. Impossible: loading+empty (loading wins); sorted indicator on non-sortable column.

## Behavior & keyboard
Hand-rolled — no Base UI, no TanStack. Real `<table>/<thead>/<tbody>`; `<th scope="col">`; `aria-sort="ascending|descending"` on the sorted header, `"none"` on other sortable headers. Sortable headers are native `<button>`s (Space/Enter). Expand toggles are `<button aria-expanded>`; the expanded panel is a second `<tr>` with a single `colSpan` cell. Checkboxes are native `<input type="checkbox">` (styled square, appearance: none); header select-all sets `indeterminate` via ref. Row click is mouse-affordance sugar only — the primary action must also exist as a real link/button in a cell for keyboard users. Pagination is a `<nav aria-label="Pagination">`; current page carries `aria-current="page"`.

## Tokens consumed
surface.solid (dense data area — solid, no glass blur, per elevation.md), border.{hairline,hairline-strong,divider,interactive}, text.{primary,secondary,tertiary,subtle,faint,machine}, accent.{base,emphasis,on-accent,subtle-bg,subtle-border,focus-ring}, font.{family.machine,size.micro/caption/meta/body,weight,tracking.caps/body}, space, motion.{duration,easing}, keyframes sh-rise/sh-pulse, radius: none (canon 0).

## Do / Don't
- Do: sort/filter/page the data outside; feed the component the visible slice.
- Do: format timestamps per `docs/guidelines/date-time-format.md` before rendering; mark those columns `mono`.
- Do: pair every `width`-truncated cell with a tooltip carrying the full value (see truncation.md) — Tooltip integration lands in a later phase; until then prefer generous widths over truncation.
- Don't: color rows by status — status lives in a `StatusBadge` cell; rows stay calm.
- Don't: build a second pagination — `Pagination` is the only sanctioned one.
- Don't: truncate numbers, timestamps, durations, or status labels (truncation.md).

## Open questions
- The internal square checkbox intentionally duplicates the standalone `Checkbox` component (built in parallel); a future pass should unify them once Checkbox stabilizes.
- Tooltip-on-truncation is a known gap until `Tooltip` ships.
- Row-level `aria-label`s for the per-row checkboxes are generic ("Select row"); a `selectionLabel?: (row) => string` prop may be warranted.
