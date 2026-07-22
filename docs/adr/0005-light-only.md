# ADR-0005 — Light-only (dark mode deferred)

**Date:** 2026-07-22 · **Status:** accepted

The design brief mandates a light app for long-dwell operational use. No dark theme is built. Because components touch only semantic roles, dark later = one more override file (surfaces/text/borders), not a component rewrite. Revisit when a product genuinely needs it.
