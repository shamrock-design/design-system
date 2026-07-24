/** Shared data-shape contracts for every Shamrock chart. */

/** A single point on a LineChart series. `x` may be a `Date` (time scale) or a `number` (linear scale). */
export interface LinePoint {
  x: Date | number;
  y: number;
}

/** A named line series. Optional `colorIndex` pins the categorical hue to the entity (0–4 → cat-1..5). */
export interface LineSeries {
  id: string;
  label: string;
  data: LinePoint[];
  /** Pins categorical identity: 0 → cat-1 … 4 → cat-5. Defaults to the series' position. */
  colorIndex?: number;
}

/** A single bar value keyed by its category. */
export interface BarPoint {
  x: string;
  y: number;
}

/** A named bar series, stacked in series order. */
export interface BarSeries {
  id: string;
  label: string;
  data: BarPoint[];
  colorIndex?: number;
}

/** A donut slice. */
export interface DonutSlice {
  label: string;
  value: number;
  colorIndex?: number;
}

/**
 * The tone vocabulary for inline glyphs (Sparkline, MiniDonut). `neutral` is calm ink,
 * `accent` is the (themable) system accent, and the remainder mirror the canonical status
 * enum — usable ONLY when a visible status label sits beside the glyph (canon #4).
 */
export type ChartTone =
  | "neutral"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "critical"
  | "pending"
  | "running";

export type Curve = "linear" | "monotone";

/** Formats a y value for axis ticks / tooltips. */
export type NumberFormatter = (value: number) => string;

/** Formats an x value (Date | number) for axis ticks / tooltips. */
export type XFormatter = (value: Date | number) => string;
