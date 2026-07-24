# Checkbox — SPEC

## Purpose
Binary (or mixed) opt-in for settings and multi-select lists. NOT for mutually exclusive choices (SegmentedControl/Radio) and NOT for instant on/off system state (Switch, later).

## Reference
Cognito "Show Inactive" toggles and bulk-select table headers (mixed state), benchmark form checkrows.

## Anatomy
label (flex row, the whole thing is the hit target) → box (Base UI Checkbox.Root, the focusable role="checkbox" span) → indicator (Base UI Checkbox.Indicator with an inline SVG check / minus) → label text (children).

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `sm(14px box) \| md(16px box)` | `md` | label text meta/body |
| `children` | ReactNode | — | label content; clicking it toggles |
| `indeterminate` | boolean | false | mixed state: `aria-checked="mixed"`, minus mark |
| Base UI root props | `checked`, `defaultChecked`, `onCheckedChange(checked, details)`, `disabled`, `required`, `readOnly`, `name`, `value`, `inputRef`, … | — | controlled + uncontrolled |

`className`/`style` land on the outer label.

## States matrix
unchecked · checked (accent-base fill, on-accent check) · indeterminate (accent fill, minus) · hover (border tint on unchecked) · focus-visible (3px focus-ring shadow on the box) · disabled (0.45 opacity on the row, not-allowed). Indeterminate wins over checked for the data attributes (Base UI behavior).

## Behavior & keyboard
Base UI `Checkbox.Root` + `Checkbox.Indicator` (@base-ui/react/checkbox). Root renders a focusable span (role="checkbox") plus a hidden `<input>` for forms/label activation — wrapping everything in a `<label>` makes label clicks toggle. Space toggles; Enter does not (Base UI). Check/minus are inline SVGs, `stroke="currentColor"` at 1.8/12 viewBox.

## Tokens consumed
surface.solid, border.interactive, accent.{base,subtle-border,on-accent,focus-ring}, text.primary, space, font.{size,tracking,leading}, motion.{duration-fast,easing-standard}, radius.none.

## Do / Don't
- Do: always give it a label (children) — a bare box has no accessible name.
- Don't: drive `indeterminate` from user clicks; it is a derived "some children checked" state the parent computes.
- Don't: use for immediate actions — checking must not fire a mutation by itself.

## Open questions
- CheckboxGroup (Base UI has one) deferred until a real multi-select form needs it.
