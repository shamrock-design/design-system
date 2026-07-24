import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { toneColor } from "../../lib/colors";
import type { ChartTone } from "../../lib/types";
import styles from "./MiniDonut.module.css";

export interface MiniDonutProps {
  /** Progress 0–100 (clamped). */
  value: number;
  /** Diameter in pixels — sized for inline/DAG-node use. */
  size?: number;
  /**
   * Progress-arc color. `neutral`/`accent`, or a status tone ONLY beside a visible status label
   * (canon #4 — never color alone).
   */
  tone?: ChartTone;
  /** Accessible label. Omit to render the ring as decorative (the value is labeled elsewhere). */
  ariaLabel?: string;
}

const TAU = Math.PI * 2;

/**
 * A 12–16px inline progress ring — the glyph used on DAG nodes and dense rows. No tooltip; the
 * value is read from its label. Sharp arc ends (canon: no rounded data ends).
 */
export function MiniDonut({ value, size = 14, tone = "accent", ariaLabel }: MiniDonutProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = Math.max(0, size / 2 - 1);
  const thickness = Math.max(2, radius * 0.4);
  const innerRadius = Math.max(0, radius - thickness);
  const endAngle = (clamped / 100) * TAU;
  const color = toneColor(tone);

  return (
    <svg
      className={styles.svg}
      width={size}
      height={size}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <Group top={size / 2} left={size / 2}>
        <Arc className={styles.track} startAngle={0} endAngle={TAU} innerRadius={innerRadius} outerRadius={radius} />
        {clamped > 0 && (
          <Arc
            data-chart="minidonut-progress"
            startAngle={0}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={radius}
            fill={color}
          />
        )}
      </Group>
    </svg>
  );
}
