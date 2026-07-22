# ADR-0003 — Token pipeline: DTCG JSON, custom compiler

**Date:** 2026-07-22 · **Status:** accepted

Sources are DTCG-format JSON (the format Figma Variables tooling speaks — required for Phase C figma-sync). Compiled by our own ~150-line `scripts/build.mjs` instead of Style Dictionary: our `$value`s are CSS-ready strings and SD's type transforms added risk without benefit. The source format is SD-compatible, so swapping SD in later is a build-script change, not a token migration. Prefix: `--sh-`. Core emits no brand primitives (colorless).
