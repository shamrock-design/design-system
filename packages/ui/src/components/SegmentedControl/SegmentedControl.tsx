import { useState, type CSSProperties, type ReactNode } from "react";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";
import styles from "./SegmentedControl.module.css";

export type SegmentedControlSize = "sm" | "md";

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  iconStart?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. Falls back to the first option — one segment is always active. */
  defaultValue?: string;
  /** Fires only when the selection actually changes (re-clicking the active segment is a no-op). */
  onValueChange?: (value: string) => void;
  size?: SegmentedControlSize;
  /** Disables the whole group. Individual options can set their own `disabled`. */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Single-select view switcher on Base UI ToggleGroup/Toggle. Exactly one segment
 * is always active — clicking the active segment never deselects it.
 * Arrow keys move focus between segments; Space/Enter activates.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  disabled = false,
  className,
  style,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SegmentedControlProps) {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState<string | undefined>(() => defaultValue ?? options[0]?.value);
  const current = isControlled ? value : innerValue;

  const handleValueChange = (groupValue: string[]) => {
    const next = groupValue[0];
    // Base UI reports [] when the active segment is re-clicked — swallow the deselect.
    if (next === undefined || next === current) return;
    if (!isControlled) setInnerValue(next);
    onValueChange?.(next);
  };

  return (
    <ToggleGroup
      value={current !== undefined ? [current] : []}
      onValueChange={handleValueChange}
      disabled={disabled}
      className={[styles.group, styles[size], disabled && styles.groupDisabled, className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} disabled={option.disabled} className={styles.segment}>
          {option.iconStart && <span className={styles.icon}>{option.iconStart}</span>}
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
