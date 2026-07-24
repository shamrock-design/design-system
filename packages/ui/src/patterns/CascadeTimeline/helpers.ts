import type { Status } from "../../constants/status";

/**
 * One step in the run graph. `needs` are upstream step ids; `unlocks` are the
 * downstream ids (derived from other steps' `needs` when omitted). Time is a real
 * clock: `start`/`end` are Dates. Flags: `ghost` (projected/anticipated, drawn
 * dashed), `gate` (a phase gate), `kin` (kept findable with a green ledge).
 */
export interface CascadeStep {
  id: string;
  label: string;
  technical?: string;
  start: Date;
  end?: Date;
  status: Status;
  needs?: string[];
  unlocks?: string[];
  ghost?: boolean;
  gate?: boolean;
  kin?: boolean;
}

/** Bar treatments, derived from the status enum (calm/exception-first). */
export type BarState = "done" | "run" | "late" | "fail" | "ready" | "locked" | "ghost";

/**
 * Map the canonical status enum onto a bar treatment. Nominal/finished work
 * renders calm (muted ink); saturated fill is reserved for the exceptions
 * (running/late = amber, failed = red). `ghost` overrides everything.
 */
export function barState(step: Pick<CascadeStep, "status" | "ghost">): BarState {
  if (step.ghost) return "ghost";
  switch (step.status) {
    case "success":
      return "done";
    case "running":
      return "run";
    case "warning":
      return "late";
    case "critical":
      return "fail";
    case "info":
      return "ready";
    case "pending":
    case "neutral":
    default:
      return "locked";
  }
}

/**
 * Stable, cycle-safe topological sort: every step lands after all of its
 * upstream `needs` (and before its `unlocks`), so dependency points down-page by
 * construction. Ties keep the caller's original order. If the graph contains a
 * cycle, the remaining nodes are emitted in original order (never dropped),
 * deterministically breaking the cycle at the earliest node.
 */
export function dependencySort(steps: CascadeStep[]): CascadeStep[] {
  const n = steps.length;
  const idOf = new Map<string, number>();
  steps.forEach((s, i) => idOf.set(s.id, i));

  const indeg = new Array<number>(n).fill(0);
  const outEdges: number[][] = steps.map(() => []);
  const seen = new Set<string>();

  const addEdge = (from: number, to: number) => {
    if (from === to) return;
    const key = `${from}>${to}`;
    if (seen.has(key)) return;
    seen.add(key);
    outEdges[from]!.push(to);
    indeg[to]! += 1;
  };

  steps.forEach((s, i) => {
    for (const need of s.needs ?? []) {
      const j = idOf.get(need);
      if (j !== undefined) addEdge(j, i); // need -> step
    }
    for (const unlock of s.unlocks ?? []) {
      const j = idOf.get(unlock);
      if (j !== undefined) addEdge(i, j); // step -> unlock
    }
  });

  const emitted = new Array<boolean>(n).fill(false);
  const order: CascadeStep[] = [];

  const release = (i: number) => {
    emitted[i] = true;
    order.push(steps[i]!);
    for (const t of outEdges[i]!) indeg[t]! -= 1;
  };

  while (order.length < n) {
    // Smallest-index node with no unmet dependency (stable tie-break).
    let pick = -1;
    for (let i = 0; i < n; i++) {
      if (!emitted[i] && indeg[i] === 0) {
        pick = i;
        break;
      }
    }
    // Cycle: nothing is free. Break it at the earliest remaining node.
    if (pick === -1) {
      for (let i = 0; i < n; i++) {
        if (!emitted[i]) {
          pick = i;
          break;
        }
      }
    }
    if (pick === -1) break; // defensive; unreachable
    release(pick);
  }

  return order;
}

/**
 * The bounded local dependency view for one step: its immediate upstream
 * (`needs`) and downstream (`unlocks`). `unlocks` uses the step's explicit list
 * when present, otherwise it is derived from every step that lists `id` in its
 * `needs`. Order is preserved; unknown ids are dropped.
 */
export function egoGraph(
  steps: CascadeStep[],
  id: string,
): { needs: CascadeStep[]; unlocks: CascadeStep[] } {
  const byId = new Map(steps.map((s) => [s.id, s]));
  const step = byId.get(id);
  if (!step) return { needs: [], unlocks: [] };

  const needs = (step.needs ?? [])
    .map((nid) => byId.get(nid))
    .filter((s): s is CascadeStep => Boolean(s));

  let unlocks: CascadeStep[];
  if (step.unlocks) {
    unlocks = step.unlocks
      .map((uid) => byId.get(uid))
      .filter((s): s is CascadeStep => Boolean(s));
  } else {
    unlocks = steps.filter((s) => (s.needs ?? []).includes(id));
  }

  return { needs, unlocks };
}

/**
 * Direct-downstream adjacency: `id -> immediate dependents`, unioning each
 * step's explicit `unlocks` with every step that names it in `needs`.
 */
