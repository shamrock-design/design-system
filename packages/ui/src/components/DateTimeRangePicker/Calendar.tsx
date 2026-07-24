import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@shamrock-design/icons";
import { Button } from "../Button/Button";
import { TextInput } from "../TextInput/TextInput";
import { Text } from "../../primitives/Text/Text";
import {
  MONTHS_LONG,
  WEEKDAYS_MIN,
  formatTimeOfDay,
  isDayDisabled,
  isInRange,
  isSameDay,
  monthGrid,
  parseTimeString,
  selectDay,
  setTimeOfDay,
  startOfDay,
  type DateTimeRange,
} from "./rangeUtils";
import styles from "./Calendar.module.css";

export interface CalendarProps {
  value: DateTimeRange;
  /** Fires with the click-click state machine result (`selectDay`). */
  onChange: (range: DateTimeRange) => void;
  min?: Date;
  max?: Date;
  /** HH:mm TextInputs under each month (24-h per date-time-format.md). */
  showTime?: boolean;
  className?: string;
}

interface YearMonth {
  year: number;
  month: number;
}

const monthOf = (d: Date): YearMonth => ({ year: d.getFullYear(), month: d.getMonth() });
const addMonths = ({ year, month }: YearMonth, n: number): YearMonth => {
  const d = new Date(year, month + n, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
};
const inMonth = (d: Date, ym: YearMonth) => d.getFullYear() === ym.year && d.getMonth() === ym.month;
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/**
 * Dual-month range calendar (Figma Calendar ref, canon deltas removed).
 * Left pane = from-month, right pane = next month; independent ‹ › month nav at
 * the outer edges. Roving-tabindex day grid: arrows move focus, Enter selects,
 * PageUp/PageDown shift a month. All math in local time.
 */
export function Calendar({ value, onChange, min, max, showTime = false, className }: CalendarProps) {
  const today = startOfDay(new Date());
  const [visible, setVisible] = useState<YearMonth>(() => monthOf(value.from ?? value.to ?? today));
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(value.from ?? value.to ?? today));

  // Follow external range changes (quick presets) into view — render-time sync.
  const [lastFrom, setLastFrom] = useState(value.from);
  if (value.from !== lastFrom) {
    setLastFrom(value.from);
    if (value.from && !inMonth(value.from, visible) && !inMonth(value.from, addMonths(visible, 1))) {
      setVisible(monthOf(value.from));
      setFocusDate(startOfDay(value.from));
    }
  }

  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef(false);
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    cellRefs.current.get(dayKey(focusDate))?.focus();
  }, [focusDate]);

  const moveFocus = (next: Date) => {
    pendingFocus.current = true;
    setFocusDate(next);
    if (!inMonth(next, visible) && !inMonth(next, addMonths(visible, 1))) {
      // Shift so the focused month stays the nearest pane.
      const before = next.getTime() < new Date(visible.year, visible.month, 1).getTime();
      setVisible(before ? monthOf(next) : addMonths(monthOf(next), -1));
    }
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const d = focusDate;
    switch (event.key) {
      case "ArrowLeft":
        moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
        break;
      case "ArrowRight":
        moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
        break;
      case "ArrowUp":
        moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
        break;
      case "ArrowDown":
        moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
        break;
      case "PageUp":
        moveFocus(new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()));
        break;
      case "PageDown":
        moveFocus(new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()));
        break;
      case "Enter":
      case " ":
        if (!isDayDisabled(d, min, max)) onChange(selectDay(value, d));
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const handleTimeCommit = (endpoint: "from" | "to", text: string) => {
    const current = value[endpoint];
    if (!current) return;
    const parsed = parseTimeString(text);
    if (!parsed) return;
    const next = setTimeOfDay(current, parsed.hours, parsed.minutes);
    onChange(endpoint === "from" ? { from: next, to: value.to } : { from: value.from, to: next });
  };

  const renderPane = (ym: YearMonth, side: "left" | "right") => {
    const label = `${MONTHS_LONG[ym.month]} ${ym.year}`;
    const weeks = monthGrid(ym.year, ym.month);
    const timeEndpoint = side === "left" ? "from" : "to";
    const timeValue = value[timeEndpoint];
    return (
      <div className={styles.pane}>
        <div className={styles.paneHeader}>
          {side === "left" ? (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Previous month"
              onClick={() => setVisible((v) => addMonths(v, -1))}
            >
              <Icon name="chevron-right" className={styles.flip} />
            </Button>
          ) : (
            <span className={styles.navSpacer} aria-hidden="true" />
          )}
          <Text variant="meta" tone="secondary" className={styles.monthLabel}>
            {label}
          </Text>
          {side === "right" ? (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Next month"
              onClick={() => setVisible((v) => addMonths(v, 1))}
            >
              <Icon name="chevron-right" />
            </Button>
          ) : (
            <span className={styles.navSpacer} aria-hidden="true" />
          )}
        </div>
        <div role="grid" aria-label={label} className={styles.grid} onKeyDown={handleGridKeyDown}>
          <div role="row" className={styles.weekRow}>
            {WEEKDAYS_MIN.map((wd, i) => (
              <span key={i} role="columnheader" className={styles.weekday} aria-label={label}>
                {wd}
              </span>
            ))}
          </div>
          {weeks.map((week, w) => (
            <div key={w} role="row" className={styles.weekRow}>
              {week.map((day) => {
                const other = !inMonth(day, ym);
                const isFrom = isSameDay(day, value.from);
                const isTo = isSameDay(day, value.to);
                const endpoint = isFrom || isTo;
                const weekend = day.getDay() === 0 || day.getDay() === 6;
                const disabled = isDayDisabled(day, min, max);
                const focusable = !other && isSameDay(day, focusDate);
                return (
                  <button
                    key={dayKey(day)}
                    type="button"
                    role="gridcell"
                    ref={(node) => {
                      if (other) return;
                      if (node) cellRefs.current.set(dayKey(day), node);
                      else cellRefs.current.delete(dayKey(day));
                    }}
                    tabIndex={focusable ? 0 : -1}
                    disabled={disabled}
                    aria-selected={endpoint || undefined}
                    aria-current={isSameDay(day, today) ? "date" : undefined}
                    aria-label={`${MONTHS_LONG[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`}
                    onFocus={() => {
                      // Keep the roving active-descendant in sync when a cell gains
                      // focus by any means (Tab, programmatic .focus(), arrow nav) —
                      // otherwise Enter would act on a stale focusDate.
                      if (!isSameDay(day, focusDate)) setFocusDate(startOfDay(day));
                    }}
                    className={[
                      styles.day,
                      other && styles.otherMonth,
                      weekend && !endpoint && styles.weekend,
                      endpoint && styles.endpoint,
                      !endpoint && isInRange(day, value) && styles.inRange,
                      isSameDay(day, today) && styles.today,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      setFocusDate(startOfDay(day));
                      onChange(selectDay(value, day));
                    }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {showTime && (
          <div className={styles.timeRow}>
            <Text variant="micro" tone="subtle" className={styles.timeLabel}>
              {timeEndpoint === "from" ? "From" : "To"}
            </Text>
            <TextInput
              key={timeValue ? timeValue.getTime() : "empty"}
              size="sm"
              defaultValue={timeValue ? formatTimeOfDay(timeValue) : ""}
              placeholder="HH:mm"
              disabled={!timeValue}
              aria-label={timeEndpoint === "from" ? "From time" : "To time"}
              className={styles.timeInput}
              onBlur={(e) => handleTimeCommit(timeEndpoint, e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTimeCommit(timeEndpoint, e.currentTarget.value);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(" ")}>
      {renderPane(visible, "left")}
      <div className={styles.divider} aria-hidden="true" />
      {renderPane(addMonths(visible, 1), "right")}
    </div>
  );
}
