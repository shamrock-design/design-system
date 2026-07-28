# @shamrockai/create-app

Scaffold a new app on the **Shamrock Design System** in one command — auth, theme, fonts, components, lint guardrails, and AI-agent rules, all wired.

```bash
npm create @shamrockai/app my-app
# or
pnpm create @shamrockai/app my-app --theme clover
```

Then:

```bash
cd my-app
pnpm install
pnpm dev
```

## What you get

- **Auth, handled.** Uses the GitHub CLI (`gh auth token`) to write a git-ignored `.npmrc` for GitHub Packages — no Personal Access Token to create by hand. (Not logged in? Run `gh auth login` first, or paste a `read:packages` token into `.npmrc`.)
- **A wired Vite + React + TypeScript app** — colorless core, your brand theme, Instrument Sans + Inter fonts, and `@shamrock-design/{tokens,ui,icons,charts}` imported in the right order.
- **Guardrails in the box** — `@shamrock-design/eslint-config` + `@shamrock-design/stylelint-config` fail on hex colors, magic px, and stray radius. `pnpm lint` checks any change against the canon.
- **AI rules** — `CLAUDE.md`, `AGENTS.md`, and `.cursorrules` so Claude Code / Cursor / Copilot build on-system from day one.
- **A real starter page** demonstrating the canon (earned color, no naked numbers, sharp corners).

## Options

| Flag | Default | Notes |
|---|---|---|
| `[dir]` | prompt → `my-shamrock-app` | Target directory / app name |
| `--theme <name>` | `clover` | `clover` \| `violet` \| `neutral` |
| `--install` | off | Run `pnpm install` after scaffolding |
| `-h`, `--help` | — | Usage |

## Publishing this tool

`@shamrockai/create-app` is published to the **public** npm registry (it's just scaffolding glue — no design-system code) so `npm create` works before a token exists. The four `@shamrock-design/*` packages it installs remain private on GitHub Packages.

```bash
cd tooling/create-app
npm login                       # your npmjs.org account (org: shamrockai)
npm publish --dry-run           # optional: preview the file list
npm publish                     # publishConfig.access is already "public"
```
