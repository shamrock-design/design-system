import type { ReactNode } from "react";
import styles from "./ChartTooltip.module.css";

export interface ChartTooltipRow {
  key: string;
  /** Categorical swatch color; omit for a plain row. */
  color?: string;
  label: ReactNode;
  value: ReactNode;
}

export interface ChartTooltipProps {
  /** Left position in pixels, relative to the positioned chart container. */
  x: number;
  /** Top position in pixels, relative to the positioned chart container. */
  y: number;
  /** Optional heading (e.g. the hovered x value). */
  title?: ReactNode;
  rows: ChartTooltipRow[];
}

/**
 * The solid-ink tooltip bubble. A plain positioned `<div>` inside the chart's relative container
 * — deliberately not a portal, so it inherits tokens and stays trivially testable. Callers clamp
 * `x` to keep it inside the plot; `pointer-events: none` keeps it from stealing hover.
 */
export function ChartTooltip({ x, y, title, rows }: ChartTooltipProps) {
  return (
    <div className={styles.tooltip} style={{ left: x, top: y }} role="tooltip">
      {title != null && <span className={styles.title}>{title}</span>}
      {rows.map((row) => (
        <span key={row.key} className={styles.row}>
          {row.color && <span className={styles.swatch} style={{ background: row.color }} aria-hidden="true" />}
          <span className={styles.label}>{row.label}</span>
          <span className={styles.value}>{row.value}</span>
        </span>
      ))}
    </div>
  );
}
