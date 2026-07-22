# Getting started (consuming apps)

## Install

Authenticate to GitHub Packages once (`~/.npmrc`):

```
//npm.pkg.github.com/:_authToken=YOUR_PAT_WITH_read:packages
@shamrock:registry=https://npm.pkg.github.com
```

```bash
pnpm add @shamrock/tokens @shamrock/ui @shamrock/icons
```

## React app

```tsx
import "@shamrock/tokens/css/core.css";
import "@shamrock/tokens/css/theme-clover.css";
import "@shamrock/ui/styles.css";
```

Set the theme on the root: `<html data-theme="clover">`. Load fonts (Instrument Sans + Inter):

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@400..700&display=swap" rel="stylesheet" />
```

## Plain-HTML app (no React)

Link the token CSS directly — every `--sh-*` variable is available; style your markup with them:

```html
<link rel="stylesheet" href="node_modules/@shamrock/tokens/dist/css/core.css" />
<link rel="stylesheet" href="node_modules/@shamrock/tokens/dist/css/theme-clover.css" />
<html data-theme="clover">
```

Raw icons: `@shamrock/icons/svg/<name>.svg`. Assets: `@shamrock/assets/<category>/<file>`.

## Staying up to date

Updates arrive as dependency bumps (semver + changelogs). Recommended Renovate rule:

```json
{ "packageRules": [{ "matchPackagePrefixes": ["@shamrock/"], "groupName": "shamrock design system", "schedule": ["before 9am on monday"] }] }
```
