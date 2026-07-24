import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("renders a single path with a non-empty d", () => {
    const { container } = render(<Sparkline data={[3, 5, 2, 8, 6, 9]} width={96} height={24} />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(1);
    expect(paths[0]!.getAttribute("d")).toMatch(/^M/);
  });

  it("is decorative by default and labeled when ariaLabel is given", () => {
    const { container, rerender } = render(<Sparkline data={[1, 2, 3]} />);
    expect(container.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
    rerender(<Sparkline data={[1, 2, 3]} ariaLabel="Run durations trending up" />);
    expect(container.querySelector("svg")!.getAttribute("aria-label")).toBe("Run durations trending up");
  });
});
