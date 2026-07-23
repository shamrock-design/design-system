# Shamrock Design System

The single source of truth for UI across the Shamrock ecosystem — internal products and white-labeled client solutions.

- **`@shamrock-design/tokens`** — colorless semantic core (`--sh-*` CSS vars) + brand themes (`clover`, `violet`, yours next). Framework-agnostic: works in plain HTML.
- **`@shamrock-design/ui`** — React components and layout/text primitives.
- **`@shamrock-design/icons`** — the line-icon set as React components + raw SVG.
- **`@shamrock-design/assets`** — illustrations, Lottie, Rive, gifs; versioned, manifest-indexed.

## Quick start (consuming app)

```bash
pnpm add @shamrock-design/tokens @shamrock-design/ui @shamrock-design/icons
```

```tsx
import "@shamrock-design/tokens/css/core.css";
import "@shamrock-design/tokens/css/theme-clover.css"; // or theme-violet.css, or your brand
import "@shamrock-design/ui/styles.css";
// <html data-theme="clover">
```

See `docs/consuming/getting-started.md`. **If you're an AI coding agent:** read `docs/consuming/for-ai-agents.md` (also shipped as `llms.txt` inside `@shamrock-design/ui`).

## Develop

```bash
pnpm install
pnpm turbo build        # everything
pnpm storybook          # the workshop
pnpm turbo test typecheck
```

Contributing: `CONTRIBUTING.md`. Decisions: `docs/adr/`. Design guidelines: `docs/guidelines/`.
