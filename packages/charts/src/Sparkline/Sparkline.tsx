import { useMemo, type CSSProperties } from "react";
import { AreaClosed, LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { cssVar } from "@shamrock-design/tokens";
import { ChartFrame } from "../ChartFrame";
import { DIVERGING } from "../palette";

/** Sentiment of the trend. `neutral` renders calm/gray — color is earned, not default. */
export type SparklineTone = "neutral" | "positive" | "negative";

export interface SparklineProps {
  data: number[];
  /** viewBox width. Default 120. */
  width?: number;
  /** viewBox height. Default 32. */
  height?: number;
  tone?: SparklineTone;
  /** Fill the area under the line at low opacity. */
  showArea?: boolean;
  strokeWidth?: number;
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
}

const TONE_COLOR: Record<SparklineTone, string> = {
  neutral: cssVar["color.text.tertiary"]!,
  positive: DIVERGING.positive,
  negative: DIVERGING.negative,
};

/**
 * Axis-less inline trend line for a single metric — pairs with a KPI number, it
 * never stands alone. Nominal metrics stay gray (`neutral`); reserve the diverging
 * positive/negative colors for a trend that actually carries a verdict.
 */
export function Sparkline({
  data,
  width = 120,
  height = 32,
  tone = "neutral",
  showArea = false,
  strokeWidth = 1.5,
  ariaLabel,
  className,
  style,
}: SparklineProps) {
  const pad = strokeWidth + 1;
  const color = TONE_COLOR[tone];

  const { points, xScale, yScale } = useMemo(() => {
    const n = data.length;
    const min = n ? Math.min(...data) : 0;
    const max = n ? Math.max(...data) : 1;
    return {
      points: data.map((y, i) => ({ x: i, y })),
      xScale: scaleLinear<number>({ domain: [0, Math.max(1, n - 1)], range: [pad, width - pad] }),
      yScale: scaleLinear<number>({ domain: [min, max === min ? max + 1 : max], range: [height - pad, pad] }),
    };
  }, [data, width, height, pad]);

  return (
    <ChartFrame width={width} height={height} ariaLabel={ariaLabel} className={className} style={style}>
      {showArea && (
        <AreaClosed<{ x: number; y: number }>
          data={points}
          x={(p) => xScale(p.x) ?? 0}
          y={(p) => yScale(p.y) ?? 0}
          yScale={yScale}
          style={{ fill: color, opacity: 0.14 }}
        />
      )}
      <LinePath<{ x: number; y: number }>
        data={points}
        x={(p) => xScale(p.x) ?? 0}
        y={(p) => yScale(p.y) ?? 0}
        style={{ stroke: color, fill: "none", strokeWidth }}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </ChartFrame>
  );
}
