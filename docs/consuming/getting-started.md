# Getting started (consuming apps)

The Shamrock Design System ships as private npm packages on **GitHub Packages** under the `@shamrock-design` scope (org: `shamrock-design`). Current release: **0.2.x**.

## 1. Authenticate to GitHub Packages

Create a GitHub **Personal Access Token** with the `read:packages` scope, then add to `~/.npmrc` (or the project `.npmrc`):

```
//npm.pkg.github.com/:_authToken=YOUR_PAT_WITH_read:packages
@shamrock-design:registry=https://npm.pkg.github.com
```

> The npm scope **must** equal the GitHub org name — it's `@shamrock-design`, not `@shamrock`.

## 2. Install

```bash
pnpm add @shamrock-design/tokens @shamrock-design/ui @shamrock-design/icons @shamrock-design/charts
```

(Drop `charts` if you don't render data-viz; drop `icons` if you don't use the `<Icon>` set directly.)

## 3. Wire it up (React)

Import the stylesheets **once** at your app entry, in this order — tokens first, then a theme, then each package's styles:

```tsx
import "@shamrock-design/tokens/css/core.css";       // colorless core (required)
import "@shamrock-design/tokens/css/theme-clover.css"; // a theme (accent + fonts)
import "@shamrock-design/ui/styles.css";             // component styles
import "@shamrock-design/charts/styles.css";         // ONLY if you use charts
```

Set the active theme on the root element, and load the fonts:

```html
<html data-theme="clover">
  <!-- themes: "neutral" (colorless, dark-ink accent) | "clover" (green) | "violet" -->
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@400..700&display=swap" rel="stylesheet" />
</html>
```

Then use components:

```tsx
import { AppShell, Card, StatusBadge, Button, Text, Stack } from "@shamrock-design/ui";
import { LineChart } from "@shamrock-design/charts";
import { Icon } from "@shamrock-design/icons";

<Card>
  <Card.Header title="Weekly run" trailing={<StatusBadge status="running" size="sm" />} />
  <Text tone="secondary">31 of 34 steps nominal.</Text>
</Card>;
```

Browse every component + prop in Storybook (the workshop) and copy from its stories.

## 4. Follow the canon (non-negotiable)

The system enforces a house style — building against it, not around it, is the whole point:

- **Tokens only.** No hex colors, no magic px. Color via `--sh-*` semantic tokens; spacing via `Stack`/`Inline`/`Grid` gaps; type via `<Text>`.
- **Sharp corners.** Radius is 0 everywhere except status dots and count pills.
- **Status is the enum.** `neutral | info | success | warning | critical | pending | running` — render as dot + label, never color alone. Normalize legacy strings (`"Finished"`, `"Aborted"`…) with `mapLegacyStatus()`.
- **Color is earned.** Nominal states stay calm/grey; saturated color signals an exception. A screen that's colorful when everything is fine is wrong.
- **No naked numbers.** Metrics render against a baseline ("+35 min vs plan"); machine values (IDs, timestamps, durations) use `<Text variant="machine">`.

See [for-ai-agents.md](for-ai-agents.md) for the condensed rule list and [theming.md](theming.md) for building/overriding themes.

## 5. Plain-HTML app (no React)

Link the token CSS directly — every `--sh-*` variable is available; style your markup with them:

```html
<link rel="stylesheet" href="node_modules/@shamrock-design/tokens/dist/css/core.css" />
<link rel="stylesheet" href="node_modules/@shamrock-design/tokens/dist/css/theme-clover.css" />
<html data-theme="clover"></html>
```

Raw icons: `@shamrock-design/icons/svg/<name>.svg`. Assets: `@shamrock-design/assets/<category>/<file>`.

## 6. Staying up to date

Updates arrive as dependency bumps (semver + changelogs). Recommended Renovate rule:

```json
{ "packageRules": [{ "matchPackagePrefixes": ["@shamrock-design/"], "groupName": "shamrock design system", "schedule": ["before 9am on monday"] }] }
```
