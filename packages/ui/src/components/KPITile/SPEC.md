# KPITile — SPEC

## Purpose
The "no naked numbers" enforcer: a glass metric card that renders a KPI only against a baseline (canon #7). NOT for status (StatusBadge), categories (Tag), or metadata pairs (KeyValueList).

## Reference
Smoke app KPI grid (`apps/smoke/src/App.tsx`: Runs 104 / Avg duration 1h 21m / Abort rate 4.6%), RapidX run-summary tiles, benchmark stat cards (glass card, hairline border, 3px accent top bar).

## Anatomy
container (glass card) → header (label eyebrow + optional icon) → value (kpi role, machine face) → delta line (baseline copy) | dev-only "⚠ no baseline" hint.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | string | required | label-caps subtle eyebrow |
| `value` | ReactNode | required | rendered `Text variant="kpi"` (machine face, 21px) |
| `delta` | `{ text: string; sentiment?: "positive" \| "negative" \| "neutral" }` | — | required-by-design; omission `console.warn`s and renders a dev-visible "⚠ no baseline" hint in non-production |
| `icon` | ReactNode | — | decorative, top-right of header |
| `accentBar` | boolean | `true` | 3px `accent-base` top border |
| `onClick` | MouseEventHandler | — | switches the root to a real `<button>` with hover lift |

## States matrix
default · with/without accentBar · delta × 3 sentiments (positive = success-text, negative = critical-text, neutral = text-tertiary) · missing delta (dev hint) · interactive: hover (translateY(-2px) + shadow-2) / focus-visible (focus ring) — hover/focus impossible when non-interactive.

## Behavior & keyboard
Static `<div>` by default. With `onClick`: native `<button type="button">` — Space/Enter native, focus-visible ring. Icon is `aria-hidden`; label + value + delta carry the information.

## Tokens consumed
surface.card, border.hairline, accent.{base,focus-ring}, status.{success,critical,warning}.text, text.{subtle,tertiary}, font.{family.machine,size.meta/caption,leading-tight}, space, shadow.2, motion.{duration-fast,easing-standard}, radius.none. Blur 12px per elevation.md glass range.

## Do / Don't
- Do: write delta copy per date-time-format.md ("+35 min vs plan" — signed, minutes).
- Do: sentiment = meaning, not sign ("−2 incidents" is `positive`).
- Don't: ship without `delta` — a number with no baseline is noise, and the tile will nag in dev.
- Don't: put status vocabulary in the delta; state belongs to StatusBadge.

## Open questions
—
