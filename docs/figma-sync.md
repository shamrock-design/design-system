# Figma ↔ code sync playbook

**Code is the source of truth.** The existing Figma library is partial/messy; it gets rebuilt *from* the coded system, then kept in sync via review-driven sessions. Nothing is automated end-to-end, deliberately.

## Phase A (now)
No Figma work. Tokens/components stabilize in code first.

## Phase B (after the first component wave)
Designers rebuild the Figma library from the coded system:
- Figma **Variables** named identically to DTCG paths: `color/accent/base`, `color/status/success/bg`, `space/4`, `font/size/body` … (slash-separated mirror of `packages/tokens/src`).
- One Figma component per `@shamrock/ui` component, variants matching the props enum (e.g. Button: variant × size × state).
- Name parity is the entire trick — it makes Figma↔code diffing mechanical.

## Phase C (steady state) — the sync session
When a designer updates a component/variable in Figma:

1. Open a Claude Code session in this repo with the Figma MCP server connected (authorize once via `/mcp`).
2. Prompt pattern: *"Read <Figma file/node link> via Figma MCP. Diff its variables against `packages/tokens/src/**` and its component properties against `packages/ui/src/components/<Name>` (SPEC.md + module.css). List every difference; propose code changes for the intended ones."*
3. Agent opens a branch: token JSON edits and/or component CSS edits + changeset + updated stories. Screenshots (Storybook) in the PR description.
4. Human review decides. Merge = the design change ships to every app on next bump.

### PR checklist for sync PRs
- [ ] Only intended diffs (Figma noise like detached instances excluded)
- [ ] Theme contract still passes (accent/font only in themes)
- [ ] Canon not violated (no radius, no new one-off colors — push back to the designer instead)
- [ ] Stories updated; a11y still green

## Never
- No auto-push to Figma; no webhooks; no unreviewed writes in either direction.
- No generating brand-new components from Figma frames — new components start with a SPEC.md and a conversation, not a frame import.
