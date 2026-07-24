import { useMemo } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Circle, Line } from "@visx/shape";
import { AutoWidth } from "../../lib/AutoWidth";
import { CHART_TOKENS, bottomTickLabelProps, leftTickLabelProps } from "../../lib/axis";
import { ChartTooltip } from "../../lib/ChartTooltip";
import { seriesColor } from "../../lib/colors";
import { Legend } from "../../lib/Legend";
import { buildLinePath } from "../../lib/math";
import type { Point } from "../../lib/math";
import type { Curve, LineSeries, NumberFormatter, XFormatter } from "../../lib/types";
import { useNearestX } from "../../lib/useNearestX";
import styles from "./LineChart.module.css";

export interface LineChartProps {
  /** Series in identity order — the fixed categorical hue follows each series' index (or its `colorIndex`). */
  series: LineSeries[];
  /** Plot height in pixels. Width fills the container (or use `width` to pin it). */
  height: number;
  /** Explicit width in pixels; bypasses the responsive wrapper (used by tests). */
  width?: number;
  /** Formats y values for the axis and tooltip. Defaults to `String`. */
  yFormat?: NumberFormatter;
  /** Formats x values for the axis and tooltip. Defaults to a short date (time x) or `String`. */
  xFormat?: XFormatter;
  /** Draw a small dot at every data point. */
  showDots?: boolean;
  /** Interpolation between points. `monotone` smooths without overshooting the data. */
  curve?: Curve;
}

const MARGIN = { top: 8, right: 16, bottom: 26, left: 44 } as const;

const toNum = (x: Date | number): number => (x instanceof Date ? x.getTime() : x);

export function LineChart(props: LineChartProps) {
  const { width, ...rest } = props;
  return <AutoWidth width={width}>{(w) => <LineChartView width={w} {...rest} />}</AutoWidth>;
}

function LineChartView({
  series,
  height,
  width,
  yFormat,
  xFormat,
  showDots = false,
  curve = "linear",
}: LineChartProps & { width: number }) {
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const isTime = useMemo(() => series.some((s) => s.data.some((d) => d.x instanceof Date)), [series]);

  const allX = useMemo(() => series.flatMap((s) => s.data.map((d) => toNum(d.x))), [series]);
  const allY = useMemo(() => series.flatMap((s) => s.data.map((d) => d.y)), [series]);
  const sortedX = useMemo(() => Array.from(new Set(allX)).sort((a, b) => a - b), [allX]);

  const { xScale, xPx } = useMemo(() => {
    const domain: [number, number] =
      sortedX.length > 0 ? [sortedX[0]!, sortedX[sortedX.length - 1]!] : [0, 1];
    if (isTime) {
      const s = scaleTime({ domain: [new Date(domain[0]), new Date(domain[1])], range: [0, innerW] });
      return { xScale: s, xPx: (x: Date | number): number => s(x instanceof Date ? x : new Date(toNum(x))) ?? 0 };
    }
    const s = scaleLinear({ domain, range: [0, innerW] });
    return { xScale: s, xPx: (x: Date | number): number => s(toNum(x)) ?? 0 };
  }, [sortedX, isTime, innerW]);

  const yScale = useMemo(() => {
    const maxY = allY.length > 0 ? Math.max(0, ...allY) : 1;
    return scaleLinear({ domain: [0, maxY === 0 ? 1 : maxY], range: [innerH, 0], nice: true });
  }, [allY, innerH]);

  const xPixels = useMemo(() => sortedX.map((v) => xPx(v)), [sortedX, xPx]);

  const { index, onPointerMove, onPointerLeave } = useNearestX(xPixels);
  const activeX = index != null ? sortedX[index] : undefined;

  const fmtY: NumberFormatter = yFormat ?? ((n) => String(n));
  const fmtX: XFormatter =
    xFormat ??
    (isTime
      ? (v) => new Date(toNum(v)).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : (v) => String(toNum(v)));

  const resolveColor = (s: LineSeries, i: number) => seriesColor(s.colorIndex ?? i);

  // Values at the hovered x, per series.
  const activeRows =
    activeX != null
      ? series
          .map((s, i) => {
            const datum = s.data.find((d) => toNum(d.x) === activeX);
            if (!datum) return null;
            return { id: s.id, label: s.label, color: resolveColor(s, i), y: datum.y };
          })
          .filter((r): r is NonNullable<typeof r> => r != null)
      : [];

  const activePx = activeX != null ? xPx(activeX) : 0;
  const showLegend = series.length >= 2;
  const tooltipTop = activeRows.length > 0 ? MARGIN.top + Math.min(...activeRows.map((r) => yScale(r.y))) : 0;
  const tooltipLeft = Math.min(Math.max(MARGIN.left + activePx, 60), width - 60);

  return (
    <div className={styles.root}>
      {showLegend && (
        <Legend items={series.map((s, i) => ({ key: s.id, color: resolveColor(s, i), label: s.label }))} />
      )}
      <div className={styles.plot}>
        <svg className={styles.svg} width={width} height={height} role="img">
          <Group left={MARGIN.left} top={MARGIN.top}>
            <GridRows scale={yScale} width={innerW} stroke={CHART_TOKENS.grid} strokeWidth={1} numTicks={4} />
            <AxisLeft
              scale={yScale}
              numTicks={4}
              hideAxisLine
              hideTicks
              tickFormat={(v) => fmtY(Number(v))}
              tickLabelProps={leftTickLabelProps}
            />
            <AxisBottom
              scale={xScale}
              top={innerH}
              numTicks={Math.min(6, Math.max(2, sortedX.length))}
              hideAxisLine
              hideTicks
              tickFormat={(v) => fmtX(isTime ? (v as Date) : Number(v))}
              tickLabelProps={bottomTickLabelProps}
            />

            {series.map((s, i) => {
              const points: Point[] = s.data.map((d) => [xPx(d.x), yScale(d.y)]);
              return (
                <path
                  key={s.id}
                  className={styles.line}
                  data-chart="line-path"
                  data-series-id={s.id}
                  d={buildLinePath(points, curve)}
                  stroke={resolveColor(s, i)}
                />
              );
            })}

            {showDots &&
              series.map((s, i) =>
                s.data.map((d, j) => (
                  <Circle
                    key={`${s.id}-${j}`}
                    className={styles.dot}
                    cx={xPx(d.x)}
                    cy={yScale(d.y)}
                    r={3}
                    fill={resolveColor(s, i)}
                  />
                )),
              )}

            {activeX != null && (
              <>
                <Line
                  className={styles.crosshair}
                  from={{ x: activePx, y: 0 }}
                  to={{ x: activePx, y: innerH }}
                />
                {activeRows.map((r) => (
                  <Circle key={r.id} className={styles.marker} cx={activePx} cy={yScale(r.y)} r={4} fill={r.color} />
                ))}
              </>
            )}

            <rect
              className={styles.overlay}
              width={innerW}
              height={innerH}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            />
          </Group>
        </svg>

        {activeRows.length > 0 && activeX != null && (
          <ChartTooltip
            x={tooltipLeft}
            y={tooltipTop}
            title={fmtX(isTime ? new Date(activeX) : activeX)}
            rows={activeRows.map((r) => ({ key: r.id, color: r.color, label: r.label, value: fmtY(r.y) }))}
          />
        )}
      </div>
    </div>
  );
}
