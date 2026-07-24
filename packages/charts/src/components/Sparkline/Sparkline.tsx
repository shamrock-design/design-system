import { toneColor } from "../../lib/colors";
import { buildLinePath } from "../../lib/math";
import type { Point } from "../../lib/math";
import type { ChartTone } from "../../lib/types";
import styles from "./Sparkline.module.css";

export interface SparklineProps {
  /** The values to trace, left→right. */
  data: number[];
  /** Width in pixels. */
  width?: number;
  /** Height in pixels. */
  height?: number;
  /**
   * Line color. `neutral` (calm ink) by default; `accent` for emphasis. A status tone is allowed
   * ONLY when a visible status label sits beside the sparkline (canon #4 — never color alone).
   */
  tone?: ChartTone;
  /** Draw a dot at the last point to anchor the current value. */
  showEndDot?: boolean;
  /** Accessible label. Omit to render the sparkline as decorative (the value is labeled elsewhere). */
  ariaLabel?: string;
}

const PAD = 2;

/**
 * A tiny inline trend line — no axes, grid, or tooltip. For KPI tiles and table cells. Single
 * series only; identity comes from context, not a legend.
 */
export function Sparkline({
  data,
  width = 96,
  height = 24,
  tone = "neutral",
  showEndDot = false,
  ariaLabel,
}: SparklineProps) {
  const n = data.length;
  const min = n > 0 ? Math.min(...data) : 0;
  const max = n > 0 ? Math.max(...data) : 1;
  const span = max - min || 1;

  const xAt = (i: number) => (n <= 1 ? PAD : PAD + (i / (n - 1)) * (width - 2 * PAD));
  const yAt = (v: number) => height - PAD - ((v - min) / span) * (height - 2 * PAD);

  const points: Point[] = data.map((v, i) => [xAt(i), yAt(v)]);
  const color = toneColor(tone);
  const lastX = xAt(n - 1);
  const lastVal = data[n - 1];

  return (
    <svg
      className={styles.svg}
      width={width}
      height={height}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path className={styles.line} d={buildLinePath(points, "monotone")} stroke={color} />
      {showEndDot && lastVal !== undefined && (
        <circle className={styles.end} cx={lastX} cy={yAt(lastVal)} r={2} fill={color} />
      )}
    </svg>
  );
}
