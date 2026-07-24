import { useMemo, type CSSProperties } from "react";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { ChartFrame, type ChartMargin } from "../ChartFrame";
import { seriesColor } from "../palette";
import theme from "../chartTheme.module.css";

export interface LinePoint {
  x: number;
  y: number;
}

export interface LineSeries {
  /** Series name — used for the color assignment order and the legend/label. */
  name: string;
  points: LinePoint[];
}

export interface LineChartProps {
  series: LineSeries[];
  /** viewBox width (internal coordinate space). Default 720. */
  width?: number;
  /** viewBox height. Default 240. */
  height?: number;
  /** Force the y-domain; otherwise [0, max] (nominal baselines start at zero). */
  yDomain?: [number, number];
  showGrid?: boolean;
  showAxes?: boolean;
  formatX?: (x: number) => string;
  formatY?: (y: number) => string;
  strokeWidth?: number;
  margin?: ChartMargin;
  /** Required non-visual summary. */
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 16, bottom: 24, left: 40 };

/**
 * Multi-series line chart — the default for a value tracked over an ordered x
 * (time, step index). Straight segments, hairline grid, machine-face axis labels.
 * Colors assign cat-1..5 in series order and never encode state.
 */
export function LineChart({
  series,
  width = 720,
  height = 240,
  yDomain,
  showGrid = true,
  showAxes = true,
  formatX = (x) => String(x),
  formatY = (y) => String(y),
  strokeWidth = 2,
  margin = DEFAULT_MARGIN,
  ariaLabel,
  className,
  style,
}: LineChartProps) {
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  const { xScale, yScale } = useMemo(() => {
    const xs = series.flatMap((s) => s.points.map((p) => p.x));
    const ys = series.flatMap((s) => s.points.map((p) => p.y));
    const xMin = xs.length ? Math.min(...xs) : 0;
    const xMax = xs.length ? Math.max(...xs) : 1;
    const yMax = ys.length ? Math.max(...ys) : 1;
    return {
      xScale: scaleLinear<number>({ domain: [xMin, xMax], range: [0, innerW] }),
      yScale: scaleLinear<number>({
        domain: yDomain ?? [0, yMax === 0 ? 1 : yMax],
        range: [innerH, 0],
        nice: true,
      }),
    };
  }, [series, innerW, innerH, yDomain]);

  return (
    <ChartFrame width={width} height={height} ariaLabel={ariaLabel} className={className} style={style}>
      <Group top={margin.top} left={margin.left}>
        {showGrid && <GridRows scale={yScale} width={innerW} numTicks={4} className={theme.grid} />}
        {series.map((s, i) => (
          <LinePath<LinePoint>
            key={s.name}
            data={s.points}
            x={(p) => xScale(p.x) ?? 0}
            y={(p) => yScale(p.y) ?? 0}
            style={{ stroke: seriesColor(i), fill: "none", strokeWidth }}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {showAxes && (
          <>
            <AxisLeft
              scale={yScale}
              numTicks={4}
              tickFormat={(v) => formatY(Number(v))}
              axisLineClassName={theme.axisLine}
              tickClassName={theme.tick}
              tickLabelProps={() => ({ className: theme.tickLabel, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
            />
            <AxisBottom
              scale={xScale}
              top={innerH}
              numTicks={6}
              tickFormat={(v) => formatX(Number(v))}
              axisLineClassName={theme.axisLine}
              tickClassName={theme.tick}
              tickLabelProps={() => ({ className: theme.tickLabel, textAnchor: "middle", dy: "0.71em" })}
            />
          </>
        )}
      </Group>
    </ChartFrame>
  );
}
