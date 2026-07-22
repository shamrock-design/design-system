# Shamrock Design System

The single source of truth for UI across the Shamrock ecosystem — internal products and white-labeled client solutions.

- **`@shamrock/tokens`** — colorless semantic core (`--sh-*` CSS vars) + brand themes (`clover`, `violet`, yours next). Framework-agnostic: works in plain HTML.
- **`@shamrock/ui`** — React components and layout/text primitives.
- **`@shamrock/icons`** — the line-icon set as React components + raw SVG.
- **`@shamrock/assets`** — illustrations, Lottie, Rive, gifs; versioned, manifest-indexed.

## Quick start (consuming app)

```bash
pnpm add @shamrock/tokens @shamrock/ui @shamrock/icons
```

```tsx
import "@shamrock/tokens/css/core.css";
import "@shamrock/tokens/css/theme-clover.css"; // or theme-violet.css, or your brand
import "@shamrock/ui/styles.css";
// <html data-theme="clover">
```

See `docs/consuming/getting-started.md`. **If you're an AI coding agent:** read `docs/consuming/for-ai-agents.md` (also shipped as `llms.txt` inside `@shamrock/ui`).

## Develop

```bash
pnpm install
pnpm turbo build        # everything
pnpm storybook          # the workshop
pnpm turbo test typecheck
```

Contributing: `CONTRIBUTING.md`. Decisions: `docs/adr/`. Design guidelines: `docs/guidelines/`.
