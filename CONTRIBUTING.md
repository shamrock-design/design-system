# Contributing

## Setup

- Node ≥ 20, pnpm 9 (`corepack enable pnpm`).
- `pnpm install`, then `pnpm turbo build`.
- To install published `@shamrock-design/*` packages elsewhere you need a GitHub PAT with `read:packages` in `~/.npmrc`:
  ```
  //npm.pkg.github.com/:_authToken=YOUR_TOKEN
  ```

## Branch & release flow

1. Branch from `main`.
2. Make the change. Any change under `packages/*` requires `pnpm changeset` (pick bump level, write a human changelog line).
3. PR → CI must pass (build, tests, typecheck, theme contract, icon/asset lint, Storybook build).
4. Merge → the Changesets action opens/updates a release PR → merging that publishes to GitHub Packages. Storybook deploys via Vercel's Git integration on every `main` push (project root: `apps/workshop`, config in `apps/workshop/vercel.json`).

`tokens`, `ui`, `icons` are version-linked (majors move together). `assets` versions independently.

## Component Definition of Done

1. `SPEC.md` in the component folder (from `docs/component-spec-template.md`): anatomy, props, states matrix, keyboard map, do/don't.
2. Implementation: CSS Modules + `--sh-*` semantic vars only. No hex, no magic px, no border-radius (canon: sharp).
3. Stories: `Default` + `AllVariants` matrix. Status-bearing components must demo all 7 canonical statuses.
4. a11y panel clean in Storybook; keyboard interaction works.
5. Unit tests where there's logic (parsing, state machines — not snapshots of markup).
6. Changeset.

## Designers: contributing assets

Drop files into `packages/assets/<category>/` via PR — naming is `category-subject-variant.ext` kebab-case. CI validates naming/extensions and regenerates `manifest.json`. Export presets: `docs/guidelines/asset-contribution.md`. Icons go to `packages/icons/svg/` (24×24, currentColor, 1.5px stroke — the build rejects hardcoded colors).
