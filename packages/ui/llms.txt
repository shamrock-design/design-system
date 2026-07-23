# Shamrock for AI coding agents

You are building UI for an app in the Shamrock ecosystem. **All UI must be built from `@shamrock-design/ui`, `@shamrock-design/tokens`, and `@shamrock-design/icons`.** Do not hand-roll styled divs, do not use Tailwind classes, do not invent colors.

## Setup (once per app)

```tsx
import "@shamrock-design/tokens/css/core.css";
import "@shamrock-design/tokens/css/theme-clover.css"; // the app's brand theme
import "@shamrock-design/ui/styles.css";
// <html data-theme="clover">  (or "violet", or the client's theme)
```

## Hard rules

1. **Never write a hex color.** Use `var(--sh-color-*)` / `var(--sh-surface-*)` semantic tokens.
2. **Never set border-radius.** Shamrock is sharp-cornered. (Exceptions already inside components: dots, pills.)
3. **Never set font-size/font-family directly.** Use `<Text variant="...">`: `h1 h2 h3 lead body meta caption micro kpi machine label-caps`.
4. **Never hardcode spacing px.** Use `<Stack gap={N}>` / `<Inline gap={N}>` / `<Grid gap={N}>` (N indexes the space scale 0–12) or `var(--sh-space-N)`.
5. **Status** comes from the canonical enum: `neutral | info | success | warning | critical | pending | running`. Normalize legacy strings with `mapLegacyStatus()`. Render status as dot + text label, never color alone.
6. **Machine values** (timestamps, IDs, durations, counts) → `<Text variant="machine">`.
7. **No naked numbers** — show metrics against a baseline ("ETA 14:20, +35 min vs plan").
8. **Calm by default** — nominal states are gray/muted; saturated color only for exceptions needing action.
9. Icons: `<Icon name="..." size={16} />` from `@shamrock-design/icons` (names in `ICON_NAMES`). Never inline foreign SVG icon sets.
10. Assets (illustrations/lottie): import from `@shamrock-design/assets/<category>/<name>` — check its `manifest.json` for what exists. Never copy asset files into the app.

## Page skeleton

```tsx
import { Aurora, Stack, Inline, Grid, Text } from "@shamrock-design/ui";
import { Icon } from "@shamrock-design/icons";

export function Page() {
  return (
    <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
      <Aurora /> {/* once per app, behind everything */}
      <Stack gap={8}>
        <Stack gap={1}>
          <Text variant="label-caps" tone="subtle">Weekly run</Text>
          <Text variant="h1">Planning Observability</Text>
          <Text variant="body" tone="secondary">All tracked runs within a time window.</Text>
        </Stack>
        {/* content */}
      </Stack>
    </div>
  );
}
```

Card surface: `background: var(--sh-surface-card); border: 1px solid var(--sh-color-border-hairline); backdrop-filter: blur(12px);` — optionally `border-top: 3px solid var(--sh-color-accent-base)`.

## If a component you need doesn't exist yet

Compose it from the primitives + semantic tokens following the rules above, and flag it as a candidate for promotion into `@shamrock-design/ui`. Do not import another component library to fill the gap.
