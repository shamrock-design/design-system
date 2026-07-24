# Avatar — SPEC

## Purpose
Person/owner identity mark: initials or photo in a circle. NOT for status (StatusBadge), counts (pill), or arbitrary icons (Icon).

## Reference
Cognito owner chips, assignee cells in tables. Circle is the canon dot/orb exception (`--sh-radius-circle`).

## Anatomy
container (circle) → image | initials (derived from name).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | string | required | accessible label; initials = first letters of the first 2 words |
| `src` | string | — | photo; on load error falls back to initials |
| `size` | `sm(24) \| md(32) \| lg(40)` | `md` | |
| `shape` | `"circle"` | `circle` | circle only — the sanctioned dot/orb radius exception (canon #1) |
| `muted` | boolean | `false` | hairline ring + ink text on glass instead of identity color — for dense/quiet contexts |

## Deterministic identity color
The `name` hashes into the 5-color categorical set `--sh-color-chart-cat-1..5` with white text. **This is the ONLY sanctioned decorative use of the categorical palette** — identity hue is not status, not accent, and carries no meaning beyond telling people apart (color-usage.md still holds everywhere else). Same name → same color, everywhere, every theme.

## States matrix
initials · image · image-error fallback (initials) · muted · × 3 sizes. Static — no hover/focus/disabled (wrap in a Tooltip/button if interactive).

## Behavior & keyboard
Static. Root is `role="img"` with `aria-label={name}`; initials and photo are presentational (`alt=""` on the img).

## Tokens consumed
color.chart.cat-1..5, radius.circle, border.hairline-strong, surface.card, text.{inverse via on-color white? → uses `--sh-color-text-inverse`}, text.secondary (muted), font.{weight-semibold,size.micro/caption/meta}, space.

## Do / Don't
- Do: keep initials to 2 characters; pass the full display name so hashing is stable.
- Don't: use categorical colors anywhere else "because Avatar does" — this is a scoped exception.
- Don't: encode state in the avatar (ring colors etc.) — status belongs to StatusBadge.

## Open questions
—
