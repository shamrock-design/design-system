import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import styles from "./Breadcrumbs.module.css";

export interface BreadcrumbItem {
  label: string;
  /** Renders the crumb as an `<a>` — prefer this for real navigation. */
  href?: string;
  /** Renders the crumb as a `<button>` when no `href` is given. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Machine face for technical segments (IDs, table codes, paths). */
  mono?: boolean;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

const COLLAPSE_THRESHOLD = 4;

function Crumb({ item, current }: { item: BreadcrumbItem; current: boolean }) {
  const className = [styles.crumb, current && styles.current, item.mono && styles.mono]
    .filter(Boolean)
    .join(" ");
  if (current) {
    return (
      <span className={className} aria-current="page">
        {item.label}
      </span>
    );
  }
  if (item.href !== undefined) {
    return (
      <a className={className} href={item.href} onClick={item.onClick}>
        {item.label}
      </a>
    );
  }
  if (item.onClick) {
    return (
      <button type="button" className={className} onClick={item.onClick}>
        {item.label}
      </button>
    );
  }
  return <span className={className}>{item.label}</span>;
}

/**
 * Location trail for `AppShell.Topbar`. The last item is the current page
 * (aria-current, never a link). Trails deeper than 4 collapse the middle
 * to an ellipsis carrying the full trail as a `title`.
 */
export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  const collapse = items.length > COLLAPSE_THRESHOLD;
  const fullTrail = items.map((item) => item.label).join(" › ");

  const nodes: ReactNode[] = [];
  items.forEach((item, index) => {
    const current = index === items.length - 1;
    // Collapsed view keeps the first crumb and the last two.
    if (collapse && index > 0 && index < items.length - 2) {
      if (index === 1) {
        nodes.push(
          <li key="ellipsis" className={styles.item}>
            <span className={styles.separator} aria-hidden="true">
              ›
            </span>
            <span className={styles.ellipsis} title={fullTrail} aria-label="Collapsed breadcrumb trail">
              …
            </span>
          </li>,
        );
      }
      return;
    }
    nodes.push(
      <li key={index} className={styles.item}>
        {index > 0 && (
          <span className={styles.separator} aria-hidden="true">
            ›
          </span>
        )}
        <Crumb item={item} current={current} />
      </li>,
    );
  });

  return (
    <nav aria-label="Breadcrumb" className={className} {...rest}>
      <ol className={styles.list}>{nodes}</ol>
    </nav>
  );
}
