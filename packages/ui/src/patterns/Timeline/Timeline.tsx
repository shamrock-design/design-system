import { useMemo, type CSSProperties, type ReactNode } from "react";
import { STATUS_LABELS, type Status } from "../../constants/status";
import { Tag } from "../../components/Tag/Tag";
import styles from "./Timeline.module.css";

/* ────────────────────────────────────────────────────────────────────────────
 * Public model
 * ──────────────────────────────────────────────────────────────────────────── */

export interface TimelineItem {
  id: string;
  lane: string;
  label: string;
  /** Start of the run window. */
  start: Date;
  /** End of the run window. Omit for a milestone / instant event. */
  end?: Date;
  /** Canonical status — drives the left color-bar and the status dot. */
  status: Status;
  /** Renders a "GATE" badge (an approval / control point). */
  gate?: boolean;
  /** Didn't run — dashed outline, faint. */
  ghost?: boolean;
  /** Optional system/source Tag (e.g. "ECC", "BW"). */
  system?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  /** Explicit lane order (top→bottom). Lanes with no items still render. Else derived from item order. */
  lanes?: string[];
  /** Window start. Else the earliest item start. */
  start?: Date;
  /** Window end. Else the latest item end (or start for milestones). */
  end?: Date;
  /** Renders the red NOW rule when it falls inside the window. */
  now?: Date;
  tickEvery?: "hour" | "day" | "auto";
  /** Left label gutter width, px. */
  laneWidth?: number;
  onItemClick?: (item: TimelineItem) => void;
  /** Sub-row pitch, px. */
  rowHeight?: number;
  emptyMessage?: ReactNode;
  /** Accessible name for the grid. */
  "aria-label"?: string;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Pure time → x math (exported + tested)
 * ──────────────────────────────────────────────────────────────────────────── */

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface TimeScale {
  /** Maps a time to a pixel offset in the plot. Unbounded. */
  x: (t: Date) => number;
  /** `x`, clamped to [0, plotWidth] — for bars/nodes that must stay on-canvas. */
  clampX: (t: Date) => number;
  plotWidth: number;
  start: Date;
  end: Date;
  /** Window length in ms (never < 1, so the scale is always finite). */
  spanMs: number;
}

/** Linear time→pixel scale across a window. `px = (t - start) / (end - start) × plotWidth`. */
export function timeScale(window: TimeWindow, plotWidth: number): TimeScale {
  const startMs = window.start.getTime();
  const endMs = window.end.getTime();
  const spanMs = Math.max(1, endMs - startMs); // guard zero / inverted windows
  const x = (t: Date) => ((t.getTime() - startMs) / spanMs) * plotWidth;
  const clampX = (t: Date) => Math.max(0, Math.min(plotWidth, x(t)));
  return { x, clampX, plotWidth, start: window.start, end: window.end, spanMs };
}

export type TickUnit = "hour" | "day";

export interface TickMark {
  date: Date;
  /** `ddd HH:mm`, e.g. "Tue 16:00". */
  label: string;
  /** Day boundary (midnight) for hour ticks; always true for day ticks. */
  major: boolean;
}

const HOUR_MS = 3_600_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** `ddd HH:mm` per docs/guidelines/date-time-format.md (within-week axis format). */
export function formatAxisLabel(d: Date): string {
  return `${WEEKDAYS[d.getDay()] ?? ""} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Largest two units: `1h 20m` / `20m 40s` / `40s`. */
export function formatDuration(ms: number): string {
  const totalSec = Math.round(Math.max(0, ms) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

/** Resolves "auto" to an hour or day cadence (day once a window exceeds 48h). */
export function resolveTickUnit(window: TimeWindow, tickEvery: "hour" | "day" | "auto"): TickUnit {
  if (tickEvery !== "auto") return tickEvery;
  const spanHours = (window.end.getTime() - window.start.getTime()) / HOUR_MS;
  return spanHours > 48 ? "day" : "hour";
}

/** Aligned tick marks across a window — hourly or daily, each labeled `ddd HH:mm`. */
export function tickMarks(window: TimeWindow, tickEvery: "hour" | "day" | "auto" = "auto"): TickMark[] {
  const unit = resolveTickUnit(window, tickEvery);
  const endMs = window.end.getTime();
  const marks: TickMark[] = [];

  const cursor = new Date(window.start);
  if (unit === "hour") {
    cursor.setMinutes(0, 0, 0);
    if (cursor.getTime() < window.start.getTime()) cursor.setHours(cursor.getHours() + 1); // ceil to next hour
    while (cursor.getTime() <= endMs) {
      const date = new Date(cursor);
      marks.push({ date, label: formatAxisLabel(date), major: date.getHours() === 0 });
      cursor.setHours(cursor.getHours() + 1);
    }
  } else {
    cursor.setHours(0, 0, 0, 0);
    if (cursor.getTime() < window.start.getTime()) cursor.setDate(cursor.getDate() + 1); // ceil to next midnight
    while (cursor.getTime() <= endMs) {
      const date = new Date(cursor);
      marks.push({ date, label: formatAxisLabel(date), major: true });
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return marks;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Layout (internal, pure)
 * ──────────────────────────────────────────────────────────────────────────── */

const DEFAULT_LANE_WIDTH = 160;
const DEFAULT_ROW_HEIGHT = 34;
const AXIS_HEIGHT = 32;
const LANE_PAD = 8; // top/bottom padding inside a lane
const MIN_BAR_WIDTH = 6;
const LABEL_RESERVE = 150; // horizontal space reserved after a bar for its trailing label
const PX_PER_HOUR_FINE = 64; // hour cadence
const PX_PER_HOUR_COARSE = 12; // day cadence
const MIN_PLOT_WIDTH = 640;

interface PlacedItem {
  item: TimelineItem;
  left: number;
  width: number;
  subRow: number;
  isMilestone: boolean;
}

function deriveWindow(items: TimelineItem[], start?: Date, end?: Date): TimeWindow {
  let min = start?.getTime() ?? Number.POSITIVE_INFINITY;
  let max = end?.getTime() ?? Number.NEGATIVE_INFINITY;
  for (const item of items) {
    if (!start) min = Math.min(min, item.start.getTime());
    if (!end) max = Math.max(max, (item.end ?? item.start).getTime());
  }
  if (!Number.isFinite(min)) min = Date.now();
  if (!Number.isFinite(max) || max <= min) max = min + HOUR_MS;
  return { start: start ?? new Date(min), end: end ?? new Date(max) };
}

function deriveLanes(items: TimelineItem[], lanes?: string[]): string[] {
  if (lanes) return lanes;
  const seen = new Set<string>();
  const order: string[] = [];
  for (const item of items) {
    if (!seen.has(item.lane)) {
      seen.add(item.lane);
      order.push(item.lane);
    }
  }
  return order;
}

/** Greedy sub-row packing: x is always true time; overlaps resolve down into stacked sub-rows. */
function packLane(items: TimelineItem[], scale: TimeScale): { placed: PlacedItem[]; rows: number } {
  const sorted = [...items].sort((a, b) => a.start.getTime() - b.start.getTime());
  const rowRight: number[] = [];
  const placed: PlacedItem[] = [];
  for (const item of sorted) {
    const isMilestone = item.end === undefined;
    const left = scale.clampX(item.start);
    const width = isMilestone ? 0 : Math.max(MIN_BAR_WIDTH, scale.clampX(item.end as Date) - left);
    const extent = left + Math.max(width, MIN_BAR_WIDTH) + LABEL_RESERVE;
    let row = 0;
    while (row < rowRight.length && (rowRight[row] as number) > left + 0.01) row++;
    rowRight[row] = extent;
    placed.push({ item, left, width, subRow: row, isMilestone });
  }
  return { placed, rows: Math.max(1, rowRight.length) };
}

function itemTimeText(item: TimelineItem): string {
  const startTxt = formatAxisLabel(item.start);
  if (item.end === undefined) return startTxt;
  return `${startTxt} · ${formatDuration(item.end.getTime() - item.start.getTime())}`;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Timeline — a swimlane Gantt. Every item is positioned on a real time axis:
 * its left edge is the start, its width is how long it ran. Lanes group items;
 * a sticky axis and sticky lane gutter keep orientation while the plot scrolls.
 * Calm by default (nominal bars are muted grey); saturated color is reserved for
 * warning/critical — the states that earn attention.
 */
export function Timeline({
  items,
  lanes,
  start,
  end,
  now,
  tickEvery = "auto",
  laneWidth = DEFAULT_LANE_WIDTH,
  onItemClick,
  rowHeight = DEFAULT_ROW_HEIGHT,
  emptyMessage,
  "aria-label": ariaLabel = "Timeline",
}: TimelineProps) {
  const layout = useMemo(() => {
    const laneOrder = deriveLanes(items, lanes);
    const window = deriveWindow(items, start, end);
    const unit = resolveTickUnit(window, tickEvery);
    const spanHours = Math.max(1, (window.end.getTime() - window.start.getTime()) / HOUR_MS);
    const pxPerHour = unit === "day" ? PX_PER_HOUR_COARSE : PX_PER_HOUR_FINE;
    const plotWidth = Math.max(MIN_PLOT_WIDTH, Math.round(spanHours * pxPerHour));
    const scale = timeScale(window, plotWidth);
    const ticks = tickMarks(window, tickEvery);

    const byLane = new Map<string, TimelineItem[]>();
    for (const lane of laneOrder) byLane.set(lane, []);
    for (const item of items) {
      if (!byLane.has(item.lane)) byLane.set(item.lane, []);
      byLane.get(item.lane)!.push(item);
    }

    let top = 0;
    const placedLanes = (byLane.size ? [...byLane.keys()] : laneOrder).map((lane) => {
      const { placed, rows } = packLane(byLane.get(lane) ?? [], scale);
      const height = rows * rowHeight + LANE_PAD * 2;
      const laneTop = top;
      top += height;
      return { lane, placed, top: laneTop, height };
    });

    const totalHeight = top;
    const nowInWindow =
      now !== undefined && now.getTime() >= window.start.getTime() && now.getTime() <= window.end.getTime();

    return { scale, ticks, plotWidth, placedLanes, totalHeight, nowX: nowInWindow ? scale.x(now as Date) : null };
  }, [items, lanes, start, end, now, tickEvery, rowHeight]);

  if (items.length === 0 && (!lanes || lanes.length === 0)) {
    return (
      <div className={styles.root}>
        <div className={styles.empty}>{emptyMessage ?? "No timeline items yet. Items appear here once runs are scheduled."}</div>
      </div>
    );
  }

  const { scale, ticks, plotWidth, placedLanes, totalHeight, nowX } = layout;
  const canvasWidth = laneWidth + plotWidth;
  const gutterVars = { "--sh-tl-lane-width": `${laneWidth}px` } as CSSProperties;

  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        <div className={styles.canvas} style={{ width: canvasWidth, ...gutterVars }}>
          {/* Sticky time axis */}
          <div className={styles.axis} style={{ width: canvasWidth, height: AXIS_HEIGHT }} aria-hidden="true">
            <div className={styles.axisCorner} />
            {ticks.map((tick) => (
              <div
                key={tick.date.getTime()}
                className={[styles.tick, tick.major && styles.tickMajor].filter(Boolean).join(" ")}
                style={{ left: laneWidth + scale.x(tick.date), height: AXIS_HEIGHT }}
              >
                <span className={styles.tickLabel}>{tick.label}</span>
              </div>
            ))}
          </div>

          {/* Grid, now-line, lanes */}
          <div className={styles.lanes} role="grid" aria-label={ariaLabel} style={{ width: canvasWidth }}>
            {ticks.map((tick) => (
              <div
                key={`g${tick.date.getTime()}`}
                className={[styles.gridLine, tick.major && styles.gridLineMajor].filter(Boolean).join(" ")}
                style={{ left: laneWidth + scale.x(tick.date), height: totalHeight }}
                aria-hidden="true"
              />
            ))}

            {nowX !== null && (
              <div className={styles.nowLine} style={{ left: laneWidth + nowX, height: totalHeight }} aria-hidden="true">
                <span className={styles.nowTag}>NOW</span>
              </div>
            )}

            {placedLanes.map(({ lane, placed, height }) => (
              <div key={lane} className={styles.lane} role="row" style={{ height, width: canvasWidth }}>
                <div className={styles.laneLabel} role="rowheader">
                  <span className={styles.laneName}>{lane}</span>
                </div>
                {placed.map((p) => (
                  <TimelineNode
                    key={p.item.id}
                    placed={p}
                    lane={lane}
                    laneWidth={laneWidth}
                    rowHeight={rowHeight}
                    onItemClick={onItemClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineNodeProps {
  placed: PlacedItem;
  lane: string;
  laneWidth: number;
  rowHeight: number;
  onItemClick?: (item: TimelineItem) => void;
}

function TimelineNode({ placed, lane, laneWidth, rowHeight, onItemClick }: TimelineNodeProps) {
  const { item, left, width, subRow, isMilestone } = placed;
  const timeText = itemTimeText(item);
  const statusVars = { "--sh-tl-status-base": `var(--sh-color-status-${item.status}-base)` } as CSSProperties;
  const interactive = Boolean(onItemClick);

  const ariaLabel = [
    `${lane}: ${item.label}`,
    STATUS_LABELS[item.status],
    item.gate ? "gate" : "",
    item.ghost ? "didn't run" : "",
    timeText,
  ]
    .filter(Boolean)
    .join(", ");

  const inner = (
    <>
      {isMilestone ? (
        <span className={styles.diamond} aria-hidden="true" />
      ) : (
        <span className={styles.bar} style={{ width }} aria-hidden="true" />
      )}
      <span className={styles.label}>
        {!isMilestone && <span className={styles.dot} aria-hidden="true" />}
        <span className={styles.labelText} title={item.label}>
          {item.label}
        </span>
        {item.system && (
          <Tag tone="neutral" mono size="sm" className={styles.system}>
            {item.system}
          </Tag>
        )}
        <span className={styles.time}>{timeText}</span>
        {item.gate && <span className={styles.gate}>GATE</span>}
        {item.ghost && <span className={styles.ghostTag}>didn't run</span>}
      </span>
    </>
  );

  const cellStyle: CSSProperties = {
    left: laneWidth + left,
    top: LANE_PAD + subRow * rowHeight,
    height: rowHeight,
    ...statusVars,
  };

  const dataProps = {
    "data-timeline-item": item.id,
    "data-kind": isMilestone ? "milestone" : "bar",
    "data-status": item.status,
    "data-ghost": item.ghost ? "" : undefined,
    "data-gate": item.gate ? "" : undefined,
  };

  return (
    <div className={styles.cell} role="gridcell" style={cellStyle}>
      {interactive ? (
        <button
          type="button"
          className={[styles.node, styles.interactive].join(" ")}
          onClick={() => onItemClick?.(item)}
          aria-label={ariaLabel}
          title={`${item.label} — ${timeText}`}
          {...dataProps}
        >
          {inner}
        </button>
      ) : (
        <div className={styles.node} title={`${item.label} — ${timeText}`} {...dataProps}>
          {inner}
        </div>
      )}
    </div>
  );
}
