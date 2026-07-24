# Tag — SPEC

## Purpose
Categorical labels: source systems (IBP/ECC/BW), hierarchy levels (L1/L2), dependency chips, priorities. NOT for status (StatusBadge) and NOT interactive (Phase 3 FilterChip handles click/remove).

## Reference
RapidX system tags (IBP blue, ECC amber), Cognito L1/L2/priority tags, benchmark `.syschip` (mono machine names), dependency chips ("DEPENDS ON").

## Props
| Prop | Type | Default |
|---|---|---|
| `tone` | `neutral \| accent \| info \| success \| warning \| critical` | `neutral` |
| `mono` | boolean — machine face for technical names | false |
| `size` | `sm \| md` | `md` |

## States matrix
6 tones × 2 sizes × mono. Non-interactive, no hover.

## Tokens consumed
status triads (for the 4 status-colored tones), accent.subtle-*, hair/ink neutrals, font.family.machine.

## Do / Don't
- Do: pick ONE tone per category and keep it consistent app-wide (e.g. IBP=info always).
- Don't: use tones to signal state — that's StatusBadge's job. A Tag's color never means healthy/failed.
