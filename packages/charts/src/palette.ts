import { cssVar } from "@shamrock-design/tokens";

/**
 * Token-fed chart palette. Every value is a `var(--sh-color-chart-*)` expression,
 * so charts stay colorless-core-compliant and theme-invariant (the chart palette
 * lives in core.css, never in a theme file — see semantic/color.json chart block).
 *
 * Rule (token $description): categorical series colors assign in FIXED order 1..5
 * and NEVER encode state. Status stays with the status vocabulary, not here.
 */

/** The five categorical series colors, in canonical assignment order. */
export const CATEGORICAL = [
  cssVar["color.chart.cat.1"],
  cssVar["color.chart.cat.2"],
  cssVar["color.chart.cat.3"],
  cssVar["color.chart.cat.4"],
  cssVar["color.chart.cat.5"],
] as const;

/** Light→dark single-hue ramp for ordered magnitude (one series, sequential). */
export const SEQUENTIAL = [
  cssVar["color.chart.seq.1"],
  cssVar["color.chart.seq.2"],
  cssVar["color.chart.seq.3"],
  cssVar["color.chart.seq.4"],
  cssVar["color.chart.seq.5"],
] as const;

/** Two-ended scale around a neutral middle (e.g. variance vs plan). */
export const DIVERGING = {
  positive: cssVar["color.chart.diverging.positive"],
  negative: cssVar["color.chart.diverging.negative"],
  mid: cssVar["color.chart.diverging.mid"],
} as const;

export const CHART_GRID = cssVar["color.chart.grid"];
export const CHART_AXIS = cssVar["color.chart.axis"];

/**
 * Categorical color for the i-th series (0-based). Wraps the 5-color ramp; a chart
 * with more than five series should be rethought before it reaches the sixth color.
 */
export function seriesColor(i: number): string {
  const n = CATEGORICAL.length;
  return CATEGORICAL[((i % n) + n) % n]!;
}
