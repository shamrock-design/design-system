/**
 * Pure geometry helpers for the chart pack. Everything here is side-effect-free and
 * unit-tested — the components stay thin by delegating all the math to this module.
 */

/** A rendered stacked-bar segment in pixel space (SVG y grows downward). */
export interface SegmentRect {
  /** Top edge in pixels (flush with the true cumulative value). */
  y: number;
  /** Height in pixels, already reduced by the surface gap where applicable. */
  height: number;
  /** The raw datum value this segment encodes. */
  value: number;
  /** Cumulative value at the bottom of this segment. */
  y0: number;
  /** Cumulative value at the top of this segment. */
  y1: number;
}

/**
 * Stack a column of values from the baseline up, inserting a `gap`px surface break between
 * adjacent segments. `scaleY` maps a cumulative value to its y pixel (baseline value → largest
 * pixel, growing values → smaller pixels, the usual SVG convention).
 *
 * The gap is taken from the bottom of every segment except the bottom-most, so the stack stays
 * flush with the baseline below and with the true total on top; only the interior joints open up.
 */
export function stackSegments(values: number[], scaleY: (value: number) => number, gap: number): SegmentRect[] {
  const rects: SegmentRect[] = [];
  let cumulative = 0;
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i] ?? 0;
    const y0 = cumulative;
    const y1 = cumulative + value;
    cumulative = y1;
    const bottomPx = scaleY(y0);
    const topPx = scaleY(y1);
    const insetBottom = i === 0 ? bottomPx : bottomPx - gap;
    const height = Math.max(0, insetBottom - topPx);
    rects.push({ y: topPx, height, value, y0, y1 });
  }
  return rects;
}

/** An arc (radians) produced by {@link donutArcs}. Angles start at 0 and sweep clockwise. */
export interface DonutArc {
  startAngle: number;
  endAngle: number;
  value: number;
}

const TAU = Math.PI * 2;

/**
 * Split a full circle into proportional arcs, reserving `gapAngle` radians of surface between
 * adjacent non-empty slices. When the total is 0 every arc is empty; when a single slice carries
 * the whole value it fills the ring with no gap.
 */
export function donutArcs(values: number[], gapAngle = 0): DonutArc[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  const nonEmpty = values.filter((v) => v > 0).length;
  const gaps = nonEmpty > 1 ? gapAngle * nonEmpty : 0;
  const available = Math.max(0, TAU - gaps);
  let angle = 0;
  return values.map((value) => {
    const sweep = total > 0 && value > 0 ? (value / total) * available : 0;
    const start = angle;
    const end = angle + sweep;
    angle = end + (value > 0 && nonEmpty > 1 ? gapAngle : 0);
    return { startAngle: start, endAngle: end, value };
  });
}

/**
 * Index of the value in a **sorted-ascending** array nearest to `target`. Ties resolve to the
 * lower index. Returns -1 for an empty array. Used to snap a pointer x to the nearest datum.
 */
export function nearestIndex(sorted: number[], target: number): number {
  const n = sorted.length;
  if (n === 0) return -1;
  const first = sorted[0]!;
  const last = sorted[n - 1]!;
  if (target <= first) return 0;
  if (target >= last) return n - 1;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid]! < target) lo = mid;
    else hi = mid;
  }
  const loVal = sorted[lo]!;
  const hiVal = sorted[hi]!;
  return target - loVal <= hiVal - target ? lo : hi;
}

export type Point = [number, number];

/**
 * Build an SVG path `d` string through pixel points.
 *
 * `linear` connects points with straight segments. `monotone` uses Fritsch–Carlson monotone
 * cubic interpolation (the same shape d3's `curveMonotoneX` produces): smooth, but guaranteed
 * never to overshoot the data — no phantom peaks between points. Non-finite points are dropped.
 */
export function buildLinePath(points: Point[], curve: "linear" | "monotone" = "linear"): string {
  const pts = points.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) {
    const [x, y] = pts[0]!;
    return `M${x},${y}`;
  }
  if (curve === "linear" || n === 2) {
    return "M" + pts.map(([x, y]) => `${x},${y}`).join("L");
  }
  return monotonePath(pts);
}

function monotonePath(pts: Point[]): string {
  const n = pts.length;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);

  // Secant slopes between consecutive points.
  const secant: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    const dx = xs[i + 1]! - xs[i]!;
    secant.push(dx === 0 ? 0 : (ys[i + 1]! - ys[i]!) / dx);
  }

  // Tangents at each point (Fritsch–Carlson).
  const tangent: number[] = new Array(n).fill(0);
  tangent[0] = secant[0]!;
  tangent[n - 1] = secant[n - 2]!;
  for (let i = 1; i < n - 1; i += 1) {
    const s0 = secant[i - 1]!;
    const s1 = secant[i]!;
    tangent[i] = s0 * s1 <= 0 ? 0 : (s0 + s1) / 2;
  }
  // Clamp to preserve monotonicity.
  for (let i = 0; i < n - 1; i += 1) {
    const s = secant[i]!;
    if (s === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
    } else {
      const a = tangent[i]! / s;
      const b = tangent[i + 1]! / s;
      const h = Math.hypot(a, b);
      if (h > 3) {
        const t = 3 / h;
        tangent[i] = t * a * s;
        tangent[i + 1] = t * b * s;
      }
    }
  }

  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < n - 1; i += 1) {
    const dx = (xs[i + 1]! - xs[i]!) / 3;
    const c1x = xs[i]! + dx;
    const c1y = ys[i]! + tangent[i]! * dx;
    const c2x = xs[i + 1]! - dx;
    const c2y = ys[i + 1]! - tangent[i + 1]! * dx;
    d += `C${c1x},${c1y} ${c2x},${c2y} ${xs[i + 1]},${ys[i + 1]}`;
  }
  return d;
}
