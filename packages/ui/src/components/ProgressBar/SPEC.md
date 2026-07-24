# ProgressBar — SPEC

## Purpose
Determinate progress toward completion, or a pass/fail proportion bar. NOT for indeterminate/busy states (use a spinner) and NOT for status labels (StatusBadge).

## Reference
RapidX run progress, Cognito execution report pass/fail proportion bar (segments render in order with surface gaps between them).

## Anatomy
optional label row (machine text, right-aligned above) → track (surface-faint + hairline) → fill (single) | segments (ordered, 2px gaps).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | number 0–100 | required (single mode) | clamped; drives `aria-valuenow` and fill width |
| `label` | ReactNode | — | machine text, right-aligned above the track ("X of Y done" style) |
| `status` | `Status` | — | fill color = that status's base; default `accent-base` |
| `size` | `sm(4) \| md(6)` | `md` | track height in px |
| `segments` | `{ value: number; status: Status }[]` | — | pass/fail proportion bar; renders in order with 2px surface gaps. Overrides `value`/`status` for the fill |

## States matrix
single (0 / partial / 100, ± status color) · with/without label · sm/md · segmented (1..n segments). No hover/focus/disabled — presentational.

## Behavior & keyboard
Static. Root `role="progressbar"` with `aria-valuenow`/`aria-valuemin=0`/`aria-valuemax=100` (single mode). Segmented mode sums segment values into `aria-valuenow` and exposes `aria-valuetext` describing the mix; each segment is presentational. `label` is wired via `aria-label` when a string, otherwise author-supplied `aria-label`/`aria-labelledby` applies.

## Tokens consumed
surface.faint, color.border.hairline, accent.base, status.*.base (fill vars), space (2px gap uses raw 2px — sub-token hairline gap, documented), font.{family-machine,size-caption}, text.tertiary, radius.none, motion.{duration-slow,easing-standard} (width transition).

## Do / Don't
- Do: write the label as machine baseline copy ("31 of 34 done"), right-aligned.
- Do: use `segments` for pass/fail/skipped execution mixes — order = pass, then warn, then fail.
- Don't: animate an indeterminate bar with this — it is determinate only.
- Don't: rely on segment color alone for meaning; pair with a legend/counts (canon #4).

## Open questions
—
