import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Timeline,
  formatAxisLabel,
  formatDuration,
  resolveTickUnit,
  tickMarks,
  timeScale,
  type TimelineItem,
} from "./Timeline";

/* July 20 2026 (day-20) helpers. Month is 0-indexed. */
const d20 = (h: number, m = 0) => new Date(2026, 6, 20, h, m);
const d21 = (h: number, m = 0) => new Date(2026, 6, 21, h, m);

/* ── timeScale ──────────────────────────────────────────────────────────── */

describe("timeScale", () => {
  const window = { start: d20(18, 0), end: d20(22, 0) }; // 4h span
  const scale = timeScale(window, 800);

  it("maps window edges to [0, plotWidth] and the midpoint to the center", () => {
    expect(scale.x(d20(18, 0))).toBe(0);
    expect(scale.x(d20(22, 0))).toBe(800);
    expect(scale.x(d20(20, 0))).toBe(400); // 2h of 4h
    expect(scale.x(d20(19, 0))).toBe(200); // 1h of 4h
  });

  it("clampX keeps out-of-window times on-canvas; x does not", () => {
    expect(scale.x(d20(17, 0))).toBeLessThan(0);
    expect(scale.x(d20(23, 0))).toBeGreaterThan(800);
    expect(scale.clampX(d20(17, 0))).toBe(0);
    expect(scale.clampX(d20(23, 0))).toBe(800);
  });

  it("guards a zero-span window (never divides by zero)", () => {
    const degenerate = timeScale({ start: d20(18, 0), end: d20(18, 0) }, 500);
    expect(Number.isFinite(degenerate.x(d20(18, 0)))).toBe(true);
    expect(degenerate.clampX(d20(19, 0))).toBeGreaterThanOrEqual(0);
    expect(degenerate.clampX(d20(19, 0))).toBeLessThanOrEqual(500);
  });
});

/* ── tickMarks / resolveTickUnit ────────────────────────────────────────── */

describe("tickMarks", () => {
  it("hour cadence: one tick per hour, single major at midnight", () => {
    const marks = tickMarks({ start: d20(18, 30), end: d21(2, 0) }, "hour");
    expect(marks).toHaveLength(8); // 19,20,21,22,23,00,01,02
    expect(marks[0]!.label.endsWith("19:00")).toBe(true);
    const majors = marks.filter((m) => m.major);
    expect(majors).toHaveLength(1);
    expect(majors[0]!.label.endsWith("00:00")).toBe(true);
  });

  it("day cadence: one tick per midnight, all major", () => {
    const marks = tickMarks({ start: d20(6, 0), end: new Date(2026, 6, 23, 6, 0) }, "day");
    expect(marks).toHaveLength(3); // 21, 22, 23 midnights
    expect(marks.every((m) => m.major)).toBe(true);
    expect(marks.every((m) => m.label.endsWith("00:00"))).toBe(true);
  });

  it("labels use the ddd HH:mm axis format", () => {
    const marks = tickMarks({ start: d20(18, 0), end: d20(20, 0) }, "hour");
    expect(marks[0]!.label).toMatch(/^[A-Z][a-z]{2} \d\d:\d\d$/);
  });
});

describe("resolveTickUnit", () => {
  it("passes explicit units through", () => {
    expect(resolveTickUnit({ start: d20(0), end: d21(0) }, "hour")).toBe("hour");
    expect(resolveTickUnit({ start: d20(0), end: d21(0) }, "day")).toBe("day");
  });

  it("auto picks hour under 48h and day beyond", () => {
    expect(resolveTickUnit({ start: d20(0), end: new Date(2026, 6, 21, 16) }, "auto")).toBe("hour"); // 40h
    expect(resolveTickUnit({ start: d20(0), end: new Date(2026, 6, 22, 12) }, "auto")).toBe("day"); // 60h
  });
});

/* ── formatting ─────────────────────────────────────────────────────────── */

describe("formatting helpers", () => {
  it("formatDuration keeps the largest two units", () => {
    expect(formatDuration(80 * 60_000)).toBe("1h 20m");
    expect(formatDuration(90 * 60_000)).toBe("1h 30m");
    expect(formatDuration(60 * 60_000)).toBe("1h");
    expect(formatDuration(45 * 60_000)).toBe("45m");
    expect(formatDuration(40 * 1_000)).toBe("40s");
    expect(formatDuration(0)).toBe("0s");
  });

  it("formatAxisLabel is ddd HH:mm, zero-padded", () => {
    expect(formatAxisLabel(new Date(2026, 6, 20, 9, 5))).toMatch(/^[A-Z][a-z]{2} 09:05$/);
  });
});

