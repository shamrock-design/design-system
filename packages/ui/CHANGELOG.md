# @shamrock-design/ui

## 0.2.2

### Patch Changes

- 163d3a5: Correct the bundled AI-agent guidance (`AGENTS.md` / `llms.txt`): the card-surface note no longer suggests an "optional `border-top: 3px solid accent`" edge-line — that motif was removed from the system. It now points agents at `StatusBadge`, a square status dot, or the `<Card accentBar>` corner bloom for signaling.

## 0.2.1

### Patch Changes

- 45c37eb: Fix the low-contrast selected state on `SegmentedControl` and the `Tabs` pill variant. The selected item filled with a near-white surface, which was nearly invisible on light backgrounds. It now fills with the theme accent — green/violet under those themes, dark ink (`#1A1B18`) under the neutral theme — with on-accent text, matching `Button` primary.

## 0.2.0

### Minor Changes

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

### Patch Changes

- a6083b1: Retire the "edge line" motif across components — the hard colored accent/status bars read as bootstrappy and made color feel decorative. Replaced with quieter, meaning-first treatments:

  - **Card** / **KPITile**: the 3px top accent/status bar → a subtle accent/status **corner bloom** (a soft top-left tint, echoing the Aurora on glass).
  - **Toast**: the 3px left status bar → gone; status now rides a **square** dot beside the title (sharp, per the radius-0 canon).
  - **SegmentedControl** (selected segment) and **AppShell** (active nav item): the boxed border / 2px left accent bar → a lifted solid fill; the fill + accent text carry the selection.

  No API changes — `Card`'s `accentBar` prop and `KPITile`'s `accentBar` behave the same, only the rendering changed.

- Updated dependencies [9b8e1c0]
  - @shamrock-design/tokens@0.2.0

## 0.1.0

### Minor Changes

- 3496d93: Phase 2: the first fifteen components. Button, StatusBadge, Tag, TextInput, Checkbox, SegmentedControl, Tabs, Tooltip, Select, Modal (+ConfirmModal, +WizardModal), Toast (ToastProvider + useToast), DataTable (+Pagination), KPITile, KeyValueList, EmptyState — each with SPEC.md, colocated stories (Default + AllVariants), and tests (79 passing). Interactive components build on @base-ui/react v1.6; statics are hand-rolled. All styling via --sh-\* semantic tokens, sharp corners, canonical 7-value status enum throughout.
