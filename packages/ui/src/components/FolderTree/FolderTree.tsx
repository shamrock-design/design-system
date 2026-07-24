import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import styles from "./FolderTree.module.css";

export interface TreeNode {
  id: string;
  label: string;
  /** Small leading icon slot (16px box). */
  icon?: ReactNode;
  /** Trailing machine-face count (item counts are machine values). */
  count?: number;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface FolderTreeProps
  extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect" | "children"> {
  nodes: TreeNode[];
  /** Controlled expansion. Pair with `onExpandedChange`. */
  expanded?: Set<string>;
  onExpandedChange?: (next: Set<string>) => void;
  /** Uncontrolled initial expansion. */
  defaultExpanded?: Iterable<string>;
  /** Controlled selection. */
  selected?: string | null;
  onSelect?: (id: string) => void;
  /** Machine-face `L1:`/`L2:` depth prefixes on every row. Debug/machine affordance — off by default. */
  levelPrefixes?: boolean;
}

interface FlatNode {
  node: TreeNode;
  depth: number;
  parentId: string | null;
}

/** Depth-first flatten of the VISIBLE nodes (children of collapsed parents excluded). */
function flattenVisible(nodes: TreeNode[], expanded: ReadonlySet<string>): FlatNode[] {
  const out: FlatNode[] = [];
  function walk(list: TreeNode[], depth: number, parentId: string | null) {
    for (const node of list) {
      out.push({ node, depth, parentId });
      if (node.children && node.children.length > 0 && expanded.has(node.id)) {
        walk(node.children, depth + 1, node.id);
      }
    }
  }
  walk(nodes, 0, null);
  return out;
}

/**
 * WAI-ARIA folder tree (sidebar idiom). Roving tabindex over visible rows,
 * caret expansion, single selection with AppShell.NavItem-matching selected
 * semantics (solid surface + accent-emphasis text + 2px left accent bar).
 */
export function FolderTree({
  nodes,
  expanded: expandedProp,
  onExpandedChange,
  defaultExpanded,
  selected = null,
  onSelect,
  levelPrefixes = false,
  className,
  "aria-label": ariaLabel = "Folders",
  ...rest
}: FolderTreeProps) {
  const [expandedState, setExpandedState] = useState<Set<string>>(
    () => new Set(defaultExpanded ?? []),
  );
  const expanded = expandedProp ?? expandedState;

  const setExpanded = useCallback(
    (next: Set<string>) => {
      if (expandedProp === undefined) setExpandedState(next);
      onExpandedChange?.(next);
    },
    [expandedProp, onExpandedChange],
  );

  const visible = useMemo(() => flattenVisible(nodes, expanded), [nodes, expanded]);

  // Roving tabindex: the selected row (if visible) or the first row holds tab stop.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  const visibleIds = visible.map((f) => f.node.id);
  const tabStopId =
    (focusedId !== null && visibleIds.includes(focusedId) && focusedId) ||
    (selected !== null && visibleIds.includes(selected) && selected) ||
    visibleIds[0] ||
    null;

  function focusRow(id: string) {
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  }

  function toggleExpanded(node: TreeNode, force?: boolean) {
    const next = new Set(expanded);
    const shouldExpand = force ?? !next.has(node.id);
    if (shouldExpand) next.add(node.id);
    else next.delete(node.id);
    setExpanded(next);
  }

  function handleRowClick(flat: FlatNode) {
    if (flat.node.disabled) return;
    setFocusedId(flat.node.id);
    const hasChildren = (flat.node.children?.length ?? 0) > 0;
    if (hasChildren && !expanded.has(flat.node.id)) toggleExpanded(flat.node, true);
    onSelect?.(flat.node.id);
  }

  function handleCaretClick(event: MouseEvent, flat: FlatNode) {
    event.stopPropagation();
    if (flat.node.disabled) return;
    setFocusedId(flat.node.id);
    toggleExpanded(flat.node);
  }

  function handleKeyDown(event: KeyboardEvent, flat: FlatNode) {
    const index = visibleIds.indexOf(flat.node.id);
    const hasChildren = (flat.node.children?.length ?? 0) > 0;
    const isExpanded = hasChildren && expanded.has(flat.node.id);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextId = visibleIds[index + 1];
        if (nextId !== undefined) focusRow(nextId);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevId = visibleIds[index - 1];
        if (prevId !== undefined) focusRow(prevId);
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        if (flat.node.disabled) break;
        if (hasChildren && !isExpanded) toggleExpanded(flat.node, true);
        else if (isExpanded) {
          const firstChildId = flat.node.children?.[0]?.id;
          if (firstChildId !== undefined) focusRow(firstChildId);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (isExpanded && !flat.node.disabled) toggleExpanded(flat.node, false);
        else if (flat.parentId !== null) focusRow(flat.parentId);
        break;
      }
      case "Home": {
        event.preventDefault();
        if (visibleIds[0] !== undefined) focusRow(visibleIds[0]);
        break;
      }
      case "End": {
        event.preventDefault();
        const lastId = visibleIds[visibleIds.length - 1];
        if (lastId !== undefined) focusRow(lastId);
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (!flat.node.disabled) onSelect?.(flat.node.id);
        break;
      }
    }
  }

  function renderItems(list: TreeNode[], depth: number, parentId: string | null): ReactNode {
    return list.map((node) => {
      const hasChildren = (node.children?.length ?? 0) > 0;
      const isExpanded = hasChildren && expanded.has(node.id);
      const isSelected = selected === node.id;
      const flat: FlatNode = { node, depth, parentId };

      return (
        <li
          key={node.id}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          aria-disabled={node.disabled || undefined}
          tabIndex={node.id === tabStopId ? 0 : -1}
          ref={(el) => {
            if (el) itemRefs.current.set(node.id, el);
            else itemRefs.current.delete(node.id);
          }}
          className={styles.item}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget) handleKeyDown(event, flat);
          }}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setFocusedId(node.id);
          }}
        >
          <div
            className={[
              styles.row,
              isSelected && styles.rowSelected,
              node.disabled && styles.rowDisabled,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ paddingLeft: `calc(${depth} * var(--sh-space-5) + var(--sh-space-3))` }}
            onClick={() => handleRowClick(flat)}
          >
            {hasChildren ? (
              <span
                className={[styles.caret, isExpanded && styles.caretExpanded].filter(Boolean).join(" ")}
                onClick={(event) => handleCaretClick(event, flat)}
                aria-hidden="true"
                data-testid={`caret-${node.id}`}
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 2.5L8 6l-3.5 3.5" />
                </svg>
              </span>
            ) : (
              <span className={styles.caretSpacer} aria-hidden="true" />
            )}
            {levelPrefixes && <span className={styles.levelPrefix}>L{depth + 1}:</span>}
            {node.icon && (
              <span className={styles.icon} aria-hidden="true">
                {node.icon}
              </span>
            )}
            <span className={styles.label} title={node.label}>
              {node.label}
            </span>
            {node.count !== undefined && <span className={styles.count}>{node.count}</span>}
          </div>
          {isExpanded && (
            <ul role="group" className={styles.group}>
              {renderItems(node.children!, depth + 1, node.id)}
            </ul>
          )}
        </li>
      );
    });
  }

  return (
    <ul
      role="tree"
      aria-label={ariaLabel}
      className={[styles.tree, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {renderItems(nodes, 0, null)}
    </ul>
  );
}
