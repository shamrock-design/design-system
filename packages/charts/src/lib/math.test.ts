import { describe, expect, it } from "vitest";
import { buildLinePath, donutArcs, nearestIndex, stackSegments } from "./math";

describe("nearestIndex", () => {
  const xs = [0, 10, 20, 30, 40];
  it("snaps to the nearest value", () => {
    expect(nearestIndex(xs, 12)).toBe(1);
    expect(nearestIndex(xs, 16)).toBe(2);
    expect(nearestIndex(xs, 29)).toBe(3);
  });
  it("clamps below and above the domain", () => {
    expect(nearestIndex(xs, -5)).toBe(0);
    expect(nearestIndex(xs, 999)).toBe(4);
  });
  it("resolves an exact midpoint tie to the lower index", () => {
    expect(nearestIndex(xs, 15)).toBe(1);
  });
  it("returns -1 for an empty array", () => {
    expect(nearestIndex([], 3)).toBe(-1);
  });
});

describe("stackSegments", () => {
  // Identity scale: value === pixel, so a value of 10 sits at y-pixel 10.
  // Baseline (0) is the largest pixel; growing values move toward 0 — but with an identity
  // scale we can still verify the value math and gap insets directly.
  const scale = (v: number) => 100 - v; // baseline at 100px, top shrinks toward 0

  it("stacks cumulatively so segment values sum to the total", () => {
    const segs = stackSegments([30, 20, 10], scale, 0);
    expect(segs.map((s) => s.value)).toEqual([30, 20, 10]);
    expect(segs[2]!.y1).toBe(60); // 30 + 20 + 10
    // With no gap, the top of the top segment reaches scale(total) = 100 - 60 = 40.
    expect(segs[2]!.y).toBe(40);
  });

  it("opens a surface gap on every joint except the baseline segment", () => {
    const gap = 2;
    const noGap = stackSegments([30, 20, 10], scale, 0);
    const withGap = stackSegments([30, 20, 10], scale, gap);
    // Bottom segment: no inset — same height with or without a gap.
    expect(withGap[0]!.height).toBe(noGap[0]!.height);
    // Interior/top segments: each loses exactly `gap` px of height to the joint below.
    expect(withGap[1]!.height).toBe(noGap[1]!.height - gap);
    expect(withGap[2]!.height).toBe(noGap[2]!.height - gap);
    // Tops stay flush with the true cumulative value (only the bottoms inset).
    expect(withGap[2]!.y).toBe(noGap[2]!.y);
  });

  it("clamps a zero-value segment to a non-negative height", () => {
    const segs = stackSegments([0, 10], scale, 2);
    expect(segs[0]!.height).toBe(0);
  });
});

describe("donutArcs", () => {
  const TAU = Math.PI * 2;
  it("splits four equal values into four quarter turns", () => {
    const arcs = donutArcs([1, 1, 1, 1], 0);
    for (const a of arcs) expect(a.endAngle - a.startAngle).toBeCloseTo(TAU / 4);
    expect(arcs[3]!.endAngle).toBeCloseTo(TAU);
  });

  it("proportions sweeps by value", () => {
    const arcs = donutArcs([3, 1], 0);
    expect(arcs[0]!.endAngle - arcs[0]!.startAngle).toBeCloseTo((3 / 4) * TAU);
    expect(arcs[1]!.endAngle - arcs[1]!.startAngle).toBeCloseTo((1 / 4) * TAU);
  });

  it("reserves gaps so sweeps + gaps fill the full circle", () => {
    const gap = 0.05;
    const arcs = donutArcs([2, 2, 1], gap);
    const sweeps = arcs.reduce((sum, a) => sum + (a.endAngle - a.startAngle), 0);
    expect(sweeps + gap * 3).toBeCloseTo(TAU);
  });

  it("produces empty arcs when the total is zero", () => {
    const arcs = donutArcs([0, 0], 0.05);
    for (const a of arcs) expect(a.endAngle - a.startAngle).toBe(0);
  });
});

describe("buildLinePath", () => {
  it("draws straight segments for a linear curve", () => {
    expect(buildLinePath([[0, 0], [10, 5], [20, 0]], "linear")).toBe("M0,0L10,5L20,0");
  });
  it("emits cubic segments for a monotone curve", () => {
    const d = buildLinePath([[0, 0], [10, 5], [20, 2]], "monotone");
    expect(d.startsWith("M0,0")).toBe(true);
    expect((d.match(/C/g) ?? []).length).toBe(2); // one cubic per segment
  });
  it("drops non-finite points and handles the degenerate cases", () => {
    expect(buildLinePath([], "linear")).toBe("");
    expect(buildLinePath([[5, 5]], "linear")).toBe("M5,5");
    expect(buildLinePath([[0, 0], [Number.NaN, 1], [10, 2]], "linear")).toBe("M0,0L10,2");
  });
});
