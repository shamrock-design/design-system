import { useMemo, useState } from "react";
import { Group } from "@visx/group";
import { Arc } from "@visx/shape";
import { ChartTooltip } from "../../lib/ChartTooltip";
import { seriesColor } from "../../lib/colors";
import { Legend } from "../../lib/Legend";
import { donutArcs } from "../../lib/math";
import type { DonutSlice, NumberFormatter } from "../../lib/types";
import styles from "./DonutChart.module.css";

export interface DonutChartProps {
  /** Slices in identity order; the fixed categorical hue follows each slice's index (or `colorIndex`). */
  slices: DonutSlice[];
  /** Diameter of the ring in pixels. */
  height: number;
  /** Present for API symmetry; the donut sizes from `height`, so this is unused here. */
  width?: number;
  /** Big machine-face number in the center. Defaults to the sum of slice values. */
  total?: number;
  /** Label-caps caption under the center total (the ref's "45 / Status Distribution"). */
  centerLabel?: string;
  /** Formats slice values in the legend and tooltip. Defaults to `String`. */
  valueFormat?: NumberFormatter;
}

/** Ring thickness as a fraction of radius (thin ring). */
const THICKNESS = 0.14;
/** Surface gap between slices (px). */
const GAP_PX = 2;

export function DonutChart({
  slices,
  height,
  total,
  centerLabel,
  valueFormat,
}: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const size = height;
  const radius = Math.max(0, size / 2 - 2);
  const innerRadius = radius * (1 - THICKNESS);
  const midRadius = (radius + innerRadius) / 2;
  const gapAngle = midRadius > 0 ? GAP_PX / midRadius : 0;

  const values = useMemo(() => slices.map((s) => Math.max(0, s.value)), [slices]);
  const arcs = useMemo(() => donutArcs(values, gapAngle), [values, gapAngle]);
  const sum = values.reduce((a, b) => a + b, 0);
  const centerTotal = total ?? sum;

  const fmt: NumberFormatter = valueFormat ?? ((n) => String(n));
  const resolveColor = (s: DonutSlice, i: number) => seriesColor(s.colorIndex ?? i);

  const activeInfo =
    active != null && slices[active] && arcs[active]
      ? (() => {
          const slice = slices[active]!;
          const arc = arcs[active]!;
          const mid = (arc.startAngle + arc.endAngle) / 2;
          const cx = size / 2 + Math.sin(mid) * midRadius;
          const cy = size / 2 - Math.cos(mid) * midRadius;
          const pct = sum > 0 ? Math.round((slice.value / sum) * 100) : 0;
          return {
            label: slice.label,
            color: resolveColor(slice, active),
            value: fmt(slice.value),
            pct,
            left: cx,
            top: cy,
          };
        })()
      : null;

  return (
    <div className={styles.root}>
      <div className={styles.plot} style={{ width: size, height: size }}>
        <svg className={styles.svg} width={size} height={size} role="img">
          <Group top={size / 2} left={size / 2}>
            {arcs.map((arc, i) => {
              if (arc.endAngle - arc.startAngle <= 0) return null;
              const slice = slices[i]!;
              const dim = active != null && active !== i;
              return (
                <Arc
                  key={slice.label}
                  className={[styles.slice, dim && styles.dim].filter(Boolean).join(" ")}
                  data-chart="donut-slice"
                  startAngle={arc.startAngle}
                  endAngle={arc.endAngle}
                  innerRadius={innerRadius}
                  outerRadius={radius}
                  fill={resolveColor(slice, i)}
                  onPointerEnter={() => setActive(i)}
                  onPointerMove={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                />
              );
            })}
          </Group>
        </svg>
        <div className={styles.center}>
          <span className={styles.total} data-chart="donut-total">
            {fmt(centerTotal)}
          </span>
          {centerLabel && <span className={styles.caption}>{centerLabel}</span>}
        </div>
        {activeInfo && (
          <ChartTooltip
            x={activeInfo.left}
            y={activeInfo.top}
            rows={[
              {
                key: "v",
                color: activeInfo.color,
                label: activeInfo.label,
                value: `${activeInfo.value} · ${activeInfo.pct}%`,
              },
            ]}
          />
        )}
      </div>
      <Legend
        className={styles.legend}
        orientation="vertical"
        items={slices.map((s, i) => ({
          key: s.label,
          color: resolveColor(s, i),
          label: s.label,
          value: fmt(s.value),
        }))}
      />
    </div>
  );
}
