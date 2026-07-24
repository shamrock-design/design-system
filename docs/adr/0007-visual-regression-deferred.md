# ADR-0007 — Visual regression (Chromatic) deferred

**Date:** 2026-07-24 · **Status:** accepted (revisit post-adoption)

Storybook deploys to Vercel per push (preview URLs on PRs), which covers manual visual review. Automated visual regression (Chromatic or equivalent) is **not** wired up yet: component APIs are still moving as the first real product adopts the system, so snapshot churn would be noise. Revisit once a product has migrated and the API stabilizes (post first-migration). The `apps/smoke` benchmark + flagship pages serve as the interim composition regression guard (they must build green forever).
