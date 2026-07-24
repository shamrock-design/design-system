import { type CSSProperties, type ReactNode } from "react";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { ChartFrame } from "../ChartFrame";
import { seriesColor } from "../palette";
import theme from "../chartTheme.module.css";

export interface DonutSlice {
  label: string;
  value: number;
}

export interface DonutChartProps {
  data: DonutSlice[];
  width?: number;
  height?: number;
  /** Ring thickness in viewBox units. Default 28. */
  thickness?: number;
  /** Big machine-face figure shown in the hole (e.g. a total or percentage). */
  centerValue?: ReactNode;
  /** Small caption under the center value. */
  centerLabel?: ReactNode;
  /** Gap between slices, radians. Default 0.01. */
  padAngle?: number;
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Donut — a small, fixed set of parts of a whole (≤5 slices). Slices keep input
 * order (no value-sorting) so colors stay stable cat-1..5 across renders. The hole
 * carries the headline figure so the number reads without decoding the ring.
 */
export function DonutChart({
  data,
  width = 240,
  height = 240,
  thickness = 28,
  centerValue,
  centerLabel,
  padAngle = 0.01,
  ariaLabel,
  className,
  style,
}: DonutChartProps) {
  const radius = Math.max(0, Math.min(width, height) / 2 - 2);
  const innerRadius = Math.max(0, radius - thickness);

  return (
    <ChartFrame width={width} height={height} ariaLabel={ariaLabel} className={className} style={style}>
      <Group top={height / 2} left={width / 2}>
        <Pie
          data={data}
          pieValue={(d) => d.value}
          outerRadius={radius}
          innerRadius={innerRadius}
          padAngle={padAngle}
          pieSortValues={null}
        >
          {(pie) =>
            pie.arcs.map((arc, i) => {
              const path = pie.path(arc);
              return path ? <path key={arc.data.label} d={path} style={{ fill: seriesColor(i) }} /> : null;
            })
          }
        </Pie>
        {centerValue != null && (
          <text className={theme.centerValue} textAnchor="middle" dy={centerLabel != null ? "-0.1em" : "0.35em"}>
            {centerValue}
          </text>
        )}
        {centerLabel != null && (
          <text className={theme.centerLabel} textAnchor="middle" dy="1.2em">
            {centerLabel}
          </text>
        )}
      </Group>
    </ChartFrame>
  );
}
