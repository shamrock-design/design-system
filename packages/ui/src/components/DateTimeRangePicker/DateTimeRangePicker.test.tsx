import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateTimeRangePicker } from "./DateTimeRangePicker";
import type { DateTimeRange } from "./rangeUtils";

const d = (y: number, m: number, day: number, h = 0, min = 0) => new Date(y, m, day, h, min);

// A range pinned to July 2026 so the dual-month view is deterministic
// (left = July, right = August) regardless of the test clock.
const julyRange: DateTimeRange = { from: d(2026, 6, 6), to: d(2026, 6, 12) };

describe("DateTimeRangePicker — trigger row", () => {
  it("renders the formatted range in the field", () => {
    render(<DateTimeRangePicker value={julyRange} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Selected date range" })).toHaveTextContent("Jul 6 – Jul 12");
  });

  it("shows the placeholder when the range is empty", () => {
    render(<DateTimeRangePicker value={{ from: null, to: null }} onChange={vi.fn()} placeholder="Pick a window" />);
    expect(screen.getByRole("button", { name: "Selected date range" })).toHaveTextContent("Pick a window");
  });

  it("disables the steppers when the range is incomplete", () => {
    render(<DateTimeRangePicker value={{ from: d(2026, 6, 6), to: null }} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Previous period" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next period" })).toBeDisabled();
  });
});

describe("DateTimeRangePicker — steppers", () => {
  it("shifts the whole range forward by a week (default stepper)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={julyRange} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Next period" }));
    const [next] = onChange.mock.calls[0]! as [DateTimeRange];
    expect(next.from).toEqual(d(2026, 6, 13));
    expect(next.to).toEqual(d(2026, 6, 19));
  });

  it("shifts backward by the cycle length when stepper='cycle'", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={julyRange} onChange={onChange} stepper="cycle" />);
    await user.click(screen.getByRole("button", { name: "Previous period" }));
    const [next] = onChange.mock.calls[0]! as [DateTimeRange];
    // 7-day inclusive length → back to Jun 29 – Jul 5.
    expect(next.from).toEqual(d(2026, 5, 29));
    expect(next.to).toEqual(d(2026, 6, 5));
  });

  it("refuses a shift that would cross max", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={julyRange} onChange={onChange} max={d(2026, 6, 15)} />);
    await user.click(screen.getByRole("button", { name: "Next period" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("DateTimeRangePicker — popover selection", () => {
  it("opens the popover with two month grids", async () => {
    const user = userEvent.setup();
    render(<DateTimeRangePicker value={julyRange} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    expect(await screen.findByRole("grid", { name: "July 2026" })).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: "August 2026" })).toBeInTheDocument();
  });

  it("commits a click-click selection only on Apply", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={{ from: d(2026, 6, 10), to: null }} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    await user.click(await screen.findByRole("gridcell", { name: "July 20, 2026" }));
    // Nothing committed yet — draft only.
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Apply" }));
    const [committed] = onChange.mock.calls[0]! as [DateTimeRange];
    expect(committed.from).toEqual(d(2026, 6, 10));
    expect(committed.to).toEqual(d(2026, 6, 20));
    await waitFor(() => expect(screen.queryByRole("grid", { name: "July 2026" })).not.toBeInTheDocument());
  });

  it("restarts the range when clicking before the current from", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={{ from: d(2026, 6, 10), to: d(2026, 6, 10) }} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    await user.click(await screen.findByRole("gridcell", { name: "July 5, 2026" }));
    await user.click(screen.getByRole("gridcell", { name: "July 25, 2026" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    const [committed] = onChange.mock.calls[0]! as [DateTimeRange];
    expect(committed.from).toEqual(d(2026, 6, 5));
    expect(committed.to).toEqual(d(2026, 6, 25));
  });

  it("discards the draft on Cancel", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={{ from: d(2026, 6, 10), to: null }} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    await user.click(await screen.findByRole("gridcell", { name: "July 20, 2026" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("grid", { name: "July 2026" })).not.toBeInTheDocument());
  });

  it("closes without committing on Escape", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={{ from: d(2026, 6, 10), to: null }} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    await user.click(await screen.findByRole("gridcell", { name: "July 20, 2026" }));
    await user.keyboard("{Escape}");
    expect(onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("grid", { name: "July 2026" })).not.toBeInTheDocument());
  });
});

describe("DateTimeRangePicker — min/max and keyboard", () => {
  it("disables day cells outside min/max", async () => {
    const user = userEvent.setup();
    render(
      <DateTimeRangePicker
        value={{ from: d(2026, 6, 12), to: d(2026, 6, 18) }}
        onChange={vi.fn()}
        min={d(2026, 6, 10)}
        max={d(2026, 6, 20)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    expect(await screen.findByRole("gridcell", { name: "July 5, 2026" })).toBeDisabled();
    expect(screen.getByRole("gridcell", { name: "July 25, 2026" })).toBeDisabled();
    expect(screen.getByRole("gridcell", { name: "July 15, 2026" })).not.toBeDisabled();
  });

  it("selects with arrow keys + Enter, then Apply commits", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // The roving cell (tabIndex 0) is the from-day; focus it and drive by keyboard.
    render(<DateTimeRangePicker value={{ from: d(2026, 6, 10), to: d(2026, 6, 10) }} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    const roving = await screen.findByRole("gridcell", { name: "July 10, 2026" });
    roving.focus();
    await user.keyboard("{Enter}"); // restart → from = Jul 10, to = null
    await user.keyboard("{ArrowRight}{Enter}"); // focus Jul 11 → to = Jul 11
    await user.click(screen.getByRole("button", { name: "Apply" }));
    const [committed] = onChange.mock.calls[0]! as [DateTimeRange];
    expect(committed.from).toEqual(d(2026, 6, 10));
    expect(committed.to).toEqual(d(2026, 6, 11));
  });
});

describe("DateTimeRangePicker — quick ranges & disabled", () => {
  it("applies a quick preset (Monday-start week) through Apply", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimeRangePicker value={julyRange} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Selected date range" }));
    await user.click(await screen.findByRole("button", { name: "This week" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    const [committed] = onChange.mock.calls[0]! as [DateTimeRange];
    expect(committed.from!.getDay()).toBe(1); // Monday
    expect(committed.to).not.toBeNull();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DateTimeRangePicker value={julyRange} onChange={vi.fn()} disabled />);
    const field = screen.getByRole("button", { name: "Selected date range" });
    expect(field).toBeDisabled();
    await user.click(field).catch(() => undefined);
    expect(screen.queryByRole("grid", { name: "July 2026" })).not.toBeInTheDocument();
  });
});
