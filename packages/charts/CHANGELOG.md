# @shamrock-design/charts

## 0.2.0

### Minor Changes

- 9b8e1c0: Phase 3: shell, patterns, and charts.

  - **tokens**: validated data-viz palette (`--sh-color-chart-*` — 5 categorical hues, sequential ramp, diverging pair, grid/axis), passing the dataviz six-checks in light and dark.
  - **ui**: AppShell (sidebar + topbar + context bar chassis), Breadcrumbs, GlobalAlertPill, Drawer, Card, Avatar, ProgressBar, FolderTree, FileDropzone, CodeConsole, and DateTimeRangePicker (the shared range control with a dual-month calendar). SPECs, stories, and tests throughout.
  - **charts**: new `@shamrock-design/charts` package — LineChart, StackedBarChart, DonutChart, Sparkline, MiniDonut on visx, fed by the chart tokens (fixed categorical order, one y-axis, hover layer by default).
  - **icons**: calendar, chevron-left, filter, upload, trash, refresh.

### Patch Changes

- Updated dependencies [9b8e1c0]
  - @shamrock-design/tokens@0.2.0
