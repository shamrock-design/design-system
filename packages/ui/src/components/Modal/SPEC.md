# Modal — SPEC

## Purpose
Blocking overlay for a focused task: confirm an action, fill a short form, walk a wizard. NOT for passive notifications (use Toast) and NOT for side-context editing of a list row (use a Drawer, Phase 2).

## Reference
Cognito: report/confirm modals, 2-step "Add Dataset" wizard with numbered circles + connector line. Elevation canon: `--sh-surface-overlay` + hairline + `--sh-shadow-3` over `--sh-surface-scrim`, `backdrop-filter: blur(20px)`.

## Anatomy
scrim · popup (glass overlay surface) · header (title + optional description + × close) · body (scrollable) · footer (right-aligned actions). Wizard adds a steps rail (dot + title + connector) between header and body.

## Props

### `Modal` (root, composable)
| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` / `defaultOpen` | boolean | — / false | controlled / uncontrolled |
| `onOpenChange` | `(open: boolean) => void` | — | fires for ×, Esc, scrim, `Dialog.Close` actions |
| `size` | `sm(420) \| md(560) \| lg(760)` | `md` | max-widths; clamps to viewport |
| `trigger` | ReactElement | — | rendered via Base UI `Dialog.Trigger render` (pass a `Button`) |
| `disableScrimDismiss` | boolean | false | scrim click no longer closes; Esc still does |

Parts: `Modal.Header` (`title`, `description?`, `hideClose?`) · `Modal.Body` (div props, scrollable) · `Modal.Footer` (footer props, right-aligned).

### `ConfirmModal`
`title`, `body` (text), `confirmLabel` (default "Confirm"), `cancelLabel` ("Cancel"), `destructive` (confirm renders as destructive Button), `onConfirm`, `onCancel`, plus root's open/trigger props. `size` defaults `sm`. Scrim dismissal disabled — a confirmation must be answered or explicitly escaped.

### `WizardModal`
`title`, `description?`, `steps: {title, content}[]`, `activeStep?` (controlled) / `defaultStep` / `onStepChange`, `onFinish`, `backLabel`/`nextLabel`/`finishLabel`, plus root props. `size` defaults `md`. Uncontrolled step resets on close. Footer shows machine "Step n of N" + Back/Next(→Finish).

## States matrix
closed · open (entry: `sh-rise` on popup, opacity transition on scrim) · scrolled body (footer hairline separates) · wizard step states: upcoming (hairline dot, subtle) / active (accent-filled dot, aria-current="step") / done (subtle-accent dot with check). Close/footer buttons carry Button states.

## Behavior & keyboard
Base UI `Dialog` (`@base-ui/react/dialog`): focus trap, page scroll lock, Esc close, scrim-click close (unless disabled), focus return to trigger, `aria-labelledby`/`aria-describedby` wired from `Dialog.Title`/`Dialog.Description`. ConfirmModal keeps role `dialog` (Base UI's AlertDialog is a separate part tree; parity is achieved with `disableScrimDismiss` instead of duplicating the family).

## Tokens consumed
surface.{overlay,scrim,solid}, shadow.3, z.modal, border.{hairline,hairline-strong,interactive}, accent.{base,on-accent,subtle-bg,subtle-text,subtle-border,focus-ring}, text.{primary,secondary,subtle}, space, font.{size,weight,tracking}, motion.{duration,easing}, radius.{none,circle}.

## Do / Don't
- Do: one primary action in the footer; cancel is `ghost`.
- Do: keep wizard steps ≤ 4 — more means the flow wants a full page.
- Don't: nest modals; chain steps instead (WizardModal).
- Don't: use ConfirmModal for reversible actions — a Toast after the fact is calmer.

## Open questions
- Wizard step dots use `--sh-radius-circle` — sanctioned as dots/orbs per canon rule 1 (matches Cognito's numbered circles).
