import styles from "./DataTable.module.css";

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Left-aligned machine-face summary, e.g. "Showing 1–10 of 11,265". */
  totalLabel?: string;
}

export type PaginationItem = number | "ellipsis";

/**
 * Page-number window: at most 5 numbers plus ellipses.
 * `paginationItems(7, 35)` → `[1, "ellipsis", 6, 7, 8, "ellipsis", 35]`.
 */
export function paginationItems(page: number, pageCount: number): PaginationItem[] {
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (pageCount <= 7) return range(1, Math.max(pageCount, 1));
  if (page <= 4) return [...range(1, 5), "ellipsis", pageCount];
  if (page >= pageCount - 3) return [1, "ellipsis", ...range(pageCount - 4, pageCount)];
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", pageCount];
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * THE unified pagination pattern (replaces the divergent RapidX/Cognito pairs).
 * Ghost buttons, machine-face page numbers, `aria-current` on the active page.
 * State lives with the consumer — this only renders and emits.
 */
export function Pagination({ page, pageCount, onPageChange, totalLabel }: PaginationProps) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {totalLabel !== undefined && <span className={styles.paginationTotal}>{totalLabel}</span>}
      <div className={styles.paginationPages}>
        <button
          type="button"
          className={cx(styles.pageButton, styles.pageNavButton)}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <span aria-hidden="true">‹</span> Prev
        </button>
        {paginationItems(page, pageCount).map((item, i) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className={styles.paginationEllipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cx(styles.pageButton, item === page && styles.pageCurrent)}
              aria-current={item === page ? "page" : undefined}
              onClick={() => {
                if (item !== page) onPageChange(item);
              }}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className={cx(styles.pageButton, styles.pageNavButton)}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next <span aria-hidden="true">›</span>
        </button>
      </div>
    </nav>
  );
}
