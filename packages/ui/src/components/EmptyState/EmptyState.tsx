import type { HTMLAttributes, ReactNode } from "react";
import { Text } from "../../primitives/Text/Text";
import styles from "./EmptyState.module.css";

export type EmptyStateSize = "sm" | "md";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** The "No <things> yet." line — sentence case, ends with a period. */
  title: string;
  /** One sentence saying how the things appear. */
  description: string;
  /** One primary action (a `<Button>`). */
  action?: ReactNode;
  /** Small illustration (from `@shamrock-design/assets` empty-states). Hidden in `sm`. */
  illustration?: ReactNode;
  /** `sm` = table-cell-height inline strip; `md` = centered region. */
  size?: EmptyStateSize;
}

/**
 * The one sanctioned empty region, per docs/guidelines/empty-states.md:
 * "No <things> yet." + how they appear + optional action. Never leave a
 * bare region — absence is information.
 */
export function EmptyState({ title, description, action, illustration, size = "md", className, ...rest }: EmptyStateProps) {
  if (process.env.NODE_ENV !== "production") {
    if (/!\s*$/.test(title)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Shamrock EmptyState: title "${title}" ends with "!" — empty-state copy is calm: sentence case, period at end, no exclamation marks.`,
      );
    }
    if (/oops/i.test(title)) {
      // eslint-disable-next-line no-console
      console.warn(`Shamrock EmptyState: title "${title}" contains "Oops" — state the fact plainly instead.`);
    }
  }

  const md = size === "md";
  return (
    <div className={[styles.root, styles[size], className].filter(Boolean).join(" ")} {...rest}>
      {illustration && (
        <div className={styles.illustration} aria-hidden="true">
          {illustration}
        </div>
      )}
      <div className={styles.copy}>
        <Text variant={md ? "lead" : "meta"} tone={md ? "primary" : "secondary"} className={styles.title}>
          {title}
        </Text>
        <Text variant={md ? "body" : "meta"} tone={md ? "secondary" : "tertiary"} className={styles.description}>
          {description}
        </Text>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
