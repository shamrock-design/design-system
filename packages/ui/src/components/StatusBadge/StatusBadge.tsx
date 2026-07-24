import type { CSSProperties, HTMLAttributes } from "react";
import { STATUS_LABELS, type Status } from "../../constants/status";
import styles from "./StatusBadge.module.css";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  /** Display text override. The `status` still drives the color — never encode a different state in the label. */
  label?: string;
  size?: "sm" | "md";
  /** Pulses the dot. Defaults to true for `running`. */
  pulse?: boolean;
}

/**
 * The only sanctioned status renderer: colored dot + text label, always both.
 * Normalize foreign vocab with `mapLegacyStatus()` before passing `status`.
 */
export function StatusBadge({ status, label, size = "md", pulse, className, style, ...rest }: StatusBadgeProps) {
  const shouldPulse = pulse ?? status === "running";
  const vars = {
    "--sh-status-base": `var(--sh-color-status-${status}-base)`,
    "--sh-status-bg": `var(--sh-color-status-${status}-bg)`,
    "--sh-status-text": `var(--sh-color-status-${status}-text)`,
  } as CSSProperties;
  return (
    <span
      className={[styles.badge, styles[size], className].filter(Boolean).join(" ")}
      style={{ ...vars, ...style }}
      {...rest}
    >
      <span className={[styles.dot, shouldPulse && styles.pulse].filter(Boolean).join(" ")} aria-hidden="true" />
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}
