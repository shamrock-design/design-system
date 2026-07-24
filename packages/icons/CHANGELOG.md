# @shamrock-design/icons

## 0.2.0

### Patch Changes

- 9b8e1c0: Phase 3: shell, patterns, and charts.

  - **tokens**: validated data-viz palette (`--sh-color-chart-*` — 5 categorical hues, sequential ramp, diverging pair, grid/axis), passing the dataviz six-checks in light and dark.
  - **ui**: AppShell (sidebar + topbar + context bar chassis), Breadcrumbs, GlobalAlertPill, Drawer, Card, Avatar, ProgressBar, FolderTree, FileDropzone, CodeConsole, and DateTimeRangePicker (the shared range control with a dual-month calendar). SPECs, stories, and tests throughout.
  - **charts**: new `@shamrock-design/charts` package — LineChart, StackedBarChart, DonutChart, Sparkline, MiniDonut on visx, fed by the chart tokens (fixed categorical order, one y-axis, hover layer by default).
  - **icons**: calendar, chevron-left, filter, upload, trash, refresh.

- 1b00a3c: Phase 4: flagship patterns.

  - **CascadeTimeline** — the signature "F1" dependency-sorted waterfall on a sticky time axis with an in-place accordion ego-graph (needs·N → step → unlocks·N), NOW line, kin ledges, and cycle-safe topo sort. Ported from the benchmark onto Shamrock tokens.
  - **Timeline** — Gantt swimlane pattern: sticky time axis, time-anchored status bars, milestones, gate badges, ghost rows, NOW line, horizontal scroll.
  - **AI chat kit** — AgentOrb, ChatMessage, ThinkingBlock/ThinkingStep, SuggestionChips, RunRefChip, ChatComposer, and CompanionPanel (the assistant surface, composable inside AppShell or a Drawer).
  - **icons**: spark, send, history.
