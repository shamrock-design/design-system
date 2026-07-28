# @shamrock-design/eslint-config

Shareable **flat** ESLint config that makes the Shamrock canon self-enforcing in `.ts`/`.tsx`, on top of a React + TypeScript baseline.

## Use

```js
// eslint.config.js
import shamrock from "@shamrock-design/eslint-config";

export default shamrock;
```

To add your own tweaks, spread it:

```js
import shamrock from "@shamrock-design/eslint-config";

export default [
  ...shamrock,
  { rules: { "shamrock/no-raw-px": "off" } }, // per-project opt-out
];
```

## What it enforces

| Rule | Level | Catches |
|---|---|---|
| `shamrock/no-hex-colors` | **error** | Any hardcoded hex (`#fff`, `#1a1b18`) in a string/template literal. The system is colorless — use a `--sh-color-*` / `--sh-surface-*` token via `var(--sh-…)`. |
| `shamrock/no-raw-px` | warn | Magic pixel values in **inline styles** (`style={{ padding: "12px" }}`). Use a `--sh-space-*` token or a `Stack`/`Inline`/`Grid` gap. (Component length props like `minChildWidth="240px"` are fine; CSS files are Stylelint's job.) |

Plus `@eslint/js` recommended, `typescript-eslint` recommended, and `react-hooks` rules.

CSS/CSS-Module files are guarded separately by [`@shamrock-design/stylelint-config`](../stylelint).

Both rules are nudges, not cages — silence a genuinely intentional case inline:

```tsx
// eslint-disable-next-line shamrock/no-hex-colors -- third-party embed needs a literal
```
