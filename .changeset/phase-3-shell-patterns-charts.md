---
"@shamrock-design/tokens": minor
"@shamrock-design/ui": minor
"@shamrock-design/charts": minor
"@shamrock-design/icons": patch
---

Phase 3: shell, patterns, and charts.

- **tokens**: validated data-viz palette (`--sh-color-chart-*` — 5 categorical hues, sequential ramp, diverging pair, grid/axis), passing the dataviz six-checks in light and dark.
- **ui**: AppShell (sidebar + topbar + context bar chassis), Breadcrumbs, GlobalAlertPill, Drawer, Card, Avatar, ProgressBar, FolderTree, FileDropzone, CodeConsole, and DateTimeRangePicker (the shared range control with a dual-month calendar). SPECs, stories, and tests throughout.
- **charts**: new `@shamrock-design/charts` package — LineChart, StackedBarChart, DonutChart, Sparkline, MiniDonut on visx, fed by the chart tokens (fixed categorical order, one y-axis, hover layer by default).
- **icons**: calendar, chevron-left, filter, upload, trash, refresh.
