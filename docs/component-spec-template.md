# <Component> — SPEC

> Copy to `packages/ui/src/components/<Name>/SPEC.md` before implementing.

## Purpose
One sentence: the job this component does and when NOT to use it (point to the alternative).

## Reference
Where it appears in the source apps (screenshot paths under `refs/`, benchmark selectors).

## Anatomy
Named parts (container, icon slot, label, dot…) — these become the CSS Module class list.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | | | |
| `size` | | | |
| `status` | `Status` | — | must consume the canonical enum |

## States matrix
default · hover · active · focus-visible · disabled · loading · error — × each variant. Which are impossible?

## Behavior & keyboard
Base UI primitive used (or "static"). Keyboard map. Focus behavior. ARIA roles/attrs.

## Tokens consumed
The `--sh-*` vars this component reads. Anything missing from the token set? (Add the token, don't hardcode.)

## Do / Don't
- Do: …
- Don't: … (the misuse you're designing against)

## Open questions
