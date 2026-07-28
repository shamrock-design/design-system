# @shamrock-design/stylelint-config

Shareable Stylelint config that makes the Shamrock canon self-enforcing in CSS / CSS Modules — where most of a Shamrock app's styling lives.

## Use

```json
// .stylelintrc.json
{
  "extends": "@shamrock-design/stylelint-config"
}
```

Lint script:

```json
{ "scripts": { "lint:css": "stylelint \"src/**/*.css\"" } }
```

## What it enforces

| Rule | Catches |
|---|---|
| `color-no-hex` | Any hex color. Use a `--sh-color-*` / `--sh-surface-*` token. |
| `scale-unlimited/declaration-strict-value` | Raw values for `color`, `background`, `fill`/`stroke`, `border-color`, `margin`, `padding`, `gap`. They must be `var(--sh-…)` tokens (keywords like `transparent`/`inherit`/`0` and gradients are allowed). |
| `border-radius` allow-list | Radius must be `0`, a `--sh-radius-*` token, or `50%`. Shamrock is sharp-cornered; only dots and count pills round. |

Built on `stylelint-config-standard`, with a few standard rules relaxed so CSS-Module class names and token custom-properties don't fight the linter.

`.ts`/`.tsx` files (inline styles, string literals) are guarded separately by [`@shamrock-design/eslint-config`](../eslint).
