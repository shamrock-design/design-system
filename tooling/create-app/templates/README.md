# {{APP_NAME}}

Built on the **Shamrock Design System** ({{THEME}} theme).

## Develop

```bash
pnpm install
pnpm dev
```

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Start Vite on http://localhost:5173 |
| `pnpm build` | Typecheck + production build |
| `pnpm lint` | Enforce the canon (ESLint + Stylelint) |
| `pnpm typecheck` | TypeScript, no emit |

## Working in this repo

- The design system is already wired in [`src/main.tsx`](src/main.tsx) and [`index.html`](index.html). Build UI from `@shamrock-design/ui`, `@shamrock-design/tokens`, `@shamrock-design/icons`, and `@shamrock-design/charts` — never hand-rolled styles.
- The house rules (no hex, no magic px, sharp corners, earned color, status enum) are in **[CLAUDE.md](CLAUDE.md)** / **[AGENTS.md](AGENTS.md)** / **.cursorrules** so your AI coding agent stays on-system, and are enforced by `pnpm lint`.
- Change the theme by editing `data-theme` in `index.html` and the `theme-*.css` import in `src/main.tsx` (`clover` / `violet` / `neutral`).
- Browse every component with live props in Storybook (the design-system workshop).

## Auth note

`.npmrc` holds your GitHub Packages token and is **git-ignored** — never commit it. If a teammate clones this repo, they run `gh auth login` (GitHub CLI) and re-generate their own `.npmrc`, or paste a token with `read:packages` scope.
