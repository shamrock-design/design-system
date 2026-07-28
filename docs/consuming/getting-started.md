# Getting started (consuming apps)

The fastest way to build on the Shamrock Design System is to scaffold a new app — one command wires up auth, your theme, fonts, components, lint guardrails, and AI-agent rules.

## Quickstart — a new app in one command

```bash
npm create @shamrockai/app my-app
# or:  pnpm create @shamrockai/app my-app --theme clover
```

Then:

```bash
cd my-app
pnpm install
pnpm dev            # → http://localhost:5173
```

That's it — a running, on-brand starter page. The scaffolder:

- **Handles auth for you.** It uses the GitHub CLI to fetch a token and writes a git-ignored `.npmrc`, so you never create a Personal Access Token by hand. (See [Authentication](#authentication) if you're not set up with `gh` yet.)
- Wires the four `@shamrock-design/*` packages, your brand theme (`clover` / `violet` / `neutral`), and the fonts.
- Installs **lint guardrails** that enforce the canon (`pnpm lint` fails on hex colors, magic px, stray radius).
- Drops **`CLAUDE.md` / `AGENTS.md` / `.cursorrules`** so your AI coding agent builds on-system from the first prompt.

## Authentication

The design-system packages are private (on GitHub Packages), so installing them needs a token. You don't manage it directly — the GitHub CLI does.

**A "token" is just a password-like string that proves you're allowed to download the private packages.** The one-time setup:

1. Install the GitHub CLI: `brew install gh` (macOS) or see [cli.github.com](https://cli.github.com).
2. Log in once: `gh auth login` — follow the browser prompt.

That's the whole setup. The scaffolder (and any teammate cloning a Shamrock app) then gets a token automatically. If you ever need to do it by hand, create a token with the `read:packages` scope at **GitHub → Settings → Developer settings → Personal access tokens**, and put it in `.npmrc`:

```
@shamrock-design:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

> `.npmrc` holds your token — it's git-ignored by the scaffold. Never commit it.

## Adding the system to an existing app

Already have a React app? Add the system manually.

**1. Auth** — set up `.npmrc` as above (`gh auth login`, or a `read:packages` token).

**2. Install:**

```bash
pnpm add @shamrock-design/tokens @shamrock-design/ui @shamrock-design/icons @shamrock-design/charts
pnpm add -D @shamrock-design/eslint-config @shamrock-design/stylelint-config
```

**3. Import the styles once at your entry, in this order:**

```tsx
import "@shamrock-design/tokens/css/core.css";        // colorless core (required)
import "@shamrock-design/tokens/css/theme-clover.css"; // a theme (accent + fonts)
import "@shamrock-design/ui/styles.css";              // component styles
import "@shamrock-design/charts/styles.css";          // ONLY if you use charts
```

Set the theme on the root element and load the fonts:

```html
<html data-theme="clover">
  <!-- themes: "neutral" (colorless, dark-ink accent) | "clover" (green) | "violet" -->
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@400..700&display=swap"
    rel="stylesheet"
  />
</html>
```

**4. Turn on the guardrails** — `eslint.config.js` → `import shamrock from "@shamrock-design/eslint-config"; export default shamrock;` and `.stylelintrc.json` → `{ "extends": "@shamrock-design/stylelint-config" }`.

**5. Give your AI agent the rules** — copy `CLAUDE.md` / `AGENTS.md` from a scaffolded app (or from `@shamrock-design/ui`'s bundled `AGENTS.md`) into your repo root.

Then use components:

```tsx
import { Card, StatusBadge, Text } from "@shamrock-design/ui";

<Card variant="glass" padding={5}>
  <Card.Header
    title={<Text variant="h3" as="span">Weekly run</Text>}
    trailing={<StatusBadge status="running" label="Running" size="sm" />}
  />
  <Text variant="body" tone="secondary">31 of 34 steps nominal.</Text>
</Card>;
```

Browse every component + prop in Storybook (the workshop) and copy from its stories.

## The canon (non-negotiable — and now enforced)

Building against the house style, not around it, is the whole point. The guardrails from step 4 make most of this automatic:

- **Tokens only.** No hex, no magic px. Color via `--sh-*` semantic tokens; spacing via `Stack`/`Inline`/`Grid` gaps; type via `<Text>`. _(ESLint + Stylelint enforce this.)_
- **Sharp corners.** Radius is 0 except status dots and count pills. _(Stylelint enforces this.)_
- **Status is the enum.** `neutral | info | success | warning | critical | pending | running` — render as dot + label, never color alone. Normalize legacy strings with `mapLegacyStatus()`.
- **Color is earned.** Nominal states stay calm/gray; saturated color signals an exception. A screen that's colorful when everything is fine is wrong.
- **No naked numbers.** Metrics render against a baseline ("+35 min vs plan"); machine values (IDs, timestamps, durations) use `<Text variant="machine">`.
- **No edge-line stripes.** Signal with badges, dots, or a `Card`'s subtle `accentBar` corner bloom — never a hard colored border stripe.

See [for-ai-agents.md](for-ai-agents.md) for the condensed rule list and [theming.md](theming.md) for building/overriding themes.

## Plain-HTML app (no React)

Link the token CSS directly — every `--sh-*` variable is available; style your markup with them:

```html
<link rel="stylesheet" href="node_modules/@shamrock-design/tokens/dist/css/core.css" />
<link rel="stylesheet" href="node_modules/@shamrock-design/tokens/dist/css/theme-clover.css" />
<html data-theme="clover"></html>
```

Raw icons: `@shamrock-design/icons/svg/<name>.svg`. Assets: `@shamrock-design/assets/<category>/<file>`.

## Staying up to date

Updates arrive as dependency bumps (semver + changelogs). Recommended Renovate rule:

```json
{ "packageRules": [{ "matchPackagePrefixes": ["@shamrock-design/"], "groupName": "shamrock design system", "schedule": ["before 9am on monday"] }] }
```
