import { describe, expect, it } from "vitest";
import {
  clampToMinMax,
  formatRange,
  isInRange,
  isSameDay,
  last2Weeks,
  monthGrid,
  parseTimeString,
  selectDay,
  shiftRange,
  thisMonth,
  thisWeek,
  type DateTimeRange,
} from "./rangeUtils";

const d = (y: number, m: number, day: number, h = 0, min = 0) => new Date(y, m, day, h, min);

describe("monthGrid", () => {
  it("returns a 6×7 grid starting Monday", () => {
    const grid = monthGrid(2026, 6); // July 2026
    expect(grid).toHaveLength(6);
    expect(grid.every((week) => week.length === 7)).toBe(true);
    // Every row's first cell is a Monday.
    expect(grid.every((week) => week[0]!.getDay() === 1)).toBe(true);
  });

  it("pads July 2026 with the correct leading/trailing days", () => {
    const grid = monthGrid(2026, 6); // Jul 1 2026 is a Wednesday
    // Monday of that week is Jun 29.
    expect(isSameDay(grid[0]![0]!, d(2026, 5, 29))).toBe(true);
    expect(isSameDay(grid[0]![2]!, d(2026, 6, 1))).toBe(true);
  });

  it("handles a leap-year February (2024) — Feb 29 present, 42 cells", () => {
    const grid = monthGrid(2024, 1);
    const flat = grid.flat();
    expect(flat).toHaveLength(42);
    expect(flat.some((cell) => cell.getMonth() === 1 && cell.getDate() === 29)).toBe(true);
    // Feb 1 2024 is a Thursday → column index 3 in the first row.
    expect(isSameDay(grid[0]![3]!, d(2024, 1, 1))).toBe(true);
  });

  it("handles a non-leap February (2025) — no Feb 29", () => {
    const flat = monthGrid(2025, 1).flat();
    expect(flat.some((cell) => cell.getMonth() === 1 && cell.getDate() === 29)).toBe(false);
  });
});

describe("shiftRange", () => {
  const range: DateTimeRange = { from: d(2026, 6, 6, 13), to: d(2026, 6, 12, 13) }; // 7-day inclusive

  it("day stepper shifts by ±1 day, preserving time of day", () => {
    const next = shiftRange(range, "day", 1);
    expect(isSameDay(next.from!, d(2026, 6, 7))).toBe(true);
    expect(isSameDay(next.to!, d(2026, 6, 13))).toBe(true);
    expect(next.from!.getHours()).toBe(13);
  });

  it("week stepper shifts by ±7 days", () => {
    const back = shiftRange(range, "week", -1);
    expect(isSameDay(back.from!, d(2026, 5, 29))).toBe(true);
    expect(isSameDay(back.to!, d(2026, 6, 5))).toBe(true);
  });

  it("cycle stepper shifts by the range's own inclusive length", () => {
    // Jul 6 → Jul 12 inclusive = 7 days, so forward lands on Jul 13 → Jul 19.
    const next = shiftRange(range, "cycle", 1);
    expect(isSameDay(next.from!, d(2026, 6, 13))).toBe(true);
    expect(isSameDay(next.to!, d(2026, 6, 19))).toBe(true);
  });

  it("cycle stepper is a no-op on an incomplete range", () => {
    const open: DateTimeRange = { from: d(2026, 6, 6), to: null };
    expect(shiftRange(open, "cycle", 1)).toEqual(open);
  });
});

describe("quick presets", () => {
  const now = d(2026, 6, 22, 16, 40); // Wed Jul 22 2026

  it("thisWeek spans Monday→Sunday of the current week", () => {
    const r = thisWeek(now);
    expect(isSameDay(r.from!, d(2026, 6, 20))).toBe(true); // Mon
    expect(isSameDay(r.to!, d(2026, 6, 26))).toBe(true); // Sun
    expect(r.from!.getDay()).toBe(1);
  });

  it("last2Weeks spans the 14 days ending today", () => {
    const r = last2Weeks(now);
    expect(isSameDay(r.to!, d(2026, 6, 22))).toBe(true);
    expect(isSameDay(r.from!, d(2026, 6, 9))).toBe(true);
  });

  it("thisMonth spans the 1st→last day of the month", () => {
    const r = thisMonth(now);
    expect(isSameDay(r.from!, d(2026, 6, 1))).toBe(true);
    expect(isSameDay(r.to!, d(2026, 6, 31))).toBe(true);
  });
});

