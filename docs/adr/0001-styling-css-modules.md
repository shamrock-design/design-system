# ADR-0001 — Styling: CSS Modules + custom properties

**Date:** 2026-07-22 · **Status:** accepted

CSS Modules + `--sh-*` semantic custom properties; no Tailwind, no CSS-in-JS. Matches the benchmark apps' grain (plain CSS vars, some CSS Modules), zero runtime cost, output inspectable by designers. Tailwind rejected: arbitrary-value escape hatches are precisely how the pre-Shamrock drift happened. Lint rules forbid raw hex/px inside packages/ui.
