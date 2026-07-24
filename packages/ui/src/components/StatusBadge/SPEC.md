# StatusBadge — SPEC

## Purpose
The ONLY way to render a status. Bakes in the redundant encoding (dot + text) so color-only status can't happen. NOT for categories/systems (use Tag) or counts (use CountPill, Phase 3).

## Reference
RapidX: Finished/Aborted/Overdue pills. Cognito: Active/Complete/Aborted. CM Data Integrity: Overdue/Pending/Closed/Sent back, Met/At risk/Breached. All normalize via `mapLegacyStatus`.

## Props
| Prop | Type | Default |
|---|---|---|
| `status` | `Status` (canonical enum) | required |
| `label` | string — display override; status still drives color | `STATUS_LABELS[status]` |
| `size` | `sm \| md` | `md` |
| `pulse` | boolean — dot pulses (running states) | auto-true for `running` |

## States matrix
7 statuses × 2 sizes. No hover/active (non-interactive). Pulse only animates the dot.

## Behavior & keyboard
Static `<span>`. Not focusable. The label carries the information for screen readers; dot is aria-hidden.

## Tokens consumed
status.<status>.{base,bg,text}, font.size.{caption,meta}, font.weight.semibold, space, radius.circle (dot only), motion (pulse).

## Do / Don't
- Do: `mapLegacyStatus()` at the data boundary, then pass the enum.
- Don't: choose colors by hand or add new statuses ad hoc — extend the enum via PR + guideline update.
