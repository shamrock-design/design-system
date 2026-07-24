/** Chart color tokens, resolved as CSS custom-property references for SVG attributes. */
export const CHART_TOKENS = {
  grid: "var(--sh-color-chart-grid)",
  axis: "var(--sh-color-chart-axis)",
  surface: "var(--sh-color-surface-solid)",
  ink: "var(--sh-color-text-primary)",
} as const;

const AXIS_LABEL_BASE = {
  fill: CHART_TOKENS.axis,
  fontFamily: "var(--sh-font-family-machine)",
  fontSize: 10,
} as const;

/** Tick-label props for a left (value) axis: machine face, chart-axis ink, right-aligned. */
export function leftTickLabelProps() {
  return { ...AXIS_LABEL_BASE, textAnchor: "end" as const, dx: -4, dy: 3 };
}

/** Tick-label props for a bottom (category / time) axis: machine face, centered under the tick. */
export function bottomTickLabelProps() {
  return { ...AXIS_LABEL_BASE, textAnchor: "middle" as const, dy: 4 };
}