/* ── component ──────────────────────────────────────────────────────────── */

const items: TimelineItem[] = [
  { id: "a1", lane: "IBP", label: "Extract", status: "success", start: d20(18, 0), end: d20(19, 0), system: "S4H" },
  { id: "a2", lane: "IBP", label: "Gate step", status: "success", gate: true, start: d20(19, 10), end: d20(19, 30) },
  { id: "b1", lane: "ECC", label: "Overdue load", status: "warning", start: d20(18, 30), end: d20(20, 30) },
  { id: "b2", lane: "ECC", label: "Skipped step", status: "pending", ghost: true, start: d20(20, 40), end: d20(21, 0) },
  { id: "m1", lane: "ECC", label: "Cutover", status: "success", start: d20(21, 30) }, // milestone (no end)
];

function nodes(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-timeline-item]"));
}

describe("Timeline component", () => {
  it("renders a grid with one row per lane, derived from item order", () => {
    render(<Timeline items={[{ id: "x", lane: "B", label: "x", status: "neutral", start: d20(1) }, { id: "y", lane: "A", label: "y", status: "neutral", start: d20(2) }, { id: "z", lane: "B", label: "z", status: "neutral", start: d20(3) }]} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
    const headers = screen.getAllByRole("rowheader").map((h) => h.textContent);
    expect(headers).toEqual(["B", "A"]); // first-seen order
  });

  it("honors explicit lane order and renders lanes that have no items", () => {
    render(<Timeline items={items} lanes={["ECC", "IBP", "BW"]} />);
    const headers = screen.getAllByRole("rowheader").map((h) => h.textContent);
    expect(headers).toEqual(["ECC", "IBP", "BW"]);
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("distinguishes milestones from bars", () => {
    const { container } = render(<Timeline items={items} />);
    const bar = container.querySelector('[data-timeline-item="a1"]');
    const milestone = container.querySelector('[data-timeline-item="m1"]');
    expect(bar?.getAttribute("data-kind")).toBe("bar");
    expect(milestone?.getAttribute("data-kind")).toBe("milestone");
  });

  it("marks ghost items and labels them 'didn't run'", () => {
    const { container } = render(<Timeline items={items} />);
    const ghost = container.querySelector('[data-timeline-item="b2"]');
    expect(ghost?.hasAttribute("data-ghost")).toBe(true);
    expect(screen.getByText("didn't run")).toBeInTheDocument();
  });

  it("renders a GATE badge and a system Tag", () => {
    render(<Timeline items={items} />);
    expect(screen.getByText("GATE")).toBeInTheDocument();
    expect(screen.getByText("S4H")).toBeInTheDocument();
  });

  it("renders the NOW line only when now falls inside the window", () => {
    const { rerender } = render(<Timeline items={items} now={d20(20, 0)} />);
    expect(screen.getByText("NOW")).toBeInTheDocument();
    rerender(<Timeline items={items} now={d20(6, 0)} />); // before window start
    expect(screen.queryByText("NOW")).not.toBeInTheDocument();
  });

  it("renders items as buttons and fires onItemClick", async () => {
    const onItemClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<Timeline items={items} onItemClick={onItemClick} />);
    const buttons = container.querySelectorAll("button[data-timeline-item]");
    expect(buttons.length).toBe(items.length);
    const gate = screen.getByRole("button", { name: /Gate step/ });
    await user.click(gate);
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: "a2" }));
  });

  it("renders non-interactive items (no buttons) without onItemClick", () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelectorAll("button[data-timeline-item]")).toHaveLength(0);
    expect(nodes(container)).toHaveLength(items.length);
  });

  it("gives each item an accessible name of lane, label and time", () => {
    render(<Timeline items={items} onItemClick={() => {}} />);
    const btn = screen.getByRole("button", { name: /Overdue load/ });
    expect(btn).toHaveAccessibleName(/ECC/);
    expect(btn).toHaveAccessibleName(/2h/); // 18:30 → 20:30 duration
  });

  it("shows the empty message when there are no items or lanes", () => {
    render(<Timeline items={[]} emptyMessage="No runs in this window." />);
    expect(screen.getByText("No runs in this window.")).toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("falls back to a default empty message", () => {
    render(<Timeline items={[]} />);
    expect(screen.getByText(/No timeline items yet/)).toBeInTheDocument();
  });
});
