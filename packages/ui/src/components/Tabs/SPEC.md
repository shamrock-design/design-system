# Tabs — SPEC

## Purpose
Switch between peer views of the same context. NOT for navigation that changes URL context (use links) and NOT for triggering actions (use Button). This component is THE unification of the three drifted production tab styles — no app rolls its own tabs anymore.

## Reference
Cognito: underlined section tabs ("Test Cases / Runs / History") with count bubbles. RapidX: pill-style view switcher on the sync dashboard. Benchmark: `.tabs.u` (accent underline) and `.tabs.p` (solid pill). All three collapse into two variants here.

## Anatomy
root → list (variant + size live here) → tab (iconStart slot · label · count pill) · panel(s).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `TabItem[]` | — | `{ value, label, iconStart?, count?, disabled? }` |
| `variant` | `underline \| pill` | `underline` | underline: hairline baseline, active = 2px accent underline. pill: transparent container, active = surface-solid + hairline border |
| `size` | `sm(26) \| md(30)` | `md` | |
| `value` / `defaultValue` | `string` | first enabled item | controlled / uncontrolled |
| `onValueChange` | `(value: string) => void` | — | |
| `renderPanel` | `(value: string) => ReactNode` | — | renders one styled panel per item |
| `children` | `<TabsPanel>` elements | — | alternative to `renderPanel` for custom/`keepMounted` panels |
| root div props | — | — | `aria-label` the list via `listProps` is not exposed; label the root |

`count` renders a small machine-face counter pill (counts are machine values — canon #6; pills may round — canon #1).

## States matrix
tab: default · hover (text-primary / pill: faint bg) · active (underline: 2px accent-base + text-primary; pill: surface-solid + hairline border + text-primary) · focus-visible (3px focus-ring shadow) · disabled (0.45 opacity). No loading/error states — tabs never fetch.

## Behavior & keyboard
Base UI `@base-ui/react/tabs` (`Tabs.Root/List/Tab/Panel`). Left/Right arrows move focus and activate (`activateOnFocus`), Home/End jump, focus loops. Roving tabindex; `role="tablist"/"tab"/"tabpanel"`, `aria-selected` managed by Base UI. Panels are not focusable by default.

## Tokens consumed
accent.{base,focus-ring}, text.{primary,secondary,tertiary}, border.hairline, surface.{solid,faint}, space.{1,2,3,4,5}, font.{size.meta,size.body,size.micro,weight.medium,family.machine,tracking-body}, radius.{none,pill}, motion.{duration-fast,easing-standard}.

## Do / Don't
- Do: keep labels short, parallel nouns ("Runs", "History"), counts via `count`, not baked into the label string.
- Do: use `underline` for page/section level, `pill` for dense toolbars and embedded switchers.
- Don't: use tabs as a stepper/wizard (order-dependent flows need a different pattern).
- Don't: mix variants in one view region.

## Open questions
- Vertical orientation is supported by Base UI but intentionally not exposed until a real screen needs it.
