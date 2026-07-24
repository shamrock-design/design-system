import {
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Icon } from "@shamrock-design/icons";
import styles from "./TextInput.module.css";

export type TextInputSize = "sm" | "md" | "lg";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: TextInputSize;
  /** Critical border + critical focus ring. Also sets `aria-invalid`. */
  invalid?: boolean;
  /** Decorative start slot. When `search` is set the search icon takes over this slot. */
  iconStart?: ReactNode;
  /** Decorative end slot (rendered after the clear button). */
  iconEnd?: ReactNode;
  /** Search field: search icon at start + clear × when non-empty (requires `onClear`). */
  search?: boolean;
  /** Called after the clear × empties the field. The × only renders when this is provided. */
  onClear?: () => void;
  fullWidth?: boolean;
}

/**
 * Single-line text entry. Label and help text stay OUTSIDE the component
 * (a Field wrapper arrives later) — always associate a label or `aria-label`.
 * Controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) both work.
 */
export function TextInput({
  size = "md",
  invalid = false,
  iconStart,
  iconEnd,
  search = false,
  onClear,
  fullWidth = false,
  type = "text",
  className,
  style,
  disabled,
  readOnly,
  value,
  defaultValue,
  onChange,
  ...rest
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(() => (defaultValue == null ? "" : String(defaultValue)));
  const currentValue = isControlled ? String(value ?? "") : innerValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInnerValue(event.target.value);
    onChange?.(event);
  };

  const showClear = search && onClear !== undefined && currentValue.length > 0 && !disabled && !readOnly;

  const handleClear = () => {
    const input = inputRef.current;
    if (!isControlled && input) {
      input.value = "";
      setInnerValue("");
    }
    onClear?.();
    inputRef.current?.focus();
  };

  // Clicking the frame (icons, padding) focuses the input, like a native field.
  const handleRootPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target === inputRef.current || target.closest("button")) return;
    event.preventDefault();
    inputRef.current?.focus();
  };

  const start = search ? <Icon name="search" size={size === "sm" ? 12 : 14} /> : iconStart;

  return (
    <div
      className={[
        styles.root,
        styles[size],
        invalid && styles.invalid,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onPointerDown={handleRootPointerDown}
    >
      {start && <span className={styles.slot}>{start}</span>}
      <input
        ref={inputRef}
        type={type}
        className={styles.input}
        disabled={disabled}
        readOnly={readOnly}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={handleChange}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {showClear && (
        <button type="button" className={styles.clear} aria-label="Clear" onClick={handleClear}>
          <Icon name="x" size={12} />
        </button>
      )}
      {iconEnd && <span className={styles.slot}>{iconEnd}</span>}
    </div>
  );
}
