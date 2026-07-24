# GlobalAlertPill — SPEC

## Purpose
The persistent global anomaly affordance ("⚠ 7 orphans detected") that IS a button — one click jumps to the offending list. NOT for transient feedback (use Toast) and NOT for inline row state (use StatusBadge).

## Reference
RapidX topbar orphan counter — the ref's version read as a static badge and nobody clicked it. Ours adds hover treatment + a chevron-right affordance. Screenshots under `refs/`.

## Anatomy
`root` (inline-flex) → `alert` button (status bg/text, sharp rectangle): `icon` slot (default warn triangle) + machine-face `count` + `label` + `chevron` → optional sibling `dismiss` button (×).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `count` | `number` | — | machine face, semibold |
| `label` | `string` | — | e.g. "orphans detected" |
| `status` | `Status` | `"warning"` | canonical enum; drives bg/text/focus tint |
| `onClick` | `() => void` | — | **required** — it IS a button; navigate to the affected list |
| `onDismiss` | `() => void` | — | when set, renders a separate × button (never nested) |
| `icon` | `ReactNode` | warn triangle | slot override |
| native `<button>` props | | | spread onto the main button |

## States matrix
default (status bg + status text) · hover (status base border + slight lift of text contrast) · active · focus-visible (3px focus-ring shadow) · dismissed (consumer unmounts). Disabled: not supported by design — an inert global alert is a lie; unmount instead. Loading/error: n/a.

## Behavior & keyboard
Static. Main affordance is a native `<button>`; dismiss is a **sibling** `<button aria-label="Dismiss">` (buttons never nest). Accessible name comes from content ("7 orphans detected"). Placement is the consumer's job — typically `AppShell.Topbar` `end`.

## Tokens consumed
status.{base,bg,text} triad of the given status (via CSS vars), accent.focus-ring, surface-solid (dismiss hover), space, font.{size-meta,size-micro?,weight,family-machine,tracking-body}, motion.{duration-fast,easing-standard}, radius.none.

## Do / Don't
- Do: keep it mounted while the anomaly persists — it is a system-state lamp, not a notification.
- Do: use `critical` only when the number blocks work.
- Don't: round it — sharp rectangle per canon (the name is legacy).
- Don't: use it without `onClick`; a dead-end alert is the exact failure of the reference.

## Open questions
— none.
