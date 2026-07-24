/**
 * Pure date math for DateTimeRangePicker. Hand-rolled on native Date, ALL in
 * local time — no library, no UTC conversion. The consumer labels the operating
 * timezone once at page level per docs/guidelines/date-time-format.md.
 */

export interface DateTimeRange {
  from: Date | null;
  to: Date | null;
}

export type RangeStepper = "day" | "week" | "cycle";

export interface QuickRange {
  label: string;
  resolve: (now: Date) => DateTimeRange;
}

const DAY_MS = 86_400_000;

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** Week starts Monday. Single letters for column rhythm (canon: no two-letter TH). */
export const WEEKDAYS_MIN = ["M", "T", "W", "T", "F", "S", "S"] as const;

/** Midnight (local) of the same calendar day. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Shift by whole days, preserving the time of day (local). */
export function addDays(d: Date, days: number): Date {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + days,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
  );
}

/** Monday 00:00 of the week containing `d` (week starts Monday). */
export function startOfWeek(d: Date): Date {
  const offset = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
  return addDays(startOfDay(d), -offset);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

/** Whole calendar days from `b` to `a` (positive when `a` is later). */
export function differenceInCalendarDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY_MS);
}

/**
 * 6×7 grid of Date cells (always 42) for the given month, weeks starting Monday.
 * Leading/trailing cells belong to the adjacent months.
 */
export function monthGrid(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const start = startOfWeek(first);
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w += 1) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d += 1) row.push(addDays(start, w * 7 + d));
    weeks.push(row);
  }
  return weeks;
}

/** Day-granularity containment, inclusive of both endpoints. False unless both are set. */
export function isInRange(day: Date, range: DateTimeRange): boolean {
  if (!range.from || !range.to) return false;
  const t = startOfDay(day).getTime();
  return t >= startOfDay(range.from).getTime() && t <= startOfDay(range.to).getTime();
}

/** Clamp a single instant into [min, max]. */
export function clampToMinMax(date: Date, min?: Date, max?: Date): Date {
  if (min && date.getTime() < min.getTime()) return new Date(min.getTime());
  if (max && date.getTime() > max.getTime()) return new Date(max.getTime());
  return date;
}

/** Day-granularity min/max check used to disable day cells. */
export function isDayDisabled(day: Date, min?: Date, max?: Date): boolean {
  const t = startOfDay(day).getTime();
  if (min && t < startOfDay(min).getTime()) return true;
  if (max && t > startOfDay(max).getTime()) return true;
  return false;
}

/**
 * Shift the whole range by the stepper unit: ±1 day, ±7 days, or (cycle) ± its
 * own inclusive length in days. Times of day are preserved. `cycle` with an
 * incomplete range is a no-op.
 */
export function shiftRange(range: DateTimeRange, stepper: RangeStepper, dir: -1 | 1): DateTimeRange {
  let days: number;
  if (stepper === "day") days = 1;
  else if (stepper === "week") days = 7;
  else {
    if (!range.from || !range.to) return { from: range.from, to: range.to };
    days = differenceInCalendarDays(range.to, range.from) + 1;
  }
  return {
    from: range.from ? addDays(range.from, days * dir) : null,
    to: range.to ? addDays(range.to, days * dir) : null,
  };
}

/** `day` at the time-of-day of `source` (midnight when source is null). */
function withTimeOf(day: Date, source: Date | null): Date {
  if (!source) return startOfDay(day);
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds(),
  );
}

/**
 * Click-click selection state machine. First click sets `from` (clears `to`);
 * a second click on the same-or-later day sets `to`; clicking before `from`
 * restarts. Existing endpoint times of day are preserved on re-pick.
 */
export function selectDay(range: DateTimeRange, day: Date): DateTimeRange {
  if (range.from && !range.to && differenceInCalendarDays(day, range.from) >= 0) {
    return { from: range.from, to: withTimeOf(day, range.to) };
  }
  return { from: withTimeOf(day, range.from), to: null };
}

/** Merge an HH:mm time of day into a date, keeping its calendar day. */
export function setTimeOfDay(date: Date, hours: number, minutes: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

/** Strict 24-h "H:mm"/"HH:mm" parser. Null on anything else. */
export function parseTimeString(text: string): { hours: number; minutes: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** 24-h "HH:mm" per date-time-format.md. */
export function formatTimeOfDay(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export interface FormatRangeOptions {
  showTime?: boolean;
  /** Reference "now" for same-year elision. Defaults to the current time. */
  now?: Date;
}

function formatEndpoint(date: Date, showTime: boolean, now: Date): string {
  const sameYear = date.getFullYear() === now.getFullYear();
  const day = `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
  if (showTime) {
    // "Jul 6, 13:00" same-year; "Jul 6, 2025 13:00" otherwise (MMM D, YYYY HH:mm).
    return sameYear ? `${day}, ${formatTimeOfDay(date)}` : `${day}, ${date.getFullYear()} ${formatTimeOfDay(date)}`;
  }
  return sameYear ? day : `${day}, ${date.getFullYear()}`;
}

/**
 * "Jul 6 – Jul 20" · "Jul 6, 13:00 – Jul 20, 13:00" · open-ended "Jul 6 – …".
 * En dash, 24-h clock, year only when it differs from `now`'s.
 */
export function formatRange(range: DateTimeRange, options: FormatRangeOptions = {}): string {
  const { showTime = false, now = new Date() } = options;
  if (!range.from && !range.to) return "";
  const fromPart = range.from ? formatEndpoint(range.from, showTime, now) : "…";
  const toPart = range.to ? formatEndpoint(range.to, showTime, now) : "…";
  return `${fromPart} – ${toPart}`;
}

/** Monday 00:00 → Sunday 00:00 of the current week. */
export function thisWeek(now: Date): DateTimeRange {
  const from = startOfWeek(now);
  return { from, to: addDays(from, 6) };
}

/** The 14 days ending today (start-of-day endpoints). */
export function last2Weeks(now: Date): DateTimeRange {
  const to = startOfDay(now);
  return { from: addDays(to, -13), to };
}

/** First → last day of the current month. */
export function thisMonth(now: Date): DateTimeRange {
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };
}

export const DEFAULT_QUICK_RANGES: QuickRange[] = [
  { label: "This week", resolve: thisWeek },
  { label: "Last 2 weeks", resolve: last2Weeks },
  { label: "This month", resolve: thisMonth },
];
