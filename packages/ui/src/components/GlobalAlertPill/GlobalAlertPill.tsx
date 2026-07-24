import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { Status } from "../../constants/status";
import styles from "./GlobalAlertPill.module.css";

/** Warning triangle (mirrors `@shamrock-design/icons` warn.svg — icons is a devDependency here). */
function WarnGlyph({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5 22 20.5H2L12 3.5Z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.5v.01" />
    </svg>
  );
}

function ChevronRightGlyph({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function CloseGlyph({ size = 11 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export interface GlobalAlertPillProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> {
  /** How many anomalies. Renders in the machine face. */
  count: number;
  /** What they are, e.g. "orphans detected". */
  label: string;
  /** Canonical status driving the color triad. */
  status?: Status;
  /** Required — the whole point is that it goes somewhere (the affected list). */
  onClick: () => void;
  /** When set, renders a separate sibling × button. */
  onDismiss?: () => void;
  /** Icon slot override (defaults to the warn triangle). */
  icon?: ReactNode;
}

/**
 * The persistent global anomaly affordance ("⚠ 7 orphans detected") done as an
 * unmistakable button: status colors + machine count + chevron-right.
 * Position it yourself — typically `AppShell.Topbar` `end`.
 */
export function GlobalAlertPill({
  count,
  label,
  status = "warning",
  onClick,
  onDismiss,
  icon,
  className,
  style,
  ...rest
}: GlobalAlertPillProps) {
  const vars = {
    "--sh-alert-base": `var(--sh-color-status-${status}-base)`,
    "--sh-alert-bg": `var(--sh-color-status-${status}-bg)`,
    "--sh-alert-text": `var(--sh-color-status-${status}-text)`,
  } as CSSProperties;
  return (
    <span className={styles.root} style={{ ...vars, ...style }}>
      <button
        type="button"
        className={[styles.alert, className].filter(Boolean).join(" ")}
        aria-label={`${count} ${label}`}
        onClick={onClick}
        {...rest}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon ?? <WarnGlyph />}
        </span>
        <span className={styles.count}>{count}</span>
        <span>{label}</span>
        <span className={styles.chevron}>
          <ChevronRightGlyph />
        </span>
      </button>
      {onDismiss && (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          <CloseGlyph />
        </button>
      )}
    </span>
  );
}
