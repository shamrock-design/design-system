import { Select as BaseSelect } from "@base-ui/react/select";
import { Icon } from "@shamrock-design/icons";
import styles from "./Select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  /** Plain string — it feeds keyboard typeahead and the trigger value display. */
  label: string;
  /** Second gray line under the label (the 2-line cell pattern). */
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  /** Controlled value. */
  value?: string | null;
  /** Uncontrolled initial value. */
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  size?: SelectSize;
  invalid?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Form participation via Base UI's hidden input. */
  name?: string;
  required?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

/**
 * Single-choice closed list. Trigger is dressed like TextInput; popup is the
 * overlay glass surface. Needs search? That's the future Combobox, not this.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  size = "md",
  invalid = false,
  disabled = false,
  fullWidth = false,
  name,
  required,
  id,
  className,
  ...aria
}: SelectProps) {
  return (
    <BaseSelect.Root<string, false>
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      disabled={disabled}
      name={name}
      required={required}
      id={id}
    >
      <BaseSelect.Trigger
        className={[styles.trigger, styles[size], invalid && styles.invalid, fullWidth && styles.fullWidth, className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={invalid || undefined}
        aria-label={aria["aria-label"]}
        aria-labelledby={aria["aria-labelledby"]}
      >
        <BaseSelect.Value className={styles.value} placeholder={placeholder} />
        <BaseSelect.Icon className={styles.chevron}>
          <Icon name="chevron-down" size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className={styles.positioner} sideOffset={4} alignItemWithTrigger={false}>
          <BaseSelect.Popup className={styles.popup}>
            {options.map((option) => (
              <BaseSelect.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
                className={styles.item}
              >
                <BaseSelect.ItemIndicator className={styles.indicator} keepMounted>
                  <Icon name="check" size={14} />
                </BaseSelect.ItemIndicator>
                <span className={styles.itemText}>
                  <BaseSelect.ItemText className={styles.itemLabel}>{option.label}</BaseSelect.ItemText>
                  {option.description && <span className={styles.itemDescription}>{option.description}</span>}
                </span>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
