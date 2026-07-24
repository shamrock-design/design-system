# Card — SPEC

## Purpose
The generic composition surface: a glass/solid/faint panel with hairline border for free-form content (process cards, detail panes, form sections). NOT for metrics with baselines (KPITile stays specialized) and NOT for status (StatusBadge).

## Reference
Benchmark `.pcard` process cards (stage color-bar on top), Cognito project cards, RapidX panel sections. Elevation canon: border-first, shadow only on interactive hover-lift.

## Anatomy
container (surface + hairline + optional accent top bar) → optional `Card.Header` (title + trailing slot) → free-form children.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `glass \| solid \| faint` | `glass` | glass = surface-card + blur(12px); solid = surface-solid (dense data); faint = surface-faint |
| `accentBar` | `boolean \| Status` | `false` | `true` = 3px `accent-base` top bar; a `Status` value = that status's base color (`.pcard` stage bar). Decorative — pair with a StatusBadge for the actual state label |
| `interactive` | boolean | inferred | hover lift (translateY(-2px) + shadow-2) + focus ring. Auto-true when `onClick`/`href` present |
| `href` | string | — | renders an `<a>` (link semantics) |
| `onClick` | MouseEventHandler | — | renders a `<button type="button">` (unless `href`) |
| `padding` | `SpaceToken` | `6` | maps to `--sh-space-N`; `0` for flush content (tables) |

`Card.Header`: `title` (ReactNode) + `trailing?` slot (actions/badge), hairline-free — spacing comes from card padding + stack gap.

## States matrix
variant × 3 · accentBar off/true/each status · interactive: default / hover (lift + shadow-2) / focus-visible (ring) / active — hover/focus impossible when static. `padding` 0 vs default.

## Behavior & keyboard
Static `<div>` by default. `href` → native `<a>`; `onClick` → native `<button>` (Space/Enter native). Never both semantics at once — `href` wins and `onClick` attaches to the anchor.

## Tokens consumed
surface.{card,solid,faint}, border.hairline, accent.{base,focus-ring}, status.*.base (via `--sh-card-accent` var), shadow.2, space (padding var), radius.none, motion.{duration-fast,easing-standard}, text.primary, font.{size-control,weight-semibold,tracking-tight}.

## Do / Don't
- Do: use `variant="solid"` where blur hurts legibility (dense tables inside the card).
- Do: keep the status bar + StatusBadge in sync — the bar is decorative, never the only state signal (canon #4).
- Don't: rebuild KPITile with Card — metrics belong to KPITile.
- Don't: nest interactive Cards or put buttons inside an interactive Card (nested interactive controls).

## Open questions
—
