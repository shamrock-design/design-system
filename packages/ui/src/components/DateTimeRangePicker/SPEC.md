# DateTimeRangePicker — SPEC

## Purpose

The standard range-of-time control for context bars and dashboard filters (RapidX: "keep it a
standard template and apply it everywhere"). One trigger row (steppers + formatted range field +
calendar toggle) opening a dual-month calendar popover with quick presets and Apply/Cancel commit.
NOT for single-date entry (a future DatePicker/TextInput pattern) and NOT for free-text
timestamps — the formatted face is read-only; edits happen in the popover.

## Reference

`docs/figma/refs/calendar.md` — Figma file `LebdF7tuqBXI7FNm0gDuH3`, Refs page, section 2:101400
"Calendar" (dual-month picker, 4 interaction states). Canon deltas from that ref are deliberately
NOT reproduced:

- Red weekend numerals → weekends render `--sh-color-text-subtle` (color is for exceptions, not
  categories).
- Dashed corner-tick CANCEL/APPLY → standard Shamrock `Button` (outline / primary).
- Hard-coded NVIDIA green → `--sh-color-accent-*` semantic tokens only.
- Two-letter `TH` weekday → single-letter `M T W T F S S` for column rhythm.
- Day numerals set in the machine face (`--sh-font-family-machine`) per canon rule 6.

## Anatomy

Trigger row: `stepBack` (‹ Button) · `field` (Popover trigger button, machine-face formatted range)
· `stepForward` (› Button) · `calendarToggle` (icon Button).

Popover (`--sh-surface-overlay` + hairline + `--sh-shadow-1` per elevation.md): `quick` column
(ghost Buttons, active one outlined) · `Calendar` (two `pane`s: `paneHeader` with outer-edge month
nav + centered month/year label, `weekdays` row, `grid` of `day` cells, optional `time` TextInput
row) · `footer` (Cancel / Apply).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `DateTimeRange` | — | `{ from: Date \| null; to: Date \| null }`, controlled |
| `onChange` | `(r: DateTimeRange) => void` | — | fired by steppers (immediate) and Apply (commit) |
| `quickRanges` | `QuickRange[]` | This week / Last 2 weeks / This month | `resolve(now)` presets |
| `showTime` | `boolean` | `false` | HH:mm TextInputs under each month (24 h per guideline) |
| `stepper` | `"day" \| "week" \| "cycle"` | `"week"` | ‹ › shift the whole range: ±1 day, ±7 days, or ± its own inclusive length |
| `min` / `max` | `Date` | — | day-granularity clamp; out-of-range day cells disabled, steppers refuse to cross |
| `size` | `"sm" \| "md"` | `"md"` | trigger-row control height 26 / 30 px, matching Button/TextInput |
| `disabled` | `boolean` | `false` | whole trigger row inert |

`Calendar` is exported standalone: `value`, `onChange` (fires the click-click state machine
result), `min`, `max`, `showTime`.

## States matrix

Trigger field: default · hover (border-interactive) · open (border-interactive) · focus-visible
(accent ring) · disabled (0.45 opacity) · empty (placeholder "Select range", subtle).
Day cell: idle · hover (square `accent-subtle-bg`) · in-range band (`accent-subtle-bg`) ·
endpoint (`accent-base` + `on-accent`) · today (inset `hairline-strong` outline) · other-month
(faint) · weekend (subtle) · disabled (min/max) · focus-visible (accent ring). Endpoint+today and
endpoint+weekend resolve to endpoint.

## Behavior & keyboard

- Base UI `@base-ui/react/popover` (controlled `open`; the calendar icon Button toggles the same
  Root). Esc / scrim / Cancel close WITHOUT committing; Apply calls `onChange(draft)` then closes.
  Draft state is seeded from `value` each time the popover opens.
- Selection state machine (`selectDay`): first click sets `from` (clears `to`); second click on the
  same-or-later day sets `to`; clicking a day before `from` restarts with the new `from`.
  Time-of-day of an existing endpoint is preserved when its day is re-picked.
- Steppers act on the committed `value` immediately (no popover). A shift that would cross
  `min`/`max` is ignored. Incomplete range + `cycle` stepper is a no-op.
- Keyboard: trigger/steppers are standard buttons. Inside the calendar: roving tabindex
  (hand-rolled), Arrow keys move day focus ±1/±7, PageUp/PageDown shift a month, Enter/Space
  selects the focused day. Focus follows across the two panes; visible months auto-shift when
  focus leaves them. `role="grid"`/`row`/`columnheader`/`gridcell`, `aria-selected` on endpoints,
  `aria-current="date"` on today.

## Timezone posture

All math is hand-rolled on native `Date` in **local time** — no date library, no UTC conversion.
The consumer labels the operating timezone once at page level ("All times PST") per
`docs/guidelines/date-time-format.md`; this component never renders a zone suffix.

## Formatting

`formatRange` implements date-time-format.md: `Jul 6 – Jul 20` (same-year, no time),
`Jul 6, 13:00 – Jul 20, 13:00` (with time), `Jul 6, 2025` when the year differs from now,
open-ended `Jul 6 – …`. 24-hour clock, machine face, en dash.

## Tokens consumed

`--sh-color-accent-{base,on-accent,subtle-bg,focus-ring}`, `--sh-color-border-{hairline,
hairline-strong,interactive,divider}`, `--sh-color-text-{primary,secondary,subtle,faint}`,
`--sh-surface-{solid,overlay}`, `--sh-shadow-1`, `--sh-font-family-machine`,
`--sh-font-size-{meta,body}`, `--sh-space-*`, `--sh-radius-none`, `--sh-motion-*`, `--sh-z-modal`.

## Do / Don't

- Do: use it wherever a screen filters by a time window — same template everywhere.
- Do: pair with a page-level timezone suffix.
- Don't: hand it a `quickRanges` preset that resolves outside `min`/`max`.
- Don't: color weekends or add corner ticks to the footer buttons (Figma-ref ornaments are
  non-canon).

## Open questions

- Month/year dropdown header cells from the Figma ref are deferred; ‹ › nav + PageUp/Down cover
  the need. Revisit if year-jumps become common.
- Icons package has no `calendar` or `chevron-left` glyph yet; using `clock` and a mirrored
  `chevron-right` until `packages/icons` gains them.
