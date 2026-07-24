# Button — SPEC

## Purpose
The action trigger. NOT for navigation that changes URL context (use a link) and NOT for toggling views (use Tabs/SegmentedControl).

## Reference
Cognito: solid purple primaries ("Generate Test Cases", "Run Sync"), outline secondaries ("Access Templates"), ghost/text ("Show Inactive", "Cancel"), red destructive text. RapidX: "Run Sync" primary + outline "Refresh". Benchmark: `.b.primary` (accent fill, ink text on green), `.b.dark`, `.b.ghost`.

## Props
| Prop | Type | Default |
|---|---|---|
| `variant` | `primary \| outline \| ghost \| link \| destructive` | `primary` |
| `size` | `sm(26) \| md(30) \| lg(36)` | `md` |
| `iconStart` / `iconEnd` | ReactNode | — |
| `iconOnly` | boolean (square, requires aria-label) | false |
| `loading` | boolean (spinner replaces iconStart, aria-busy, click-inert) | false |
| `fullWidth` | boolean | false |
| native button props | — | `type="button"` |

## States matrix
default · hover (fill: accent-emphasis / others: subtle tint) · active · focus-visible (3px focus-ring shadow) · disabled (0.45 opacity) · loading. `link` has no height/padding — inline flow.

## Behavior & keyboard
Native `<button>`; hand-rolled (static). Space/Enter native. `loading` keeps focus but ignores clicks.

## Tokens consumed
accent.{base,emphasis,strong,subtle-bg,subtle-text,on-accent,focus-ring}, status.critical.{base,text}, text.{secondary,disabled}, border.interactive, surface.solid, space, font.{size,weight,tracking}, motion.

## Do / Don't
- Do: one `primary` per view region.
- Don't: use `destructive` for emphasis; it means irreversible.
- Don't: icon-only without `aria-label` (throws in dev).
