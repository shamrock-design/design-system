# Tooltip — SPEC

## Purpose
Hover/focus-revealed clarification for a control or a truncated value. NOT for content the user must read to proceed (put it in the layout) and NOT for interactive content (use a popover pattern when one exists).

This is **the tooltip every truncated value must use** (docs/guidelines/truncation.md): no tooltip → don't truncate.

## Reference
Benchmark `.tip` (ink bubble, caption type). Production apps used title="" attributes — inaccessible and unstyled; this replaces them.

## Anatomy
trigger (caller-supplied element) → portal → positioner (z: tooltip) → popup (ink surface, inverse caption text).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `ReactNode` | — | the tooltip body; keep to a phrase, not a paragraph |
| `children` | `ReactElement` | — | single trigger element; Base UI merges the trigger props onto it |
| `side` | `top \| bottom \| left \| right` | `top` | flips automatically on collision |
| `delay` | `number` (ms) | `300` | per-trigger; overrides `TooltipProvider` delay |
| `open` / `defaultOpen` / `onOpenChange` | — | — | controlled / uncontrolled |
| `disabled` | `boolean` | `false` | trigger renders but never opens |

`TooltipProvider` (re-exported Base UI provider) groups adjacent tooltips: once one opens, neighbors open instantly (400ms timeout window).

## States matrix
closed · open (fade via data-starting/ending-style) · disabled. No hover/active styling on the popup itself — it is never interactive.

## Behavior & keyboard
Base UI `@base-ui/react/tooltip` (`Tooltip.Provider/Root/Trigger/Portal/Positioner/Popup`). Opens on hover after `delay` and instantly on keyboard focus; closes on Escape, blur, or pointer leave. `role="tooltip"` + aria-describedby wiring handled by Base UI. Arrow intentionally skipped — sharp-cornered ink bubble reads fine without it.

## Tokens consumed
text.{primary→bg,inverse}, font.{size.caption,tracking-body,leading-base}, space.{2,3}, radius.none, z.tooltip, motion.{duration-fast,easing-standard}. Max-width 280px (matches the benchmark bubble measure).

## Do / Don't
- Do: put the full untruncated value in `content` for every ellipsized cell.
- Do: keep content passive text; a machine value in content may use `<Text variant="machine" tone="inverse">`.
- Don't: put links/buttons inside — a tooltip can't be clicked reliably.
- Don't: tooltip a disabled element without a focusable wrapper (it will never open for keyboard users).

## Open questions
- Arrow part exists in Base UI; add only if a real screen demands anchoring clarity.
