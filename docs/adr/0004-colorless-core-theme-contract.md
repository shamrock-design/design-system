# ADR-0004 — Colorless core; themes = accent + fonts only

**Date:** 2026-07-22 · **Status:** accepted

No privileged brand color: core semantic accent maps to near-neutral ink (a monochrome UI ships by default). Brand palettes (clover green #76B900 — a client accent; violet #6C5CE7 — internal) are themes overriding only `color.accent.*` and `font.*`, enforced by `check-theme-contract.mjs` in CI. Radius/glass/shadows/spacing/motion are fixed canon. Consequences accepted: (a) the benchmark's sage-green hairlines and green-tinted shadows were neutralized in core so a violet theme doesn't sit on green-tinted neutrals; (b) production purple apps' rounded corners are NOT expressible — they migrate to sharp.
