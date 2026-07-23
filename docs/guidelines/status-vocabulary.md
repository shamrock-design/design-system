# Status vocabulary

One canonical enum for every badge, tag, table cell, timeline node, and chart accent:

`neutral · info · success · warning · critical · pending · running`

Exported from `@shamrock-design/ui` (`STATUSES`, `STATUS_LABELS`, `mapLegacyStatus`). Colors come from `--sh-color-status-<name>-{base,bg,text}` and are **theme-invariant**.

## Legacy mapping (production apps → canon)

| Legacy strings | Canonical |
|---|---|
| Finished, Completed, Complete, success, Passed, Pass, Done, Healthy, Active, On-time | `success` |
| Failed, Fail, Aborted, Error, Blocked | `critical` |
| Overdue, Delayed, Late | `warning` |
| Running, In Progress, Executing | `running` |
| Pending, Queued, Scheduled, Locked, "no runs" | `pending` |
| Ready, Up next | `info` |

Use `mapLegacyStatus()` at data boundaries; never persist canonical labels back as new synonyms.

## Rendering rules

- **Dot + text label always.** Never color alone (accessibility + the redundant-encoding canon).
- Casing: label from `STATUS_LABELS` (Title case). No per-app rewording.
- Empty/none is `—` (em dash) with `pending` styling, not a new status.
- `critical` means "needs action now"; `warning` means "degraded/late but proceeding". Don't use `critical` for emphasis.
