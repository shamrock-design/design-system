# KeyValueList — SPEC

## Purpose
Metadata pairs — run detail headers, drawer facts, config summaries. NOT for metrics (KPITile — those need baselines) and NOT for tabular collections (Table, Phase 3).

## Reference
RapidX run header ("L0 Stage: X · Mode: Automated" inline strips), Cognito detail drawers (stacked label-over-value facts), benchmark `.kv` grids.

## Anatomy
`<dl>` container → pair (`<div>` wrapping `<dt>` key + `<dd>` value). Vertical: key eyebrow above value, optional column grid. Inline: `key: value` pairs flowing with `·` separators.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ key: string; value?: ReactNode; mono?: boolean }[]` | required | `mono` sets the machine face for machine values |
| `orientation` | `vertical \| inline` | `vertical` | vertical = stacked rows; inline = dot-separated flow |
| `columns` | number | `1` | vertical grid column count (ignored inline) |

## States matrix
2 orientations × mono × missing. Missing value (`null`/`undefined`/`""`) renders `—` (em dash) in `text-disabled` per empty-states.md cell-level absence. Non-interactive — no hover/active/focus.

## Behavior & keyboard
Static `<dl>`/`<dt>`/`<dd>` — semantics for free, not focusable. Inline `:` and `·` are CSS-generated presentation.

## Tokens consumed
text.{subtle,tertiary,secondary,primary,disabled,faint,machine}, font.{family.machine,size.{body,meta,micro},weight.semibold,tracking-caps,leading-tight}, space.

## Do / Don't
- Do: `mono` every machine value — timestamps, IDs, durations, counts (canon #6).
- Do: pass missing data as `undefined` and let the component render `—`; absence is information.
- Don't: hand-roll "Label: value" strings — separators and missing-value styling live here.
- Don't: put status words in values as plain text — embed a `<StatusBadge>` as the value.

## Open questions
—
