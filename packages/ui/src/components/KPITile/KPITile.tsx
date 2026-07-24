import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Text } from "../../primitives/Text/Text";
import styles from "./KPITile.module.css";

export type KPITileDeltaSentiment = "positive" | "negative" | "neutral";

export interface KPITileDelta {
  /** Baseline copy per date-time-format.md, e.g. "+35 min vs plan". */
  text: string;
  /** Meaning, not sign: "−2 incidents" is `positive`. Defaults to `neutral`. */
  sentiment?: KPITileDeltaSentiment;
}

export interface KPITileProps extends HTMLAttributes<HTMLElement> {
  /** Metric name — label-caps subtle eyebrow. */
  label: string;
  /** The metric itself, set in the `kpi` type role (machine face). */
  value: ReactNode;
  /**
   * Required by design (canon: no naked numbers). Omitting it warns and
   * renders a "⚠ no baseline" hint in non-production builds.
   */
  delta?: KPITileDelta;
  /** Decorative icon, top-right. */
  icon?: ReactNode;
  /** 3px accent-base top border. */
  accentBar?: boolean;
  /** Renders the tile as a real `<button>` with hover lift. */
  onClick?: MouseEventHandler<HTMLElement>;
}

const SENTIMENT_CLASS: Record<KPITileDeltaSentiment, string | undefined> = {
  positive: styles.deltaPositive,
  negative: styles.deltaNegative,
  neutral: styles.deltaNeutral,
};

/**
 * The "no naked numbers" enforcer: a KPI never renders without a baseline.
 * Glass card + hairline border + accent top bar (see apps/smoke KPI grid).
 */
export function KPITile({ label, value, delta, icon, accentBar = true, onClick, className, ...rest }: KPITileProps) {
  if (process.env.NODE_ENV !== "production" && !delta) {
    // eslint-disable-next-line no-console
    console.warn(
      `Shamrock KPITile: "${label}" has no delta — no naked numbers. ` +
        'Render the metric against a baseline (e.g. { text: "+35 min vs plan", sentiment: "negative" }).',
    );
  }

  const classes = [styles.tile, accentBar && styles.accentBar, onClick && styles.interactive, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className={styles.header}>
        <Text variant="label-caps" tone="subtle">
          {label}
        </Text>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </span>
      <Text variant="kpi">{value}</Text>
      {delta ? (
        <span className={[styles.delta, SENTIMENT_CLASS[delta.sentiment ?? "neutral"]].filter(Boolean).join(" ")}>
          {delta.text}
        </span>
      ) : process.env.NODE_ENV !== "production" ? (
        <span className={styles.noBaseline}>⚠ no baseline</span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} {...rest}>
        {content}
      </button>
    );
  }
  return (
    <div className={classes} {...rest}>
      {content}
    </div>
  );
}