describe("formatRange", () => {
  const now = d(2026, 6, 22);

  it("formats same-year no-time as 'Jul 6 – Jul 20'", () => {
    const r: DateTimeRange = { from: d(2026, 6, 6), to: d(2026, 6, 20) };
    expect(formatRange(r, { now })).toBe("Jul 6 – Jul 20");
  });

  it("formats with time as 'Jul 6, 13:00 – Jul 20, 13:00'", () => {
    const r: DateTimeRange = { from: d(2026, 6, 6, 13), to: d(2026, 6, 20, 13) };
    expect(formatRange(r, { showTime: true, now })).toBe("Jul 6, 13:00 – Jul 20, 13:00");
  });

  it("formats an open-ended range as 'Jul 6 – …'", () => {
    const r: DateTimeRange = { from: d(2026, 6, 6), to: null };
    expect(formatRange(r, { now })).toBe("Jul 6 – …");
  });

  it("includes the year when it differs from now", () => {
    const r: DateTimeRange = { from: d(2025, 6, 6), to: d(2026, 6, 20) };
    expect(formatRange(r, { now })).toBe("Jul 6, 2025 – Jul 20");
  });

  it("returns empty string for a fully empty range", () => {
    expect(formatRange({ from: null, to: null }, { now })).toBe("");
  });
});

describe("selectDay state machine", () => {
  it("first click sets from and clears to", () => {
    const r = selectDay({ from: null, to: null }, d(2026, 6, 6));
    expect(isSameDay(r.from!, d(2026, 6, 6))).toBe(true);
    expect(r.to).toBeNull();
  });

  it("second click on a later day sets to", () => {
    const first = selectDay({ from: null, to: null }, d(2026, 6, 6));
    const second = selectDay(first, d(2026, 6, 20));
    expect(isSameDay(second.from!, d(2026, 6, 6))).toBe(true);
    expect(isSameDay(second.to!, d(2026, 6, 20))).toBe(true);
  });

  it("clicking before from restarts the range", () => {
    const complete: DateTimeRange = { from: d(2026, 6, 10), to: null };
    const restarted = selectDay(complete, d(2026, 6, 3));
    expect(isSameDay(restarted.from!, d(2026, 6, 3))).toBe(true);
    expect(restarted.to).toBeNull();
  });

  it("starts a fresh selection once a range is complete", () => {
    const complete: DateTimeRange = { from: d(2026, 6, 6), to: d(2026, 6, 20) };
    const next = selectDay(complete, d(2026, 6, 25));
    expect(isSameDay(next.from!, d(2026, 6, 25))).toBe(true);
    expect(next.to).toBeNull();
  });
});

describe("clampToMinMax / isInRange", () => {
  it("clamps below min and above max, passes through in-range", () => {
    const min = d(2026, 6, 5);
    const max = d(2026, 6, 25);
    expect(clampToMinMax(d(2026, 6, 1), min, max).getTime()).toBe(min.getTime());
    expect(clampToMinMax(d(2026, 6, 30), min, max).getTime()).toBe(max.getTime());
    expect(clampToMinMax(d(2026, 6, 15), min, max).getTime()).toBe(d(2026, 6, 15).getTime());
  });

  it("isInRange is inclusive of both endpoints and false for open ranges", () => {
    const r: DateTimeRange = { from: d(2026, 6, 6), to: d(2026, 6, 20) };
    expect(isInRange(d(2026, 6, 6), r)).toBe(true);
    expect(isInRange(d(2026, 6, 20), r)).toBe(true);
    expect(isInRange(d(2026, 6, 21), r)).toBe(false);
    expect(isInRange(d(2026, 6, 10), { from: d(2026, 6, 6), to: null })).toBe(false);
  });
});

describe("parseTimeString", () => {
  it("parses valid 24-h times", () => {
    expect(parseTimeString("13:05")).toEqual({ hours: 13, minutes: 5 });
    expect(parseTimeString("9:30")).toEqual({ hours: 9, minutes: 30 });
    expect(parseTimeString("00:00")).toEqual({ hours: 0, minutes: 0 });
  });

  it("rejects out-of-range and malformed input", () => {
    expect(parseTimeString("24:00")).toBeNull();
    expect(parseTimeString("12:60")).toBeNull();
    expect(parseTimeString("1pm")).toBeNull();
    expect(parseTimeString("")).toBeNull();
  });
});
