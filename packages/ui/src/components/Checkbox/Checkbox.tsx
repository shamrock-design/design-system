import type { CSSProperties, ReactNode } from "react";
import { Checkbox as BaseCheckbox, type CheckboxRootProps } from "@base-ui/react/checkbox";
import styles from "./Checkbox.module.css";

export type CheckboxSize = "sm" | "md";

export interface CheckboxProps extends Omit<CheckboxRootProps, "className" | "style" | "render" | "children"> {
  size?: CheckboxSize;
  /** Label content. Clicking it toggles the box — never render a bare, unlabeled checkbox. */
  children?: ReactNode;
  /** Applied to the outer label. */
  className?: string;
  /** Applied to the outer label. */
  style?: CSSProperties;
}

/**
 * Base UI checkbox with an accent-filled checked state and mixed (`indeterminate`)
 * support. The whole label row is the hit target; Space toggles.
 */
export function Checkbox({ size = "md", children, className, style, disabled, indeterminate, ...rest }: CheckboxProps) {
  return (
    <label
      className={[styles.root, styles[size], disabled && styles.disabled, className].filter(Boolean).join(" ")}
      style={style}
    >
      <BaseCheckbox.Root className={styles.box} disabled={disabled} indeterminate={indeterminate} {...rest}>
        <BaseCheckbox.Indicator className={styles.indicator}>
          {indeterminate ? (
            <svg
              className={styles.mark}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2.5 6h7" />
            </svg>
          ) : (
            <svg
              className={styles.mark}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 6.5L5 9l4.5-6" />
            </svg>
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children != null && <span className={styles.label}>{children}</span>}
    </label>
  );
}
