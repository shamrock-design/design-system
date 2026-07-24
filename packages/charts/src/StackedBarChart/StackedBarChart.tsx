import { useMemo, type CSSProperties } from "react";
import { Group } from "@visx/group";
import { BarStack } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { ChartFrame, type ChartMargin } from "../ChartFrame";
import { seriesColor } from "../palette";
import theme from "../chartTheme.module.css";

export interface StackedBarDatum {
  /** Category label on the x-axis. */
  label: string;
  /** One numeric entry per series key. */
  [series: string]: number | string;
}

export interface StackedBarChartProps {
  data: StackedBarDatum[];
  /** Series keys, stacked bottom→top in this order; colored cat-1..5 in the same order. */
  keys: string[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  formatValue?: (n: number) => string;
  margin?: ChartMargin;
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 16, bottom: 24, left: 40 };

/**
 * Stacked bar chart — part-to-whole across ordered categories (e.g. steps by
 * outcome, hours by phase). Sharp bars, keys stacked in declared order and
 * colored cat-1..5. For a single series this is just a bar chart.
 */
export function StackedBarChart({
  data,
  keys,
  width = 640,
  height = 260,
  showGrid = true,
  showAxes = true,
  formatValue = (n) => String(n),
  margin = DEFAULT_MARGIN,
  ariaLabel,
  className,
  style,
}: StackedBarChartProps) {
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  const { xScale, yScale } = useMemo(() => {
    const totals = data.map((d) => keys.reduce((sum, k) => sum + (Number(d[k]) || 0), 0));
    const yMax = totals.length ? Math.max(...totals) : 1;
    return {
      xScale: scaleBand<string>({ domain: data.map((d) => d.label), range: [0, innerW], padding: 0.3 }),
      yScale: scaleLinear<number>({ domain: [0, yMax === 0 ? 1 : yMax], range: [innerH, 0], nice: true }),
    };
  }, [data, keys, innerW, innerH]);

  return (
    <ChartFrame width={width} height={height} ariaLabel={ariaLabel} className={className} style={style}>
      <Group top={margin.top} left={margin.left}>
        {showGrid && <GridRows scale={yScale} width={innerW} numTicks={4} className={theme.grid} />}
        <BarStack<StackedBarDatum, string>
          data={data}
          keys={keys}
          x={(d) => d.label}
          xScale={xScale}
          yScale={yScale}
          color={(_key, index) => seriesColor(index)}
        >
          {(barStacks) =>
            barStacks.map((barStack) =>
              barStack.bars.map((bar) => (
                <rect
                  key={`${barStack.index}-${bar.index}`}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={Math.max(0, bar.height)}
                  style={{ fill: bar.color }}
                />
              )),
            )
          }
        </BarStack>
        {showAxes && (
          <>
            <AxisLeft
              scale={yScale}
              numTicks={4}
              tickFormat={(v) => formatValue(Number(v))}
              axisLineClassName={theme.axisLine}
              tickClassName={theme.tick}
              tickLabelProps={() => ({ className: theme.tickLabel, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
            />
            <AxisBottom
              scale={xScale}
              top={innerH}
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
