import { useState, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "@shamrock-design/icons";
import styles from "./ChatKit.module.css";

export interface ThinkingBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Uppercase machine-face header. Defaults to "REASONING". */
  label?: string;
  /** Show the spinner and signal work-in-progress. */
  active?: boolean;
  /** Initial open state (uncontrolled). Defaults to open. */
  defaultOpen?: boolean;
  /** Optional step count shown in the machine-face metadata slot. */
  stepCount?: number;
  children?: ReactNode;
}

/**
 * Collapsible reasoning disclosure: a machine-face header (uppercase label +
 * optional spinner while `active` + step count) over a body of steps/chips.
 * Render `ThinkingStep`s or any nodes as children.
 */
export function ThinkingBlock({
  label = "REASONING",
  active = false,
  defaultOpen = true,
  stepCount,
  children,
  className,
  ...rest
}: ThinkingBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={[styles.thinking, className].filter(Boolean).join(" ")} {...rest}>
      <button
        type="button"
        className={styles.thinkingHeader}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {active ? (
          <span className={styles.spinner} role="status" aria-label="Thinking" />
        ) : (
          <Icon name="layers" size={13} aria-hidden />
        )}
        <span className={styles.thinkingLabel}>{label}</span>
        {stepCount != null && (
          <span className={styles.thinkingMeta}>
            {stepCount} {stepCount === 1 ? "step" : "steps"}
          </span>
        )}
        <span
          className={[styles.thinkingChevron, open && styles.thinkingChevronOpen].filter(Boolean).join(" ")}
          style={stepCount == null ? { marginLeft: "auto" } : undefined}
        >
          <Icon name="chevron-down" size={14} aria-hidden />
        </span>
      </button>
      {open && <div className={styles.thinkingBody}>{children}</div>}
    </div>
  );
}

export interface ThinkingStepProps extends HTMLAttributes<HTMLDivElement> {
  /** Machine-face step label, e.g. "STEP 1" or "GATE". */
  label?: ReactNode;
  children?: ReactNode;
}

/** One reasoning line inside a ThinkingBlock: mono label + explanation. */
export function ThinkingStep({ label, children, className, ...rest }: ThinkingStepProps) {
  return (
    <div className={[styles.step, className].filter(Boolean).join(" ")} {...rest}>
      {label != null && <span className={styles.stepLabel}>{label}</span>}
      <span className={styles.stepText}>{children}</span>
    </div>
  );
}
