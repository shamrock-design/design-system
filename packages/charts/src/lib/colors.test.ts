import { describe, expect, it } from "vitest";
import { seriesColor, toneColor } from "./colors";

describe("seriesColor", () => {
  it("assigns categorical hues in fixed order 0→cat-1 … 4→cat-5", () => {
    expect([0, 1, 2, 3, 4].map(seriesColor)).toEqual([
      "var(--sh-color-chart-cat-1)",
      "var(--sh-color-chart-cat-2)",
      "var(--sh-color-chart-cat-3)",
      "var(--sh-color-chart-cat-4)",
      "var(--sh-color-chart-cat-5)",
    ]);
  });

  it("is stable per index so color follows the entity, not its rank", () => {
    // Whether it's the 3rd of 5 series or the 3rd of 2 survivors, index 2 is always cat-3.
    expect(seriesColor(2)).toBe("var(--sh-color-chart-cat-3)");
  });

  it("throws in dev past the 5-slot palette (fold into Other / facet)", () => {
    expect(() => seriesColor(5)).toThrow(/5 slots/i);
    expect(() => seriesColor(-1)).toThrow();
  });
});

describe("toneColor", () => {
  it("maps neutral→ink, accent→system accent, and status tones→status base", () => {
    expect(toneColor("neutral")).toBe("var(--sh-color-ink-5)");
    expect(toneColor("accent")).toBe("var(--sh-color-accent-base)");
    expect(toneColor("critical")).toBe("var(--sh-color-status-critical-base)");
    expect(toneColor("success")).toBe("var(--sh-color-status-success-base)");
  });
});
