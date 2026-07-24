# EmptyState — SPEC

## Purpose
The one sanctioned empty region: "No <things> yet." + how they appear + optional action (docs/guidelines/empty-states.md). NOT for cell-level absence (`—` — KeyValueList/table cells handle that) and NOT for errors (Phase 3 ErrorState/Toast).

## Reference
empty-states.md formula; drift it replaces: "Not yet instrumented" / "No detail yet" / "no runs" bare regions across RapidX/Cognito.

## Anatomy
container → illustration slot (optional, md only) → copy (title line + description sentence) → action slot (one primary Button).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | string | required | the "No <things> yet." line — sentence case, ends with a period |
| `description` | string | required | one sentence saying how the things appear |
| `action` | ReactNode | — | one primary action (a `<Button>`) |
| `illustration` | ReactNode | — | small, from `@shamrock-design/assets` empty-states; hidden in `sm` |
| `size` | `sm \| md` | `md` | `sm` = table-cell-height inline strip; `md` = centered region |

## States matrix
2 sizes × {with/without action, with/without illustration}. Non-interactive container — the action Button owns its own states. Dev copy lint: `console.warn` when title ends with "!" or contains "Oops" (non-production only).

## Behavior & keyboard
Static `<div>`. Not focusable; the embedded Button keeps native keyboard behavior. Illustration is `aria-hidden` — copy carries the information.

## Tokens consumed
text.{primary,secondary,tertiary,faint}, font.{size.{lead,body,meta},weight.semibold}, space. No surface/border — it sits inside whatever card/panel/table owns the region.

## Do / Don't
- Do: follow the formula — "No workflows yet. Create your first workflow to generate test cases from documents."
- Do: echo the query for filter-empty results ("No jobs match 'MDMR'.") with a clear/reset action.
- Don't: exclamation marks or "Oops" — calm, factual copy (linted in dev).
- Don't: leave a bare region instead — absence is information.

## Open questions
—
