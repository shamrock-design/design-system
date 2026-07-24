import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./Tag.module.css";

export type TagTone = "neutral" | "accent" | "info" | "success" | "warning" | "critical";

const TONE_VARS: Record<TagTone, { bg: string; text: string; border: string }> = {
  neutral: {
    bg: "var(--sh-surface-solid)",
    text: "var(--sh-color-text-tertiary)",
    border: "var(--sh-color-border-hairline-strong)",
  },
  accent: {
    bg: "var(--sh-color-accent-subtle-bg)",
    text: "var(--sh-color-accent-subtle-text)",
    border: "var(--sh-color-accent-subtle-border)",
  },
  info: {
    bg: "var(--sh-color-status-info-bg)",
    text: "var(--sh-color-status-info-text)",
    border: "transparent",
  },
  success: {
    bg: "var(--sh-color-status-success-bg)",
    text: "var(--sh-color-status-success-text)",
    border: "transparent",
  },
  warning: {
    bg: "var(--sh-color-status-warning-bg)",
    text: "var(--sh-color-status-warning-text)",
    border: "transparent",
  },
  critical: {
    bg: "var(--sh-color-status-critical-bg)",
    text: "var(--sh-color-status-critical-text)",
    border: "transparent",
  },
};

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  /** Machine face for technical identifiers (system names, table codes). */
  mono?: boolean;
  size?: "sm" | "md";
}

/** Categorical label. Color = category, never state — status belongs to StatusBadge. */
export function Tag({ tone = "neutral", mono = false, size = "md", className, style, ...rest }: TagProps) {
  const t = TONE_VARS[tone];
  const vars = {
    "--sh-tag-bg": t.bg,
    "--sh-tag-text": t.text,
    "--sh-tag-border": t.border,
  } as CSSProperties;
  return (
    <span
      className={[styles.tag, styles[size], mono && styles.mono, className].filter(Boolean).join(" ")}
      style={{ ...vars, ...style }}
      {...rest}
    />
  );
}
