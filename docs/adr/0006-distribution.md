# ADR-0006 — Distribution: private npm via GitHub Packages

**Date:** 2026-07-22 · **Status:** accepted

Monorepo (pnpm + Turborepo), Changesets for semver/changelogs, publish to GitHub Packages on merge via the Changesets action. `tokens/ui/icons` version-linked; `assets` independent. Alternative considered: self-hosted Verdaccio (avoids scope=org-name coupling) — rejected to avoid running a server. NOTE: npm scope must equal the GitHub org name; placeholder scope `@shamrock` until the org is confirmed.
