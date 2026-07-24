import { useMemo, useState } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { AutoWidth } from "../../lib/AutoWidth";
import { CHART_TOKENS, bottomTickLabelProps, leftTickLabelProps } from "../../lib/axis";
import { ChartTooltip } from "../../lib/ChartTooltip";
import { seriesColor } from "../../lib/colors";
import { Legend } from "../../lib/Legend";
import { stackSegments } from "../../lib/math";
import type { BarSeries, NumberFormatter } from "../../lib/types";
import styles from "./StackedBarChart.module.css";

export interface StackedBarChartProps {
  /** Series stacked bottom→top in this order; the fixed categorical hue follows each series' index. */
  series: BarSeries[];
  /** Plot height in pixels. Width fills the container (or use `width`). */
  height: number;
  /** Explicit width in pixels; bypasses the responsive wrapper (used by tests). */
  width?: number;
  /** Category order along x. Defaults to the categories of the first series, in order. */
  categories?: string[];
  /** Formats y values for the axis and tooltip. Defaults to `String`. */
  yFormat?: NumberFormatter;
}

const MARGIN = { top: 8, right: 16, bottom: 26, left: 44 } as const;
/** Surface gap between stacked segments and adjacent bars (px). */
const GAP = 2;

export function StackedBarChart(props: StackedBarChartProps) {
  const { width, ...rest } = props;
  return <AutoWidth width={width}>{(w) => <StackedBarChartView width={w} {...rest} />}</AutoWidth>;
}

function StackedBarChartView({
  series,
  height,
  width,
  categories,
  yFormat,
}: StackedBarChartProps & { width: number }) {
  const [active, setActive] = useState<{ cat: number; seriesIdx: number } | null>(null);

  const cats = useMemo(
    () => categories ?? (series[0]?.data.map((d) => d.x) ?? []),
    [categories, series],
  );

  const valueAt = (seriesIdx: number, cat: string): number =>
    series[seriesIdx]?.data.find((d) => d.x === cat)?.y ?? 0;

  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const xScale = useMemo(
    () => scaleBand<string>({ domain: cats, range: [0, innerW], paddingInner: 0.3, paddingOuter: 0.2 }),
    [cats, innerW],
  );

  const maxTotal = useMemo(() => {
    let max = 0;
    for (const cat of cats) {
      let sum = 0;
      for (let s = 0; s < series.length; s += 1) sum += valueAt(s, cat);
      if (sum > max) max = sum;
    }
    return max;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats, series]);

  const yScale = useMemo(
    () => scaleLinear({ domain: [0, maxTotal === 0 ? 1 : maxTotal], range: [innerH, 0], nice: true }),
    [maxTotal, innerH],
  );

  const fmtY: NumberFormatter = yFormat ?? ((n) => String(n));
  const resolveColor = (s: BarSeries, i: number) => seriesColor(s.colorIndex ?? i);
  const bandwidth = xScale.bandwidth();
  const showLegend = series.length >= 2;

  const activeInfo =
    active != null
      ? (() => {
          const cat = cats[active.cat];
          const s = series[active.seriesIdx];
          if (cat == null || s == null) return null;
          const segs = stackSegments(
            series.map((_, idx) => valueAt(idx, cat)),
            (v) => yScale(v),
            GAP,
          );
          const seg = segs[active.seriesIdx];
          if (seg == null) return null;
          return {
            cat,
            label: s.label,
            value: valueAt(active.seriesIdx, cat),
            color: resolveColor(s, active.seriesIdx),
            left: MARGIN.left + (xScale(cat) ?? 0) + bandwidth / 2,
            top: MARGIN.top + seg.y,
          };
        })()
      : null;

  return (
    <div className={styles.root}>
      {showLegend && (
        <Legend items={series.map((s, i) => ({ key: s.id, color: resolveColor(s, i), label: s.label }))} />
      )}
      <div className={styles.plot}>
        <svg className={styles.svg} width={width} height={height} role="img" onPointerLeave={() => setActive(null)}>
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
              hideAxisLine
              hideTicks
              tickLabelProps={bottomTickLabelProps}
            />

            {cats.map((cat, catIdx) => {
              const x = xScale(cat) ?? 0;
              const segs = stackSegments(
                series.map((_, idx) => valueAt(idx, cat)),
                (v) => yScale(v),
                GAP,
              );
              return segs.map((seg, seriesIdx) => {
                if (seg.height <= 0) return null;
                const dim = active != null && !(active.cat === catIdx && active.seriesIdx === seriesIdx);
                const s = series[seriesIdx]!;
                return (
                  <Bar
                    key={`${cat}-${s.id}`}
                    className={[styles.segment, dim && styles.dim].filter(Boolean).join(" ")}
                    data-chart="bar-segment"
                    x={x}
                    y={seg.y}
                    width={bandwidth}
                    height={seg.height}
                    fill={resolveColor(s, seriesIdx)}
                    onPointerEnter={() => setActive({ cat: catIdx, seriesIdx })}
                    onPointerMove={() => setActive({ cat: catIdx, seriesIdx })}
                  />
                );
              });
            })}
          </Group>
        </svg>

        {activeInfo && (
          <ChartTooltip
            x={Math.min(Math.max(activeInfo.left, 60), width - 60)}
            y={activeInfo.top}
            title={activeInfo.cat}
            rows={[{ key: "v", color: activeInfo.color, label: activeInfo.label, value: fmtY(activeInfo.value) }]}
          />
        )}
      </div>
    </div>
  );
}
