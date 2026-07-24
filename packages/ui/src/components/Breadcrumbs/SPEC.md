# Breadcrumbs — SPEC

## Purpose
The location trail in `AppShell.Topbar`'s start slot: where am I, with one-click hops back up. NOT for step progress in flows (use WizardModal steps) and NOT for view switching (use Tabs).

## Reference
Benchmark topbar trail; production apps drifted into ad-hoc "A / B / C" text. Screenshots under `refs/`.

## Anatomy
`nav[aria-label="Breadcrumb"]` → `ol` → `li` crumbs (`<a>`/`<button>`/`<span>`) + `›` separators (text-faint, aria-hidden) + `…` collapse marker + current crumb.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `BreadcrumbItem[]` | — | `{ label, href?, onClick?, mono? }` |
| `items[].href` | `string` | — | crumb renders `<a>` |
| `items[].onClick` | `MouseEventHandler` | — | crumb renders `<button>` when no `href` |
| `items[].mono` | `boolean` | `false` | machine face for technical segments (IDs, table codes) |
| native `<nav>` props | | | |

## States matrix
Link crumb: default (text-secondary) · hover (text-primary, underline) · focus-visible (3px focus-ring shadow). Current crumb (last): text-primary semibold, `aria-current="page"`, never a link. Static crumb (no href/onClick): plain span. Ellipsis: static, `title` = full trail. Disabled/loading/error: n/a.

## Behavior & keyboard
Static. `<nav aria-label="Breadcrumb">` + `<ol>` per WAI-ARIA breadcrumb pattern; separators are aria-hidden text. When `items.length > 4`, the middle collapses to `…` (first + last two shown); the `…` carries a `title` with the full trail. Native Tab/Enter on links/buttons.

## Tokens consumed
text.{primary,secondary,faint}, accent.focus-ring, space, font.{size-body,weight-medium,weight-semibold,tracking-body,family-machine}, motion.{duration-fast,easing-standard}, radius.none.

## Do / Don't
- Do: keep labels short — trail depth is the information, not prose.
- Do: set `mono` on machine segments (`/IBP/MDMR_EXECUTE`).
- Don't: make the last item clickable — it is the current page.
- Don't: hand-roll separators in product code; the component owns `›`.

## Open questions
— none.
