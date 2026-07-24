import { Fragment, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import styles from "./DataTable.module.css";

export interface Column<Row> {
  /** Cell identity: default accessor (`row[key]`) and the sort key. */
  key: string;
  header: ReactNode;
  /** Custom cell renderer. Default: `row[key]`. */
  render?: (row: Row) => ReactNode;
  /** Header becomes a button with a sort affordance; sorting logic stays with the consumer. */
  sortable?: boolean;
  align?: "left" | "right";
  /** Fixed column width; also enables single-line ellipsis truncation (pair with a tooltip — see SPEC). */
  width?: string;
  /** Second gray line → 2-line cell (name over technical sub-label). */
  sub?: (row: Row) => ReactNode;
  /** Sub line in machine face (`/IBP/MDMR_EXECUTE`). */
  subMono?: boolean;
  /** Whole cell in machine face (timestamps, IDs, durations). */
  mono?: boolean;
}

export interface SortState {
  key: string;
  dir: "asc" | "desc";
}

export interface DataTableProps<Row> {
  columns: Column<Row>[];
  /** Already sorted/filtered/paged — the component never touches data. */
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Controlled sort. The component only renders indicators and emits `onSortChange`. */
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** Trailing chevron column; expanded panel spans all columns. `null` = row not expandable. */
  expandable?: (row: Row) => ReactNode | null;
  onRowClick?: (row: Row) => void;
  /** Leading checkbox column with header select-all (indeterminate when partial). */
  selection?: {
    selected: Set<string>;
    onChange: (next: Set<string>) => void;
  };
  /** Rendered when `rows` is empty and not loading. Pass an EmptyState per guidelines. */
  empty?: ReactNode;
  /** Pulse-skeleton rows. */
  loading?: boolean;
  density?: "regular" | "compact";
}

const SKELETON_ROW_COUNT = 5;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function defaultCell<Row>(row: Row, key: string): ReactNode {
  return (row as Record<string, unknown>)[key] as ReactNode;
}

/**
 * The tabular-data workhorse. Headless-ish: data in via props, intents out via
 * callbacks. Solid surface (dense data area — no glass blur), hairline row
 * dividers, calm rows; color arrives only through cell content (StatusBadge, Tag).
 */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  expandable,
  onRowClick,
  selection,
  empty,
  loading = false,
  density = "regular",
}: DataTableProps<Row>) {
  const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<string>>(new Set());

  const hasSelection = selection !== undefined;
  const hasExpand = expandable !== undefined;
  const totalCols = columns.length + (hasSelection ? 1 : 0) + (hasExpand ? 1 : 0);

  const keys = rows.map(rowKey);
  const selectedCount = hasSelection ? keys.filter((k) => selection.selected.has(k)).length : 0;
  const allSelected = hasSelection && rows.length > 0 && selectedCount === rows.length;
  const someSelected = hasSelection && selectedCount > 0 && !allSelected;

  function handleSortClick(col: Column<Row>) {
    const dir = sort?.key === col.key && sort.dir === "asc" ? "desc" : "asc";
    onSortChange?.({ key: col.key, dir });
  }

  function toggleExpanded(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!selection) return;
    selection.onChange(allSelected ? new Set<string>() : new Set(keys));
  }

  function toggleSelectRow(key: string, checked: boolean) {
    if (!selection) return;
    const next = new Set(selection.selected);
    if (checked) next.add(key);
    else next.delete(key);
    selection.onChange(next);
  }

  function handleRowClick(event: MouseEvent<HTMLTableRowElement>, row: Row) {
    if (!onRowClick) return;
    // Inner interactive elements (checkboxes, expand toggles, cell actions) win.
    if ((event.target as HTMLElement).closest("button, input, a, [role='button']")) return;
    onRowClick(row);
  }

  function colStyle(col: Column<Row>): CSSProperties | undefined {
    if (!col.width) return undefined;
    return { width: col.width, maxWidth: col.width };
  }

  function renderCellContent(col: Column<Row>, row: Row): ReactNode {
    const primary = col.render ? col.render(row) : defaultCell(row, col.key);
    if (!col.sub) return primary;
    return (
      <span className={styles.cellLines}>
        <span className={cx(styles.primaryLine, col.width && styles.truncate)}>{primary}</span>
        <span className={cx(styles.sub, col.subMono && styles.subMono, col.width && styles.truncate)}>
          {col.sub(row)}
        </span>
      </span>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={cx(styles.table, density === "compact" && styles.compact)} aria-busy={loading || undefined}>
        <thead>
          <tr>
            {hasSelection && (
              <th scope="col" className={cx(styles.th, styles.controlCell, styles.checkboxCell)}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  aria-label="Select all rows"
                  checked={allSelected}
                  disabled={loading || rows.length === 0}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              const ariaSort = col.sortable ? (isSorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none") : undefined;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={cx(styles.th, col.align === "right" && styles.alignRight)}
                  style={colStyle(col)}
                  aria-sort={ariaSort}
                >
                  {col.sortable ? (
                    <button type="button" className={styles.sortButton} onClick={() => handleSortClick(col)}>
                      {col.header}
                      <span
                        className={cx(styles.sortIcon, isSorted && styles.sortIconActive)}
                        aria-hidden="true"
                      >
                        {isSorted ? (sort.dir === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
            {hasExpand && (
              <th scope="col" className={cx(styles.th, styles.controlCell)} aria-label="Row details" />
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
              <tr key={`skeleton-${i}`} aria-hidden="true">
                {hasSelection && (
                  <td className={cx(styles.td, styles.controlCell)}>
                    <span className={styles.skeleton} />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={cx(styles.td, col.align === "right" && styles.alignRight)}>
                    <span className={cx(styles.skeleton, col.align === "right" && styles.alignRight)} />
                  </td>
                ))}
                {hasExpand && <td className={cx(styles.td, styles.controlCell)} />}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td className={cx(styles.td, styles.emptyCell)} colSpan={totalCols}>
                {empty ?? "No rows yet."}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row);
              const panel = expandable ? expandable(row) : null;
              const isExpanded = panel !== null && expandedKeys.has(key);
              return (
                <Fragment key={key}>
                  <tr
                    className={cx(styles.row, onRowClick && styles.clickable)}
                    onClick={onRowClick ? (e) => handleRowClick(e, row) : undefined}
                  >
                    {hasSelection && (
                      <td className={cx(styles.td, styles.controlCell, styles.checkboxCell)}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          aria-label="Select row"
                          checked={selection.selected.has(key)}
                          onChange={(e) => toggleSelectRow(key, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cx(
                          styles.td,
                          col.align === "right" && styles.alignRight,
                          col.mono && styles.mono,
                          col.width && !col.sub && styles.truncate,
                        )}
                        style={colStyle(col)}
                      >
                        {renderCellContent(col, row)}
                      </td>
                    ))}
                    {hasExpand && (
                      <td className={cx(styles.td, styles.controlCell)}>
                        {panel !== null && (
                          <button
                            type="button"
                            className={styles.expandButton}
                            aria-expanded={isExpanded}
                            aria-label="Toggle row details"
                            onClick={() => toggleExpanded(key)}
                          >
                            <span className={cx(styles.chevron, isExpanded && styles.chevronOpen)} aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td className={styles.expandedCell} colSpan={totalCols}>
                        <div className={styles.expandedPanel}>{panel}</div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
