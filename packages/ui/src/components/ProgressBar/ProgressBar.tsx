import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { STATUS_LABELS, type Status } from "../../constants/status";
import styles from "./ProgressBar.module.css";

export type ProgressBarSize = "sm" | "md";

export interface ProgressSegment {
  /** Portion of the whole (0–100). Segments render in order. */
  value: number;
  status: Status;
}

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Progress 0–100 (clamped). Ignored when `segments` is set. */
  value?: number;
  /** Machine baseline copy, right-aligned above the track ("31 of 34 done"). */
  label?: ReactNode;
  /** Fill color from this status's base. Defaults to `accent-base`. */
  status?: Status;
  /** Track height: sm 4px / md 6px. */
  size?: ProgressBarSize;
  /** Pass/fail proportion bar — ordered segments with 2px surface gaps. */
  segments?: ProgressSegment[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/**
 * Determinate progress, or a segmented pass/fail proportion bar (Cognito
 * execution report). Track = surface-faint + hairline; fill = accent-base or a
 * status base. Always determinate — for busy states use a spinner.
 */
export function ProgressBar({
  value = 0,
  label,
  status,
  size = "md",
  segments,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const isSegmented = segments != null && segments.length > 0;
  const now = isSegmented
    ? clamp(segments.reduce((sum, seg) => sum + Math.max(0, seg.value), 0))
    : clamp(value);

  const ariaValueText = isSegmented
    ? segments.map((seg) => `${clamp(seg.value)}% ${STATUS_LABELS[seg.status]}`).join(", ")
    : undefined;

  const labelIsString = typeof label === "string";
  const fillVars = !isSegmented
    ? ({
        "--sh-progress-fill": status ? `var(--sh-color-status-${status}-base)` : "var(--sh-color-accent-base)",
      } as CSSProperties)
    : undefined;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} style={style} {...rest}>
      {label != null && <span className={styles.label}>{label}</span>}
      <div
        role="progressbar"
        aria-valuenow={Math.round(now)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={ariaValueText}
        aria-label={labelIsString ? (label as string) : undefined}
        className={[styles.track, styles[size]].filter(Boolean).join(" ")}
        style={fillVars}
      >
        {isSegmented ? (
          <div className={styles.segments}>
            {segments.map((seg, i) => (
              <span
                key={i}
                className={styles.segment}
                style={
                  {
                    "--sh-progress-fill": `var(--sh-color-status-${seg.status}-base)`,
                    flexGrow: Math.max(0, seg.value),
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : (
          <span className={styles.fill} style={{ width: `${now}%` }} />
        )}
      </div>
    </div>
  );
}