export function forwardAdjacency(steps: CascadeStep[]): Map<string, string[]> {
  const known = new Set(steps.map((s) => s.id));
  const adj = new Map<string, Set<string>>();
  for (const s of steps) adj.set(s.id, new Set<string>());
  for (const s of steps) {
    for (const u of s.unlocks ?? []) {
      if (known.has(u)) adj.get(s.id)!.add(u);
    }
    for (const n of s.needs ?? []) {
      if (known.has(n)) adj.get(n)!.add(s.id);
    }
  }
  const out = new Map<string, string[]>();
  for (const [k, v] of adj) out.set(k, [...v]);
  return out;
}

/** Count of every step transitively blocked by `id` (cycle-safe BFS). */
export function blocksCount(steps: CascadeStep[], id: string): number {
  const adj = forwardAdjacency(steps);
  const seen = new Set<string>();
  const queue = [...(adj.get(id) ?? [])];
  while (queue.length) {
    const next = queue.shift()!;
    if (seen.has(next) || next === id) continue;
    seen.add(next);
    for (const child of adj.get(next) ?? []) {
      if (!seen.has(child)) queue.push(child);
    }
  }
  return seen.size;
}

/** The step plus its immediate neighbours — the rows to keep findable on the clock. */
export function kinSet(steps: CascadeStep[], id: string): Set<string> {
  const { needs, unlocks } = egoGraph(steps, id);
  const set = new Set<string>([id]);
  for (const s of needs) set.add(s.id);
  for (const s of unlocks) set.add(s.id);
  return set;
}

/* --------------------------------------------------------------------------
 * Time -> x scale
 * ------------------------------------------------------------------------ */

export interface TimeBounds {
  start: Date;
  end: Date;
}

/**
 * The visible time window. Defaults to the min start / max end across steps;
 * either edge can be pinned via overrides. Always returns a positive span.
 */
export function timeBounds(
  steps: CascadeStep[],
  startOverride?: Date,
  endOverride?: Date,
): TimeBounds {
  let min = Infinity;
  let max = -Infinity;
  for (const s of steps) {
    const st = s.start.getTime();
    const en = (s.end ?? s.start).getTime();
    if (st < min) min = st;
    if (en > max) max = en;
  }
  if (!Number.isFinite(min)) min = startOverride?.getTime() ?? Date.now();
  if (!Number.isFinite(max)) max = endOverride?.getTime() ?? min + 3_600_000;

  const start = startOverride ? startOverride.getTime() : min;
  let end = endOverride ? endOverride.getTime() : max;
  if (end <= start) end = start + 3_600_000; // guarantee a positive span
  return { start: new Date(start), end: new Date(end) };
}

/** Pixels per minute for a window rendered at `width` px. */
export function pxPerMinute(start: Date, end: Date, width: number): number {
  const minutes = (end.getTime() - start.getTime()) / 60_000;
  return minutes > 0 ? width / minutes : 0;
}

/** Project a time onto the horizontal axis (px from the window start). */
export function scaleTime(t: Date, start: Date, ppm: number): number {
  return ((t.getTime() - start.getTime()) / 60_000) * ppm;
}

export interface Tick {
  time: Date;
  x: number;
  major: boolean;
  label: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** `HH:mm`, 24-hour, machine face. */
export function formatClock(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** `ddd HH:mm` for within-week axis labels. */
export function formatDayClock(d: Date): string {
  return `${DAYS[d.getDay()]} ${formatClock(d)}`;
}

/** Largest-two-units duration, e.g. `1h 21m`, `21m 40s`, `40s`. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const units: Array<[number, string]> = [
    [Math.floor(total / 86_400), "d"],
    [Math.floor((total % 86_400) / 3_600), "h"],
    [Math.floor((total % 3_600) / 60), "m"],
    [total % 60, "s"],
  ];
  const nonzero = units.filter(([v]) => v > 0);
  const chosen = nonzero.length ? nonzero.slice(0, 2) : ([[0, "m"]] as Array<[number, string]>);
  return chosen.map(([v, u]) => `${v}${u}`).join(" ");
}

/**
 * Hour-aligned axis ticks across the window. Ticks are placed every
 * `stepMinutes`; a tick is "major" at midnight or every `majorEveryHours`.
 */
export function buildTicks(
  start: Date,
  end: Date,
  ppm: number,
  opts?: { stepMinutes?: number; majorEveryHours?: number },
): Tick[] {
  const stepMinutes = opts?.stepMinutes ?? 60;
  const majorEveryHours = opts?.majorEveryHours ?? 6;
  const stepMs = stepMinutes * 60_000;
  const startMs = start.getTime();
  const endMs = end.getTime();

  const first = Math.ceil(startMs / stepMs) * stepMs;
  const ticks: Tick[] = [];
  for (let ms = first; ms <= endMs; ms += stepMs) {
    const time = new Date(ms);
    const midnight = time.getHours() === 0 && time.getMinutes() === 0;
    const major = midnight || time.getHours() % majorEveryHours === 0;
    ticks.push({
      time,
      x: scaleTime(time, start, ppm),
      major,
      label: major ? formatDayClock(time) : formatClock(time),
    });
  }
  return ticks;
}

/** Clamp helper shared by the layout math. */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
