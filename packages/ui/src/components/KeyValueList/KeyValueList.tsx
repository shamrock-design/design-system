import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Text } from "../../primitives/Text/Text";
import styles from "./KeyValueList.module.css";

export type KeyValueOrientation = "vertical" | "inline";

export interface KeyValueItem {
  key: string;
  /** `null`/`undefined`/`""` render as "—" (em dash, text-disabled) — absence is information. */
  value?: ReactNode;
  /** Machine face for machine values: timestamps, IDs, durations, counts. */
  mono?: boolean;
}

export interface KeyValueListProps extends HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
  /** `vertical` = stacked key-over-value rows; `inline` = "key: value" pairs with dot separators. */
  orientation?: KeyValueOrientation;
  /** Column count for the vertical grid. Ignored when inline. */
  columns?: number;
}

/** Metadata pairs (run headers, drawer facts). Metrics with baselines belong to KPITile. */
export function KeyValueList({
  items,
  orientation = "vertical",
  columns = 1,
  className,
  style,
  ...rest
}: KeyValueListProps) {
  const vars =
    orientation === "vertical" ? ({ "--sh-kv-columns": columns } as CSSProperties) : undefined;
  return (
    <dl
      className={[styles.list, styles[orientation], className].filter(Boolean).join(" ")}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {items.map((item) => {
        const missing = item.value === null || item.value === undefined || item.value === "";
        return (
          <div key={item.key} className={styles.pair}>
            {orientation === "vertical" ? (
              <Text as="dt" variant="label-caps" tone="subtle">
                {item.key}
              </Text>
            ) : (
              <dt className={styles.inlineKey}>{item.key}</dt>
            )}
            <dd
              className={[styles.value, !missing && item.mono && styles.mono, missing && styles.missing]
                .filter(Boolean)
                .join(" ")}
            >
              {missing ? "—" : item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
