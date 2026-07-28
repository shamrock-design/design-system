# Building this app on the Shamrock Design System

You are an AI coding agent working in an app that consumes the **Shamrock Design System**.
Build **only** from `@shamrock-design/ui`, `@shamrock-design/tokens`, `@shamrock-design/icons`, and `@shamrock-design/charts`. Do **not** hand-roll styled `<div>`s, do not use Tailwind or any CSS framework, do not invent colors, radii, or spacing.

## The setup is already done
`src/main.tsx` imports the design-system styles in the required order and `index.html` sets `data-theme`. Don't re-wire it. Change the theme by editing `data-theme` (`clover` / `violet` / `neutral`) and the matching `theme-*.css` import.

## Hard rules — the canon (enforced by ESLint + Stylelint; run `pnpm lint`)
1. **Never write a hex color.** This is a colorless system — use `var(--sh-color-*)` / `var(--sh-surface-*)` semantic tokens. _(ESLint errors on hex.)_
2. **Never set `border-radius`.** Shamrock is sharp-cornered; radius is 0. Dots and count pills already round inside components. _(Stylelint errors on non-token radius.)_
3. **Never hardcode spacing px.** Use `<Stack gap={n}>` / `<Inline gap={n}>` / `<Grid gap={n}>` (n = the 0–12 space scale) or `var(--sh-space-n)`. _(Stylelint errors; ESLint warns on px in inline styles.)_
4. **Never set font-size / font-family directly.** Use `<Text variant="…">`: `h1 h2 h3 lead body meta caption micro kpi machine label-caps`. Machine values (IDs, timestamps, durations, counts) → `variant="machine"`.
5. **Status is the enum, never color alone.** `neutral | info | success | warning | critical | pending | running` via `<StatusBadge status=… label=… />`. Normalize legacy strings with `mapLegacyStatus()`. Always render dot **+** text label.
6. **Color is earned.** Nominal states are calm/gray; saturated color is reserved for the exception that needs a person. A screen that's colorful when everything is fine is wrong.
7. **No naked numbers.** Every metric renders against a baseline ("+35 min vs plan"). `<KPITile>` enforces this via its `delta` prop.
8. **No edge-line motif.** Do **not** add a colored top/left accent bar or border stripe to cards, toasts, or nav items — that look was deliberately removed. Signal with a `StatusBadge`, a square status dot, or `<Card accentBar="<status>">` (a subtle corner bloom) — never a hard 3px stripe.
9. **Icons:** `<Icon name="…" size={16} />` from `@shamrock-design/icons`. Never paste a foreign SVG icon set.
10. **Glass surfaces** (`--sh-surface-card/panel/overlay`) sit over one `<Aurora />` backdrop — render it once, behind everything. Prefer hairline borders (`--sh-color-border-hairline`) over shadows.

## Components available (browse Storybook for props + live examples)
- **Primitives:** `Stack`, `Inline`, `Grid`, `Text`, `Aurora`, `VisuallyHidden`
- **Core:** `Button`, `StatusBadge`, `Tag`, `TextInput`, `Checkbox`, `SegmentedControl`, `Tabs`, `Tooltip`, `Select`, `Modal` / `ConfirmModal` / `WizardModal`, `Toast` (`ToastProvider` / `useToast`), `KPITile`, `KeyValueList`, `EmptyState`, `DataTable` / `Pagination`
- **Shell & surfaces:** `AppShell`, `Card`, `Drawer`, `Avatar`, `Breadcrumbs`, `GlobalAlertPill`, `ProgressBar`, `CodeConsole`, `FolderTree`, `FileDropzone`, `DateTimeRangePicker`
- **Patterns:** `CascadeTimeline`, `Timeline`, **ChatKit** (`CompanionPanel`, `ChatMessage`, `ThinkingBlock`, `SuggestionChips`, `RunRefChip`, `ChatComposer`, `AgentOrb`)
- **Charts** (`@shamrock-design/charts`): `LineChart`, `StackedBarChart`, `DonutChart`, `Sparkline`, `MiniDonut`

## Page skeleton
```tsx
import { Aurora, Stack, Text } from "@shamrock-design/ui";

export function Page() {
  return (
    <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
      <Aurora /> {/* once per app, behind everything */}
      <Stack gap={8}>
        <Stack gap={1}>
          <Text variant="label-caps" tone="subtle">Section</Text>
          <Text variant="h1">Title</Text>
          <Text variant="body" tone="secondary">One line of context.</Text>
        </Stack>
        {/* content */}
      </Stack>
    </div>
  );
}
```

Before you finish a change, run **`pnpm lint`** — it checks your work against the canon.
