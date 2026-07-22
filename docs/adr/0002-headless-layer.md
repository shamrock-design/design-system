# ADR-0002 — Behavior layer: Base UI

**Date:** 2026-07-22 · **Status:** accepted

Interactive components (Dialog, Popover, Select, Tooltip, Tabs, Checkbox, Menu, Toast) build on `@base-ui-components/react` — unstyled, a11y-complete, maintained by the Radix authors. Fallback per-primitive: Radix. Hand-roll only trivial statics (Button, Badge, KPITile…) and bespoke patterns (Cascade Timeline, AI panel). Fully hand-rolling focus traps/typeahead/portals is where small design systems die.
