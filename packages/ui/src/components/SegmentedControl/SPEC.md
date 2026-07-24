# SegmentedControl — SPEC

## Purpose
Single-select view/filter switcher where exactly one option is always active. NOT for navigation between routes (Tabs), NOT for multi-select filtering (FilterChip, later), NOT for form choices that submit (Radio, later).

## Reference
RapidX "All · IBP · ECC · BW" source filter, Cognito "Hierarchy/Tables/Summary" pill toggles — rendered with SHARP corners per canon.

## Anatomy
group (recessed neutral track: surface-faint + hairline, 2px inner padding) → segment[] (Base UI Toggle buttons; active = solid surface, text-primary, hairline-strong border) → optional icon slot per segment.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `{ value: string; label: ReactNode; iconStart?: ReactNode; disabled?: boolean }[]` | required | |
| `value` | string | — | controlled |
| `defaultValue` | string | first option | uncontrolled |
| `onValueChange` | `(value: string) => void` | — | fires only on actual changes |
| `size` | `sm(26 total) \| md(30 total)` | `md` | segment 20/24px inside 2px track padding + 1px border |
| `disabled` | boolean | false | disables the whole group |
| `className` / `style` / `id` / `aria-label` / `aria-labelledby` | — | — | group element |

## States matrix
segment: inactive (transparent, text-secondary) · inactive hover (text-primary) · active (`data-pressed`: surface-solid bg, text-primary, hairline-strong border) · focus-visible (3px focus-ring shadow) · disabled (0.45 opacity). Group disabled dims everything.

## Behavior & keyboard
Base UI `ToggleGroup` (@base-ui/react/toggle-group) + `Toggle` (@base-ui/react/toggle), `multiple={false}`. The group is always rendered controlled internally so one segment stays selected: Base UI's empty-array deselect (clicking the active segment) is swallowed — no callback, no visual change. Arrow keys move roving focus between segments (Base UI composite); Space/Enter activates. `aria-pressed` reflects selection.

## Tokens consumed
surface.{faint,solid}, border.{hairline,hairline-strong}, accent.focus-ring, text.{primary,secondary}, space, font.{size,weight,tracking}, motion.{duration-fast,easing-standard}, radius.none.

## Do / Don't
- Do: keep labels to one short word; 2–5 segments.
- Don't: use it when "none selected" is a valid state — that's a FilterChip set.
- Don't: encode status in segments; they are views, not signals.

## Open questions
- `fullWidth` (equal-width segments) deferred until a layout needs it.
