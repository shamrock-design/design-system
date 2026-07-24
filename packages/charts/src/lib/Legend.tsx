import type { ReactNode } from "react";
import styles from "./Legend.module.css";

export interface LegendItem {
  key: string;
  /** The categorical swatch color — the only place a series' hue appears next to its name. */
  color: string;
  label: ReactNode;
  /** Optional value, set in the machine face (e.g. donut slice totals). */
  value?: ReactNode;
}

export interface LegendProps {
  items: LegendItem[];
  /** `horizontal` (default) for a row above/below a plot; `vertical` for a side list with values. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * The shared legend: an 8px colored square carries identity, the label stays in text ink (never
 * the series color — canon). Rendered whenever a chart has ≥ 2 series; a single-series chart omits
 * it (the title names the series).
 */
export function Legend({ items, orientation = "horizontal", className }: LegendProps) {
  return (
    <ul
      className={[styles.legend, orientation === "vertical" && styles.vertical, className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <li key={item.key} className={styles.item}>
          <span className={styles.swatch} style={{ background: item.color }} aria-hidden="true" />
          <span className={styles.label}>{item.label}</span>
          {item.value != null && <span className={styles.value}>{item.value}</span>}
        </li>
      ))}
    </ul>
  );
}
