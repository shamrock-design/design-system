# Select — SPEC

## Purpose
Pick exactly one value from a closed list. NOT for open-ended or huge lists that need filtering — a searchable **Combobox is a later, separate component**; do not bolt a search input onto this one. NOT for 2–4 always-visible choices (use Tabs pill / a future SegmentedControl).

## Reference
Cognito: environment/system pickers on the sync form. RapidX: target-system dropdown. Benchmark `.sel` (input-height trigger, overlay glass menu).

## Anatomy
trigger (value/placeholder · chevron) → portal → positioner (z: modal) → popup (overlay glass) → item (check indicator · label · gray description line — the 2-line cell pattern).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `SelectOption[]` | — | `{ value, label, description?, disabled? }` |
| `value` / `defaultValue` | `string \| null` | — | controlled / uncontrolled |
| `onValueChange` | `(value: string \| null) => void` | — | |
| `placeholder` | `string` | `"Select…"` | subtle-toned trigger text when empty |
| `size` | `sm(26) \| md(30) \| lg(36)` | `md` | same heights as Button/TextInput |
| `invalid` | `boolean` | `false` | critical border + critical focus ring; sets `aria-invalid` |
| `disabled` | `boolean` | `false` | |
| `fullWidth` | `boolean` | `false` | |
| `name` / `required` / `id` | — | — | hidden input participates in forms |
| `aria-label` / `aria-labelledby` | — | — | required when no external `<label>` points at `id` |

## States matrix
trigger: default · hover (interactive border) · open (interactive border, chevron flips) · focus-visible (3px focus ring) · invalid (critical border, critical ring) · disabled (0.45 opacity). item: default · highlighted (accent subtle bg) · selected (check indicator, semibold label) · disabled.

## Behavior & keyboard
Base UI `@base-ui/react/select` (`Select.Root/Trigger/Value/Icon/Portal/Positioner/Popup/Item/ItemIndicator/ItemText`). Enter/Space/ArrowDown opens; arrows move highlight; Enter/Space selects; Escape closes. **Typeahead is built in** — typing while the trigger is focused or the popup is open jumps to the matching option label (that's why plain-text `label` matters). `alignItemWithTrigger` is disabled: the popup always drops as a menu below/above the trigger. Popup min-width tracks the trigger via Base UI's `--anchor-width`.

## Tokens consumed
surface.{solid,overlay}, border.{hairline,hairline-strong,interactive}, accent.{focus-ring,subtle-bg,emphasis}, status.critical.{base,bg}, text.{primary,secondary,tertiary,subtle}, space.{1,2,3,4,5}, font.{size.meta,size.body,size.control,weight.medium,weight.semibold,tracking-body}, shadow.1, z.modal, radius.none, motion.{duration-fast,easing-standard}.

## Do / Don't
- Do: use `description` for the second gray line (system codes, environments) instead of cramming into `label`.
- Do: keep `label` a plain string — it feeds typeahead and form value display.
- Don't: exceed ~15 options without flagging the need for the future Combobox.
- Don't: encode status in options via color — status rendering belongs to StatusBadge.

## Not for
- Searching/filtering long lists (later `Combobox`).
- Multi-select (Base UI supports `multiple`; deliberately not exposed in v1).

## Open questions
- Option groups (`Select.Group`) unexposed until a real screen needs them.
