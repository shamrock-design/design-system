import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DonutChart } from "./DonutChart";
import type { DonutSlice } from "../../lib/types";

const slices: DonutSlice[] = [
  { label: "Success", value: 28 },
  { label: "Running", value: 9 },
  { label: "Failed", value: 5 },
  { label: "Pending", value: 3 },
];

describe("DonutChart", () => {
  it("renders a slice per value and the center total (sum by default)", () => {
    const { container, getByText } = render(<DonutChart slices={slices} height={200} centerLabel="Status" />);
    expect(container.querySelectorAll('[data-chart="donut-slice"]')).toHaveLength(4);
    // Center total defaults to the sum of slice values.
    expect(getByText("45")).toBeInTheDocument();
  });

  it("renders a side legend with slice values", () => {
    const { getByText } = render(<DonutChart slices={slices} height={200} />);
    expect(getByText("Success")).toBeInTheDocument();
    expect(getByText("28")).toBeInTheDocument();
  });
});
