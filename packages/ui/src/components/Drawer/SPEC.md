# Drawer — SPEC

## Purpose
Right-side slide-in panel for inspecting/editing one record in context (node inspector, run detail) while the underlying list stays visible. NOT for blocking decisions (use Modal/ConfirmModal) and NOT for primary navigation.

## Reference
THE benchmark `.side` detail panel; RapidX node inspector (right rail, label-caps eyebrow "STEP 07", full-width vertical action stack in the footer). Elevation canon: drawers = `--sh-shadow-drawer` (directional) + left hairline.

## Anatomy
scrim (modal only) → panel (fixed right, full height, glass) → header (eyebrow? + title + ×) → body (scrollable) → footer (vertical full-width action stack, hairline top).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` / `defaultOpen` | boolean | — | controlled / uncontrolled |
| `onOpenChange` | `(open: boolean) => void` | — | fires for ×, Esc, scrim click |
| `size` | `sm(360) \| md(440) \| lg(560)` | `md` | panel width, clamped to viewport |
| `trigger` | ReactElement | — | rendered as `Dialog.Trigger` |
| `modal` | boolean | `true` | `true`: scrim + focus trap + scroll lock. `false`: no scrim, page stays interactive (Base UI `modal={false}`) — for persistent inspectors |
| `disableScrimDismiss` | boolean | `false` | keep open on outside press (Esc still closes) |

`Drawer.Header`: `title` (ReactNode, wired to aria-labelledby), `eyebrow?` (label-caps machine slot, e.g. "STEP 07"), `hideClose?`. `Drawer.Body`: scrollable free-form. `Drawer.Footer`: children stretch full-width, stacked vertically (RapidX inspector pattern).

## States matrix
closed · open (slide-in `sh-slidein`, slow duration) · closing (slide-out via `[data-ending-style]`) · modal vs non-modal · with/without eyebrow/footer. Close button: hover tint · focus-visible ring.

## Behavior & keyboard
Base UI `Dialog` (`@base-ui/react/dialog`). Esc closes; outside press closes unless `disableScrimDismiss`; focus trap + scroll lock + focus return when `modal` (Base UI). Panel is `role="dialog"` labelled by the header title.

## Tokens consumed
surface.{panel,scrim}, color.border.hairline, shadow.drawer, z.drawer (panel) / z.modal (scrim when modal), space, font (via Text roles), motion.{duration-slow,easing-standard}, accent.{subtle-bg,focus-ring}, text.{primary,subtle,machine}. Blur 20px per elevation.md glass range. Keyframe `sh-slidein` from reset.css.

## Do / Don't
- Do: use `modal={false}` for inspectors the user keeps open while working the canvas/list.
- Do: put the drawer's actions in `Drawer.Footer` as full-width buttons — one `primary` max.
- Don't: nest a Drawer inside a Modal, or use a Drawer for confirmations.

## Open questions
—
