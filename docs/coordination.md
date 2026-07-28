# Coordination board — read this before you touch anything

> Single source of truth for **who is doing what** across every agent/session working in this repo.
> The Phase 3/4 collisions (two agents building the same components in `components/` vs `patterns/`)
> happened because there was no shared board. This is that board.

## Protocol (all agents)

1. **Read this file first.** Before editing any file, scan the **Active claims** table.
2. **Claim before you build.** Add a row to Active claims with your scope (dirs/files), status `WIP`, and the time. Keep claims narrow.
3. **Respect claims.** Never edit a path inside another agent's `WIP` claim. If you need it, coordinate through the Orchestrator (below), don't just start.
4. **One orchestrator.** Parallel fan-out is decomposed and assigned by whoever holds the **Orchestrator** claim, so scopes never overlap. If no one holds it and parallel work is needed, take it.
5. **Update on done.** Flip your row to `DONE` (or delete it) and add a line to the **Done log** with the outcome.
6. **Barrels are hot.** `packages/ui/src/index.ts`, `packages/charts/src/index.ts`, `apps/smoke/src/App.tsx` are shared seams — announce a claim before editing, and re-read them right before you write (they change under you).

## Roles

| Role | Held by | Notes |
|---|---|---|
| Orchestrator | **Claude Code — main session** (this one) | decomposes work, assigns non-overlapping scopes, owns this board |

## Active claims

| Agent / session | Scope (dirs/files) | Status | Updated |
|---|---|---|---|
| _(none active)_ | — | — | — |

> spnr flagship rebuild landed via file-disjoint scopes (A→ProcessesView, B→BuilderView, orchestrator→data/shell/App). No collisions. See Done log.

## Phase status

| Phase | What | State |
|---|---|---|
| 0 | Scaffold | ✅ committed |
| 1 | Tokens + primitives | ✅ committed |
| 2 | First 15 components | ✅ committed |
| 3 | Shell / surfaces / patterns / charts(visx) / DateTimeRangePicker | ✅ committed (`9b8e1c0`) + validated green (185 ui tests, 29 charts tests, turbo build 7/7) |
| 4 | Flagship patterns: Timeline, CascadeTimeline, ChatKit (AgentOrb, ChatMessage, ThinkingBlock, SuggestionChips, RunRefChip, ChatComposer, CompanionPanel) | ✅ built + green (236 ui tests, typecheck clean, `phase-4-flagship-patterns.md` changeset, `apps/smoke/Flagship.tsx` demo) — **uncommitted** |
| 5 (goal) | **Reproduce spnr with the design system** — the benchmark rebuild / first migration | ⏳ next |

## Goal: reproduce spnr with `@shamrock-design/*`

spnr is an agentic-workflow platform. **Scope (confirmed): flagship screens only** — a proof that DS-consuming *agents* can build with `@shamrock-design/*` and the result looks equal-or-better than `refs/apps/spnr`. NOT a full port. Flagship = the **Processes landing** + the **Builder/Run detail with the "Ask SPNR" companion** (highest DS density). Pages live under `apps/smoke/src/spnr/`. This is the canon quality gate.

### spnr surface → component map (rebuild work breakdown)

| # | Screen / region | spnr content | Our components |
|---|---|---|---|
| A | App chrome | left nav (Processes / Connectors), top bar | `AppShell` (Sidebar/Topbar/NavItem), `GlobalAlertPill` |
| B | Processes list | grid of process cards: name, desc, status (Live/Paused/Draft), trigger, latest run, in-flight count | `Card`, `StatusBadge`, `Tag`, `KPITile`, `Avatar` |
| C | Connectors list | connector cards: Healthy/Degraded, "Used by N", Reconnect/Connected | `Card`, `StatusBadge`, `Button` |
| D | New workflow modal | name + trigger-first creation | `WizardModal` / `Modal`, `TextInput`, `SegmentedControl` |
| E | Process/run detail | version, run controls, node graph, run errors, pre-check failures | `CascadeTimeline` (run steps), `FolderTree` (nodes), `CodeConsole` (logs), `StatusBadge`, `Toast` |
| F | "Ask SPNR" assistant | in-builder AI chat: messages, thinking, run references, composer | **ChatKit** — `CompanionPanel`, `ChatMessage`, `ThinkingBlock`, `RunRefChip`, `SuggestionChips`, `ChatComposer` |
| G | Run metrics | success/duration trends | `@shamrock-design/charts` — `DonutChart`, `LineChart`, `Sparkline` |

Each row above is an independently-assignable work item (no two touch the same files if the page is split by section component under `apps/smoke/src/spnr/`).

## Done log

- 2026-07-24 — **Developer onboarding / "canon in the box"**: added `create-shamrock-app` (public-npm scaffolder — `gh`-based auth, theme+fonts+deps wired, starter page, AI-rules files), `@shamrock-design/eslint-config` (canon rules: `no-hex-colors` error, `no-raw-px` warn scoped to inline styles) and `@shamrock-design/stylelint-config` (color-no-hex, token-only color/spacing via declaration-strict-value, radius allow-list) under `tooling/`. Fixed the stale edge-line line in `ui/AGENTS.md` + `llms.txt` (+ ui patch changeset). Rewrote `docs/consuming/getting-started.md` scaffolder-first. `create-shamrock-app` added to changeset `ignore` (publishes to public npm, not GitHub Packages). **Verified**: eslint + stylelint fire on sample violations and pass clean files; scaffolder generates a correct app end-to-end (renames, substitution, authed `.npmrc`). Uncommitted pending user go-ahead (push → release publishes new tooling pkgs + ui patch).
- 2026-07-24 — Phase 3 finished & validated: DateTimeRangePicker keyboard focus-sync fix, 11-component barrel wiring, canon audit, charts package verified, 7 superseded flat charts files removed. Full turbo green.
- 2026-07-24 — Phase 4 built (concurrent session): Timeline, CascadeTimeline, ChatKit under `patterns/`; new icons (send/spark/history); Flagship demo page. Green.
- 2026-07-24 — **Design polish + chart fix**: retired the "edge line" motif (Card/KPITile top accent bars, Toast left status bar, SegmentedControl selected-border, AppShell active-nav 2px left bar) → replaced with a subtle accent/status **corner bloom**, a **squared** toast status dot, and a de-boxed (lifted-fill) segmented selection. Fixed the benchmark charts — the smoke app never imported `@shamrock-design/charts/styles.css` (chart CSS lives in a separate stylesheet export), so charts rendered unstyled. `packages/ui/*` changed → **needs a changeset**. Full turbo build/test/typecheck 18/18.
- 2026-07-24 — **spnr flagship rebuild** (orchestrated, first use of this board): `apps/smoke/src/spnr/` — Processes landing (`ProcessesView`) + run builder & "Ask SPNR" companion (`BuilderView`), shared `data.ts`, `Spnr.tsx` router, wired as the default page in `App.tsx`. Built entirely from `@shamrock-design/ui`; two file-disjoint subagents + orchestrator integration, no collisions. smoke typecheck + build green; full turbo test/typecheck 15/15. Result: spnr's brand-green/rounded look normalizes cleanly into the colorless, sharp system — the benchmark quality gate holds on these screens.
