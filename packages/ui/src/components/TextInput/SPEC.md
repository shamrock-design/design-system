# TextInput — SPEC

## Purpose
Single-line free-text entry, including the search-field variant. NOT for choices (Checkbox/SegmentedControl/Select) and NOT self-labeling — label + help text live outside (a `Field` wrapper arrives later).

## Reference
RapidX "Search jobs…" toolbar input, Cognito searchable inputs, benchmark `.cinput` (solid surface, hairline-interactive border, sharp corners).

## Anatomy
root (bordered flex box) → [start slot] → input → [clear ×] → [end slot]. The border, background, focus ring and sizing live on the root; the native input is chromeless inside it.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `sm(26) \| md(30) \| lg(36)` | `md` | heights match Button |
| `invalid` | boolean | false | critical border + critical focus ring, sets `aria-invalid` |
| `iconStart` / `iconEnd` | ReactNode | — | decorative slots, tertiary text color |
| `search` | boolean | false | search icon takes over the start slot; shows clear × when non-empty **and** `onClear` is provided |
| `onClear` | `() => void` | — | called after the × empties the field (× only renders when given) |
| `fullWidth` | boolean | false | |
| native input props | — | `type="text"` | controlled (`value`+`onChange`) and uncontrolled (`defaultValue`) both work |

`className`/`style` land on the root; everything else goes to the `<input>`.

## States matrix
default · hover (border darkens) · focus-within (accent border + 3px focus-ring shadow) · invalid (critical border; critical-bg ring on focus) · disabled (0.45 opacity, not-allowed) · read-only (no clear ×). Clear × has its own hover/focus-visible states.

## Behavior & keyboard
Hand-rolled native `<input>` (static). Clicking anywhere on the root focuses the input. Clear × is `type="button"` with `aria-label="Clear"`; clicking it empties the field (uncontrolled: clears the DOM value; controlled: consumer clears in `onClear`) and returns focus to the input. Focus ring uses `:focus-within` on the root — the ring must read on the bordered box, not the chromeless input.

## Tokens consumed
surface.solid, border.interactive, border.hairline-strong, accent.{base,focus-ring}, status.critical.{base,bg}, text.{primary,subtle,tertiary,disabled}, space, font.{size,tracking}, motion.{duration-fast,easing-standard}, radius.none.

## Do / Don't
- Do: pair with an external `<Text variant="label-caps">` label until Field exists; always give search inputs an `aria-label` or visible label.
- Don't: use `type="search"` — WebKit injects its own rounded clear button; the component renders its own sharp ×.
- Don't: put interactive content in `iconStart`/`iconEnd` slots; they are decorative.

## Open questions
- Ref forwarding to the inner input (React 19 ref-as-prop) deferred until a concrete consumer needs it.
