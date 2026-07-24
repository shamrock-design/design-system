// Components
export { LineChart } from "./components/LineChart/LineChart";
export type { LineChartProps } from "./components/LineChart/LineChart";
export { StackedBarChart } from "./components/StackedBarChart/StackedBarChart";
export type { StackedBarChartProps } from "./components/StackedBarChart/StackedBarChart";
export { DonutChart } from "./components/DonutChart/DonutChart";
export type { DonutChartProps } from "./components/DonutChart/DonutChart";
export { Sparkline } from "./components/Sparkline/Sparkline";
export type { SparklineProps } from "./components/Sparkline/Sparkline";
export { MiniDonut } from "./components/MiniDonut/MiniDonut";
export type { MiniDonutProps } from "./components/MiniDonut/MiniDonut";

// Shared lib — helpers a consumer may need to match chart identity elsewhere
export { seriesColor, toneColor, CATEGORICAL_SLOTS } from "./lib/colors";
export { Legend } from "./lib/Legend";
export type { LegendProps, LegendItem } from "./lib/Legend";
export { ChartTooltip } from "./lib/ChartTooltip";
export type { ChartTooltipProps, ChartTooltipRow } from "./lib/ChartTooltip";
export { useNearestX } from "./lib/useNearestX";
export type { NearestXState } from "./lib/useNearestX";
export { stackSegments, donutArcs, nearestIndex, buildLinePath } from "./lib/math";
export type { SegmentRect, DonutArc, Point } from "./lib/math";

// Types
export type {
  LinePoint,
  LineSeries,
  BarPoint,
  BarSeries,
  DonutSlice,
  ChartTone,
  Curve,
  NumberFormatter,
  XFormatter,
} from "./lib/types";
