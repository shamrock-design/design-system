# ADR-0008 — Asset CDN mirror deferred

**Date:** 2026-07-24 · **Status:** accepted (revisit after ≥2 real bump cycles)

`@shamrock-design/assets` ships as a versioned npm package; consumers update via dependency bump (Renovate). A CDN mirror (stable `assets.<domain>/@shamrock-design/assets/<version>/…` URLs for live/no-rebuild consumption) is **not** built yet. Rationale: the package flow must prove out across at least two real consuming-app update cycles before adding CDN infra + cache-invalidation surface. When added, it will be a publish-time sync step, not a new source of truth — the package stays authoritative.
