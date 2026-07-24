# FolderTree — SPEC

## Purpose
Hierarchical navigation over a folder/document tree (sidebar idiom). NOT for tabular hierarchies with columns (use `DataTable` with `expandable`) and NOT for top-level app navigation (that is `AppShell.NavItem`'s job — this component matches its selected-row semantics but never imports it).

## Reference
Cognito's sidebar folder tree (Documents → folders → subfolders with counts). The ref drifted into ad-hoc `L1:`/`L2:` depth labels on some screens — that drift is preserved as the opt-in, consistently rendered `levelPrefixes` prop rather than copied verbatim.

## Anatomy
tree (ul, `role="tree"`) → item (li, `role="treeitem"`) → row (indent + caret + optional icon + label + machine count) → group (ul, `role="group"`) for children. Caret is an inline chevron that rotates 90° when expanded (sh motion tokens).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `TreeNode[]` | — | `{ id, label, icon?, count?, children?, disabled? }` |
| `expanded` | `Set<string>` | — | controlled expansion |
| `onExpandedChange` | `(next: Set<string>) => void` | — | |
| `defaultExpanded` | `Iterable<string>` | `[]` | uncontrolled expansion |
| `selected` | `string \| null` | `null` | controlled selection |
| `onSelect` | `(id: string) => void` | — | |
| `levelPrefixes` | `boolean` | `false` | machine-face `L1:`/`L2:` depth prefixes on every row |
| `aria-label` | `string` | `"Folders"` | tree label |

## States matrix
row: default · hover (`accent-subtle-bg`) · selected (solid surface + `accent-emphasis` text + 2px left accent bar — same semantics as `AppShell.NavItem`) · focus-visible (standard 3px ring, inset) · disabled (0.45 opacity, not-allowed, unselectable/unexpandable but still focusable per WAI-ARIA). Selected + hover keeps the selected treatment.

## Behavior & keyboard
Static (hand-rolled), WAI-ARIA tree pattern:
- `role=tree` / `treeitem` / `group`; `aria-expanded` on parents, `aria-selected` on all items, `aria-disabled` on disabled ones.
- Roving tabindex over **visible** nodes only. ArrowUp/ArrowDown move focus; ArrowRight expands a closed parent, else moves into the first child; ArrowLeft collapses an open parent, else moves focus to the parent; Home/End jump to first/last visible; Enter selects (disabled rows ignore Enter/expand).
- Click on the caret toggles expansion without selecting; click on the row selects (and expands a closed parent).
- Labels single-line-ellipsis at the container (`min-width: 0`) with a native `title` carrying the full value, per docs/guidelines/truncation.md. Counts are machine values and never truncate.

## Tokens consumed
`--sh-space-{1,2,3,5}`, `--sh-font-size-{body,meta,micro}`, `--sh-font-family-machine`, `--sh-font-weight-{regular,medium}`, `--sh-font-tracking-body`, `--sh-color-text-{primary,subtle,faint}`, `--sh-color-accent-{base,emphasis,subtle-bg,focus-ring}`, `--sh-surface-solid`, `--sh-motion-duration-fast`, `--sh-motion-easing-standard`, `--sh-radius-none`.

## Do / Don't
- Do: keep counts in sync with what expansion reveals — a count is a promise.
- Do: pass `expanded` + `onExpandedChange` together (controlled) or neither (uncontrolled).
- Don't: use `levelPrefixes` on end-user-facing trees; it is a machine/debug affordance.
- Don't: rebuild `nodes` identity on every render if the tree is large.

## Open questions
— multi-select (aria-multiselectable) is out of scope until a product needs it.
