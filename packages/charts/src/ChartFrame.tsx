import type { ReactNode, CSSProperties } from "react";
import styles from "./chartTheme.module.css";

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartFrameProps {
  /** viewBox width — the internal coordinate space, not a pixel size. */
  width: number;
  /** viewBox height. */
  height: number;
  /** Required non-visual summary; the chart is exposed as a single role="img". */
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Responsive SVG frame shared by every chart. A fixed viewBox gives a stable
 * coordinate system (deterministic in tests, no measurement pass) while the SVG
 * scales to the container width preserving aspect ratio. The whole graphic is a
 * single labelled image for assistive tech; render the underlying numbers as real
 * text nearby (canon: no naked numbers).
 */
export function ChartFrame({ width, height, ariaLabel, className, style, children }: ChartFrameProps) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={[styles.svg, className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </svg>
  );
}

export const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 12, bottom: 24, left: 40 };
