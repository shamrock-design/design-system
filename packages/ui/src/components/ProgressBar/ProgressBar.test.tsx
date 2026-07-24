import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes progressbar role with aria value bounds and clamps value", () => {
    render(<ProgressBar value={62} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "62");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps out-of-range values", () => {
    const { rerender } = render(<ProgressBar value={140} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    rerender(<ProgressBar value={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders a string label as text and wires it to aria-label", () => {
    render(<ProgressBar value={62} label="31 of 34 done" />);
    expect(screen.getByText("31 of 34 done")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "31 of 34 done" })).toBeInTheDocument();
  });

  it("defaults the fill to accent-base and uses status base when set", () => {
    const { rerender } = render(<ProgressBar value={50} />);
    let bar = screen.getByRole("progressbar");
    expect(bar.style.getPropertyValue("--sh-progress-fill")).toBe("var(--sh-color-accent-base)");

    rerender(<ProgressBar value={50} status="critical" />);
    bar = screen.getByRole("progressbar");
    expect(bar.style.getPropertyValue("--sh-progress-fill")).toBe("var(--sh-color-status-critical-base)");
  });

  it("sets the single fill width from the clamped value", () => {
    const { container } = render(<ProgressBar value={40} />);
    const fill = container.querySelector('[class*="fill"]') as HTMLElement;
    expect(fill.style.width).toBe("40%");
  });

  it("sums segment values into aria-valuenow and describes the mix in aria-valuetext", () => {
    const { container } = render(
      <ProgressBar
        segments={[
          { value: 90, status: "success" },
          { value: 6, status: "warning" },
          { value: 4, status: "critical" },
        ]}
      />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "90% Success, 6% Warning, 4% Critical");
    const segs = container.querySelectorAll('[class*="segment"]:not([class*="segments"])');
    expect(segs).toHaveLength(3);
    expect((segs[0] as HTMLElement).style.getPropertyValue("--sh-progress-fill")).toBe(
      "var(--sh-color-status-success-base)",
    );
    expect((segs[2] as HTMLElement).style.flexGrow).toBe("4");
  });
});
