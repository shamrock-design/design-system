import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StackedBarChart } from "./StackedBarChart";
import type { BarSeries } from "../../lib/types";

const series: BarSeries[] = [
  { id: "pass", label: "Passed", data: [{ x: "Mon", y: 8 }, { x: "Tue", y: 6 }, { x: "Wed", y: 9 }] },
  { id: "fail", label: "Failed", data: [{ x: "Mon", y: 2 }, { x: "Tue", y: 3 }, { x: "Wed", y: 1 }] },
];

describe("StackedBarChart", () => {
  it("renders one segment per (category × series) and a legend for 2 series", () => {
    const { container } = render(<StackedBarChart series={series} width={480} height={240} />);
    // 3 categories × 2 series, all non-zero.
    expect(container.querySelectorAll('[data-chart="bar-segment"]')).toHaveLength(6);
    expect(container.querySelector("ul")!.querySelectorAll("li")).toHaveLength(2);
  });

  it("omits zero-height segments", () => {
    const withZero: BarSeries[] = [
      { id: "pass", label: "Passed", data: [{ x: "Mon", y: 8 }] },
      { id: "fail", label: "Failed", data: [{ x: "Mon", y: 0 }] },
    ];
    const { container } = render(<StackedBarChart series={withZero} width={320} height={200} />);
    expect(container.querySelectorAll('[data-chart="bar-segment"]')).toHaveLength(1);
  });
});
