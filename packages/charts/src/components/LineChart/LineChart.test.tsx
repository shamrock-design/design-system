import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LineChart } from "./LineChart";
import type { LineSeries } from "../../lib/types";

const two: LineSeries[] = [
  { id: "a", label: "Sync A", data: [{ x: 0, y: 10 }, { x: 1, y: 14 }, { x: 2, y: 9 }] },
  { id: "b", label: "Sync B", data: [{ x: 0, y: 4 }, { x: 1, y: 8 }, { x: 2, y: 12 }] },
];

describe("LineChart", () => {
  it("renders a line path per series plus axes, and a legend for 2 series", () => {
    const { container } = render(<LineChart series={two} width={480} height={240} />);
    expect(container.querySelectorAll('[data-chart="line-path"]')).toHaveLength(2);
    // Axes render tick labels as SVG <text>.
    expect(container.querySelectorAll("svg text").length).toBeGreaterThan(0);
    // Legend list present with one entry per series.
    const legend = container.querySelector("ul");
    expect(legend).not.toBeNull();
    expect(legend!.querySelectorAll("li")).toHaveLength(2);
  });

  it("renders NO legend for a single series (the title names it)", () => {
    const { container } = render(<LineChart series={[two[0]!]} width={480} height={240} />);
    expect(container.querySelectorAll('[data-chart="line-path"]')).toHaveLength(1);
    expect(container.querySelector("ul")).toBeNull();
  });

  it("draws a smooth path with cubic segments when curve=monotone", () => {
    const { container } = render(<LineChart series={[two[0]!]} width={480} height={240} curve="monotone" />);
    const d = container.querySelector('[data-chart="line-path"]')!.getAttribute("d") ?? "";
    expect(d).toContain("C");
  });
});
