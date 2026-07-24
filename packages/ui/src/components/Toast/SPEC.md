# Toast — SPEC

## Purpose
Transient, non-blocking feedback after an action ("Sync started", "Export failed"). NOT for information that must be acted on before continuing (use ConfirmModal) and NOT for persistent state (use StatusBadge in place).

## Reference
Cognito/RapidX post-action feedback ("Run Sync" → confirmation). Elevation canon: toasts sit at `--sh-z-toast`; solid surface (`--sh-surface-solid`) because blur hurts legibility over moving content.

## Anatomy
viewport (fixed bottom-right stack) · toast root (solid card, 3px status accent bar on the left) · title row (status dot + title) · description · × dismiss.

## Props

### `ToastProvider`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `durationMs` | number | 5000 | default auto-dismiss; `0` disables |
| `limit` | number | 3 | oldest toasts beyond the limit are hidden |

Wrap the app once; it renders the portal + viewport itself.

### `useToast()`
Returns `{ toast, dismiss }`.
`toast({ title, description?, status?, durationMs? })` → id (string). `status` is the canonical `Status` enum (`neutral` default; use `success | critical | warning | info` for outcomes). `dismiss(id?)` closes one toast or all.

## States matrix
entering (`sh-slidein`) · resting · hovered (auto-dismiss timer paused — Base UI) · dismissing (opacity/translate transition out) · limited (hidden beyond `limit`). Status renders as dot + accent bar + text title — never color alone (canon rule: dot + label).

## Behavior & keyboard
Base UI `Toast` (`@base-ui/react/toast`): timer pause on hover/viewport focus, F6 focus hotkey, swipe-right to dismiss, polite/urgent announcements, Esc (while focused) closes. `useToast` wraps `useToastManager.add` mapping `status → type` and `durationMs → timeout`.

## Tokens consumed
surface.solid, shadow.1, z.toast, border.hairline-strong, status.{neutral,info,success,warning,critical,pending,running}.base, accent.{subtle-bg,focus-ring}, text.{primary,secondary,subtle}, space, font.{size,weight,tracking}, motion.{duration,easing}, radius.{none,circle}.

## Do / Don't
- Do: keep titles to a few words; the description carries the detail.
- Do: pass `durationMs: 0` for failures that need reading — with an explicit dismiss.
- Don't: fire a success toast for every nominal keystroke-level action — color is earned.
- Don't: encode a different state in the title than in `status`.

## Open questions
- Action button slot (e.g. "Undo") — deferred until a product needs it (Base UI `Toast.Action` is ready for it).
