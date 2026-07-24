import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MiniDonut } from "./MiniDonut";

describe("MiniDonut", () => {
  it("renders a track plus a progress arc for a partial value", () => {
    const { container } = render(<MiniDonut value={60} size={14} />);
    expect(container.querySelectorAll("path")).toHaveLength(2); // track + progress
    expect(container.querySelector('[data-chart="minidonut-progress"]')).not.toBeNull();
  });

  it("draws only the track at value 0", () => {
    const { container } = render(<MiniDonut value={0} size={14} />);
    expect(container.querySelector('[data-chart="minidonut-progress"]')).toBeNull();
  });
});
