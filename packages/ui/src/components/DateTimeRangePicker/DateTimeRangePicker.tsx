import { useState, type CSSProperties } from "react";
import { Popover } from "@base-ui/react/popover";
import { Icon } from "@shamrock-design/icons";
import { Button } from "../Button/Button";
import { Text } from "../../primitives/Text/Text";
import { Calendar } from "./Calendar";
import {
  DEFAULT_QUICK_RANGES,
  clampToMinMax,
  formatRange,
  isSameDay,
  shiftRange,
  type DateTimeRange,
  type QuickRange,
  type RangeStepper,
} from "./rangeUtils";
import styles from "./DateTimeRangePicker.module.css";

export type { DateTimeRange, QuickRange, RangeStepper } from "./rangeUtils";

export type DateTimeRangePickerSize = "sm" | "md";

export interface DateTimeRangePickerProps {
  value: DateTimeRange;
  onChange: (range: DateTimeRange) => void;
  /** Quick-range column. Default: This week / Last 2 weeks / This month. */
  quickRanges?: QuickRange[];
  /** HH:mm inputs under each calendar month (24-h per guideline). */
  showTime?: boolean;
  /** ‹ › shift the whole range by ±1 day, ±7 days, or ± its own length. */
  stepper?: RangeStepper;
  min?: Date;
  max?: Date;
  size?: DateTimeRangePickerSize;
  disabled?: boolean;
  /** Placeholder shown in the field when the range is empty. */
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/** Would the stepped range cross a min/max boundary? Then refuse the shift. */
function withinBounds(range: DateTimeRange, min?: Date, max?: Date): boolean {
  if (min && range.from && range.from.getTime() < min.getTime()) return false;
  if (max && range.to && range.to.getTime() > max.getTime()) return false;
  return true;
}

/** Does `range` structurally equal one produced by `preset.resolve(now)`? */
function matchesQuick(range: DateTimeRange, preset: QuickRange, now: Date): boolean {
  const resolved = preset.resolve(now);
  return isSameDay(range.from, resolved.from) && isSameDay(range.to, resolved.to);
}

/**
 * The RapidX context-bar range control: stepper ‹ ›, a machine-face formatted
 * field opening a dual-month calendar popover with quick presets and
 * Apply/Cancel commit. Standard template — apply it everywhere a screen filters
 * by a time window. Timezone is labeled once at page level (date-time-format.md).
 */
export function DateTimeRangePicker({
  value,
  onChange,
  quickRanges = DEFAULT_QUICK_RANGES,
  showTime = false,
  stepper = "week",
  min,
  max,
  size = "md",
  disabled = false,
  placeholder = "Select range",
  className,
  style,
  "aria-label": ariaLabel = "Selected date range",
}: DateTimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateTimeRange>(value);

  // Seed the draft from committed value each time the popover opens.
  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const label = formatRange(value, { showTime }) || placeholder;
  const isEmpty = !value.from && !value.to;

  const step = (dir: -1 | 1) => {
    if (disabled || !value.from || !value.to) return;
    if (stepper === "cycle" && (!value.from || !value.to)) return;
    const next = shiftRange(value, stepper, dir);
    if (!withinBounds(next, min, max)) return;
    onChange(next);
  };

  const applyQuick = (preset: QuickRange) => {
    const resolved = preset.resolve(new Date());
    setDraft({
      from: resolved.from ? clampToMinMax(resolved.from, min, max) : null,
      to: resolved.to ? clampToMinMax(resolved.to, min, max) : null,
    });
  };

  const commit = () => {
    onChange(draft);
    setOpen(false);
  };

  const now = new Date();
  const stepDisabled = disabled || !value.from || !value.to;

  return (
    <div
      className={[styles.root, styles[size], disabled && styles.disabled, className].filter(Boolean).join(" ")}
      style={style}
    >
      <Button
        variant="outline"
        size={size}
        iconOnly
        aria-label="Previous period"
        disabled={stepDisabled}
        onClick={() => step(-1)}
        className={styles.stepper}
      >
        <Icon name="chevron-right" className={styles.flip} />
      </Button>

      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger
          className={[styles.field, isEmpty && styles.fieldEmpty].filter(Boolean).join(" ")}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          <Text variant="machine" tone={isEmpty ? "subtle" : "machine"} className={styles.fieldValue}>
            {label}
          </Text>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={4} className={styles.positioner}>
            <Popover.Popup className={styles.popup}>
              <div className={styles.body}>
                {quickRanges.length > 0 && (
                  <div className={styles.quick} role="group" aria-label="Quick ranges">
                    {quickRanges.map((preset) => {
                      const active = matchesQuick(draft, preset, now);
                      return (
                        <Button
                          key={preset.label}
                          variant={active ? "outline" : "ghost"}
                          size="sm"
                          fullWidth
                          className={styles.quickButton}
                          aria-pressed={active}
                          onClick={() => applyQuick(preset)}
                        >
                          {preset.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
                <Calendar value={draft} onChange={setDraft} min={min} max={max} showTime={showTime} />
              </div>
              <div className={styles.footer}>
                <Popover.Close
                  render={
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  }
                />
                <Button variant="primary" size="sm" onClick={commit}>
                  Apply
                </Button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Button
        variant="outline"
        size={size}
        iconOnly
        aria-label="Next period"
        disabled={stepDisabled}
        onClick={() => step(1)}
        className={styles.stepper}
      >
        <Icon name="chevron-right" />
      </Button>

      <Button
        variant="outline"
        size={size}
        iconOnly
        aria-label="Open calendar"
        disabled={disabled}
        onClick={() => handleOpenChange(!open)}
        className={styles.stepper}
      >
        <Icon name="clock" />
      </Button>
    </div>
  );
}
