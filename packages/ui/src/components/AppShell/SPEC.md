# AppShell — SPEC

## Purpose
The page chassis every product mounts once: Aurora backdrop + fixed glass sidebar + main column (topbar / optional context bar / scrollable content). NOT for nested sub-layouts inside a page (use Stack/Grid) and NOT a router — it renders whatever nav items it is given.

## Reference
RapidX sidebar (sections + active lavender pill → ours = sharp + 2px left accent bar), benchmark topbar/context bar. Screenshots under `refs/`.

## Anatomy
`shell` (grid) → `Aurora` + `Sidebar` (aside, glass, right hairline) + main cells. Sidebar children: `Brand` (wordmark slot + collapse toggle), `NavSection` (nav + label-caps title), `NavItem` (icon / label / count, active left-bar). Main cells: `Topbar` (header, glass, bottom hairline, start/end slots), `ContextBar` (filters row), `Content` (main, scrollable).

## Props

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `AppShell` | `collapsed` | `boolean` | — | controlled |
| | `defaultCollapsed` | `boolean` | `false` | uncontrolled |
| | `onCollapsedChange` | `(collapsed: boolean) => void` | — | fires on toggle |
| `Sidebar` | native `<aside>` props | | | 220px expanded / 56px icon rail |
| `Brand` | `showCollapseToggle` | `boolean` | `true` | chevron button, aria-expanded |
| `NavSection` | `title` | `ReactNode` | — | label-caps subtle; hidden when collapsed |
| `NavItem` | `icon` | `ReactNode` | — | required for a legible collapsed rail |
| | `label` | `string` | — | doubles as `title` attr when collapsed |
| | `active` | `boolean` | `false` | solid surface + accent-emphasis + 2px left accent bar; `aria-current="page"` |
| | `count` | `number` | — | machine-face count pill (hidden collapsed) |
| | `href` / `onClick` | | — | renders `<a>` when `href`, else `<button>` |
| `Topbar` | `start` / `end` | `ReactNode` | — | left slot (Breadcrumbs/context) + right-aligned slot row |
| `ContextBar` | children | | — | optional second bar (filters) |
| `Content` | children | | — | scrollable `<main>`, padding `--sh-space-8` |

## States matrix
NavItem: default · hover (faint surface, primary text) · active (persistent) · focus-visible (3px focus-ring shadow). Shell: expanded · collapsed (width animates, labels/section titles/counts hidden, icon + `title` tooltip). Loading/disabled/error: n/a.

## Behavior & keyboard
Static (no Base UI). Collapse state is controlled/uncontrolled via `collapsed`/`defaultCollapsed` + `onCollapsedChange`; shared through context so `Brand`'s toggle and `NavItem`s react. Semantic DOM: `aside` sidebar, `nav` per NavSection (aria-label = title), `header` topbar, `main` content. NavItems are real `<a>`/`<button>` — native Tab/Enter/Space.

## Tokens consumed
surface.{page,panel,solid,faint}, border.hairline, accent.{base,emphasis,focus-ring}, text.{primary,secondary,tertiary,subtle}, space, font.{size,weight,tracking,family-machine}, motion.{duration-base,easing-standard}, radius.pill (count only), z.sticky.

## Do / Don't
- Do: mount once at the app root; put `GlobalAlertPill` in `Topbar` `end`.
- Do: pass `href` for real navigation so middle-click/copy-link work.
- Don't: put actions in the sidebar — it is navigation only.
- Don't: nest an AppShell inside `Content`.

## Open questions
— none.
