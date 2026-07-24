import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { STATUS_LABELS, type Status } from "../../constants/status";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { Text } from "../../primitives/Text/Text";
import {
  barState,
  buildTicks,
  clamp,
  egoGraph,
  dependencySort,
  formatClock,
  formatDuration,
  forwardAdjacency,
  kinSet,
  pxPerMinute,
  scaleTime,
  timeBounds,
  blocksCount,
  type BarState,
  type CascadeStep,
} from "./helpers";
import styles from "./CascadeTimeline.module.css";

export type { CascadeStep } from "./helpers";
export {
  dependencySort,
  egoGraph,
  kinSet,
  timeBounds,
  scaleTime,
  buildTicks,
  barState,
} from "./helpers";

export interface CascadeTimelineProps {
  /** The run graph. Sorted into dependency (topological) order internally. */
  steps: CascadeStep[];
  /** Draws the red NOW line when provided; omit for a plan with no live cursor. */
  now?: Date;
  /** Pin the left/right edge of the time window (defaults to the data extent). */
  start?: Date;
  end?: Date;
  /** Fires whenever a step is activated (row click or an ego-graph chip). */
  onStepClick?: (step: CascadeStep) => void;
  /** Controlled expanded ego-graph. Pass with `onExpandedChange` to control. */
  expandedId?: string;
  onExpandedChange?: (id: string | null) => void;
  /** Viewport height in px (the row area scrolls inside it). */
  height?: number;
}

/* layout — px */
const PITCH = 34;
const AXH = 34;
const LABEL_W = 264;
const BAR_H = 12;
const PX_PER_HOUR = 96;
const RIGHT_PAD = 96;

/* ego-graph panel — px */
const NB_H = 28;
const NB_PITCH = 34;
const CTR_H = 52;
const P_TOP = 46;
const P_BOT = 48;
const P_PADX = 28;
const MIN_COL = 176;
const MAX_COL = 280;
const MIN_GAP = 40;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const BAR_CLASS: Record<BarState, string> = {
  done: "bDone",
  run: "bRun",
  late: "bLate",
  fail: "bFail",
  ready: "bReady",
  locked: "bLocked",
  ghost: "bGhost",
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function statusDotVar(step: CascadeStep): string {
  return step.ghost ? "var(--sh-color-amber-base)" : `var(--sh-color-status-${step.status}-base)`;
}

function neighbourDotVar(state: BarState): string {
  switch (state) {
    case "done":
      return "var(--sh-color-status-success-base)";
    case "run":
    case "late":
    case "ghost":
      return "var(--sh-color-amber-base)";
    case "fail":
      return "var(--sh-color-status-critical-base)";
    case "ready":
      return "var(--sh-color-status-info-base)";
    case "locked":
    default:
      return "var(--sh-color-status-pending-base)";
  }
}

function neighbourText(step: CascadeStep, side: "need" | "unlock"): string {
  const state = barState(step);
  const end = step.end ?? step.start;
  if (state === "ghost") return "projected";
  if (state === "done") return side === "need" ? `met · ${formatClock(end)}` : "done";
  if (state === "fail") return "failed";
  if (state === "run") return "running…";
  if (state === "late") return "late";
  if (state === "ready") return side === "need" ? "ready" : `ready · ${formatClock(step.start)}`;
  return side === "need" ? "waiting" : `starts ${formatClock(step.start)}`;
}

function elbow(x1: number, y1: number, xm: number, y2: number, x2: number): string {
  return `M${x1} ${Math.round(y1)} H${xm} V${Math.round(y2)} H${x2}`;
}

/**
 * CascadeTimeline — the F1 dependency-sorted waterfall. Steps are topologically
 * ordered so dependency points down-and-right by construction (zero resting
 * edges); clicking a row opens a bounded accordion ego-graph (needs · N → step →
 * unlocks · N) in place, so dependency ink never sprawls across the chart.
 */
export function CascadeTimeline({
  steps,
  now,
  start,
  end,
  onStepClick,
  expandedId,
  onExpandedChange,
  height = 520,
}: CascadeTimelineProps) {
  const baseId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dayChipRef = useRef<HTMLSpanElement>(null);

  /* controlled / uncontrolled expansion (one open at a time) */
  const controlled = expandedId !== undefined;
  const [internalId, setInternalId] = useState<string | null>(null);
  const currentId = controlled ? (expandedId ?? null) : internalId;
  const setExpanded = useCallback(
    (id: string | null) => {
      if (!controlled) setInternalId(id);
      onExpandedChange?.(id);
    },
    [controlled, onExpandedChange],
  );

  /* dependency-sorted rows + lookups */
  const sorted = useMemo(() => dependencySort(steps), [steps]);
  const rowIndex = useMemo(() => new Map(sorted.map((s, i) => [s.id, i])), [sorted]);
  const adjacency = useMemo(() => forwardAdjacency(sorted), [sorted]);
  const bounds = useMemo(() => timeBounds(steps, start, end), [steps, start, end]);

  const ppm = PX_PER_HOUR / 60;
  const spanX = scaleTime(bounds.end, bounds.start, ppm);
  const clockWidth = Math.max(spanX, 240) + RIGHT_PAD;
  const canvasWidth = LABEL_W + clockWidth;
  const ticks = useMemo(
    () => buildTicks(bounds.start, bounds.end, ppm),
    [bounds, ppm],
  );

  const nowX = useMemo(() => {
    if (!now) return null;
    const ms = clamp(now.getTime(), bounds.start.getTime(), bounds.end.getTime());
    return scaleTime(new Date(ms), bounds.start, ppm);
  }, [now, bounds, ppm]);

  /* selection / ego-graph */
  const selStep = currentId ? sorted.find((s) => s.id === currentId) ?? null : null;
  const selIdx = currentId ? rowIndex.get(currentId) ?? -1 : -1;
  const ego = useMemo(
    () => (currentId ? egoGraph(sorted, currentId) : { needs: [], unlocks: [] }),
    [sorted, currentId],
  );
  const kin = useMemo(
    () => (currentId ? kinSet(sorted, currentId) : null),
    [sorted, currentId],
  );

  const nD = ego.needs.length;
  const nU = ego.unlocks.length;
  const nbRows = Math.max(nD, nU, 1);
  const bodyH = (nbRows - 1) * NB_PITCH + NB_H;
  const PANEL_H = selStep ? P_TOP + bodyH + P_BOT : 0;

  /* responsive ego-graph columns — spread across the measured viewport */
  const [panelW, setPanelW] = useState(0);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setPanelW(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = panelW || 960;
  const avail = Math.max(0, W - 2 * P_PADX);
  let colW = clamp(avail * 0.28, MIN_COL, MAX_COL);
  let gap = (avail - 3 * colW) / 2;
  if (gap < MIN_GAP) {
    gap = MIN_GAP;
    colW = Math.max(120, (avail - 2 * gap) / 3);
  }
  const xL = P_PADX;
  const xC = P_PADX + colW + gap;
  const xR = P_PADX + 2 * (colW + gap);
  const midIn = xL + colW + gap / 2;
  const midOut = xC + colW + gap / 2;
  const yCtrMid = P_TOP + bodyH / 2;
  const yCtrTop = yCtrMid - CTR_H / 2;
  const nbY = (i: number) => P_TOP + i * NB_PITCH;

  /* footer rollups */
  const needsMet = ego.needs.filter((s) => barState(s) === "done").length;
  const needsText = !selStep
    ? ""
    : nD === 0
      ? "root · no upstream needs"
      : needsMet === nD
        ? `all ${nD} need${nD > 1 ? "s" : ""} met`
        : `${needsMet}/${nD} needs met · ${nD - needsMet} pending`;
  const totalBlocks = selStep ? blocksCount(sorted, selStep.id) : 0;
  const impactText = !selStep
    ? ""
    : nU === 0
      ? "sink · frees nothing downstream"
      : `frees ${nU} direct · blocks ${totalBlocks} total`;

  /* day chip follows horizontal scroll */
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !dayChipRef.current) return;
    const ms = bounds.start.getTime() + (el.scrollLeft / (ppm || 1)) * 60_000;
    dayChipRef.current.textContent = DAY_LABELS[new Date(ms).getDay()] ?? "";
  }, [bounds, ppm]);

  /* Escape collapses the open ego-graph */
  useEffect(() => {
    if (!currentId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentId, setExpanded]);

  const activateRow = (step: CascadeStep) => {
    onStepClick?.(step);
    setExpanded(currentId === step.id ? null : step.id);
  };
  const walkTo = (step: CascadeStep) => {
    onStepClick?.(step);
    setExpanded(step.id);
  };

  const rootStyle = { height } as CSSProperties;
  const boardW = { width: canvasWidth } as CSSProperties;

  return (
    <div className={styles.root} style={rootStyle} role="group" aria-label="Cascade timeline">
      <div className={styles.scroll} ref={scrollRef} onScroll={onScroll}>
        <div className={styles.canvas} style={boardW}>
          {/* sticky time axis */}
          <div className={styles.axis}>
            <span className={styles.axisCorner} style={{ width: LABEL_W }}>
              <span className={styles.dayChip} ref={dayChipRef}>
                {DAY_LABELS[bounds.start.getDay()]}
              </span>
              <span className={styles.axisLegend}>topo ↓ · time →</span>
            </span>
            <div className={styles.axisClip}>
              {ticks.map((t) => (
                <span
                  key={t.time.getTime()}
                  className={cx(styles.tick, t.major && styles.tickMajor)}
                  style={{ left: LABEL_W + t.x }}
                >
                  {t.label}
                </span>
              ))}
              {nowX !== null && (
                <span className={styles.nowTag} style={{ left: LABEL_W + nowX }} data-nowtag>
                  NOW
                </span>
              )}
            </div>
          </div>

          {/* board — rows in flow so the accordion pushes rows below it down */}
          <div className={styles.board}>
            {/* full-height grid + NOW line, clipped to the clock region */}
            <div className={styles.gridLayer} style={{ left: LABEL_W, width: clockWidth }} aria-hidden="true">
              {ticks.map((t) => (
                <span
                  key={t.time.getTime()}
                  className={cx(styles.grid, t.major && styles.gridMajor)}
                  style={{ left: t.x }}
                />
              ))}
              {nowX !== null && (
                <span className={styles.nowLine} style={{ left: nowX }} data-nowline data-now-x={Math.round(nowX)} />
              )}
            </div>

            {sorted.map((step, i) => {
              const state = barState(step);
              const isSel = currentId === step.id;
              const isKin = kin ? kin.has(step.id) && !isSel : Boolean(step.kin);
              const barLeft = scaleTime(step.start, bounds.start, ppm);
              const barRight = scaleTime(step.end ?? step.start, bounds.start, ppm);
              const barW = Math.max(3, barRight - barLeft);
              const needsCount = step.needs?.length ?? 0;
              const unlocksCount = adjacency.get(step.id)?.length ?? 0;
              const timeChip =
                step.end && isSel
                  ? `${formatClock(step.start)} → ${formatClock(step.end)} · ${formatDuration(step.end.getTime() - step.start.getTime())}`
                  : null;

              return (
                <Fragment key={step.id}>
                  <button
                    type="button"
                    className={cx(styles.row, isSel && styles.rowSel, isKin && styles.rowKin)}
                    style={{ height: PITCH }}
                    aria-expanded={isSel}
                    aria-controls={isSel ? `${baseId}-panel` : undefined}
                    aria-label={`${step.label} — ${STATUS_LABELS[step.status]}${step.gate ? ", gate" : ""}${step.ghost ? ", projected" : ""}`}
                    data-step-id={step.id}
                    data-status={step.status}
                    data-bar-state={state}
                    data-gate={step.gate ? "true" : undefined}
                    data-ghost={step.ghost ? "true" : undefined}
                    data-kin={isKin ? "true" : undefined}
                    onClick={() => activateRow(step)}
                  >
                    <span className={styles.labelCell} style={{ width: LABEL_W }}>
                      <span className={styles.gutterL}>{needsCount ? `◀${needsCount}` : ""}</span>
                      <span className={styles.seq}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={styles.dot} style={{ background: statusDotVar(step) }} aria-hidden="true" />
                      <span className={styles.name} title={step.technical ?? step.label}>
                        {step.label}
                      </span>
                      {step.gate && <span className={styles.gate}>GATE</span>}
                      {step.ghost && <span className={styles.ghostTag}>GHOST</span>}
                      <span className={styles.gutterR}>{unlocksCount ? `${unlocksCount}▶` : ""}</span>
                    </span>
                    <span className={styles.clockCell}>
                      <span
                        className={cx(styles.bar, styles[BAR_CLASS[state]], state === "run" && styles.live)}
                        style={{ left: barLeft, width: barW, height: BAR_H }}
                        data-bar
                      />
                      {timeChip && (
                        <span className={styles.timeChip} style={{ left: barLeft + barW + 8 }}>
                          {timeChip}
                        </span>
                      )}
                    </span>
                  </button>

                  {isSel && selStep && (
                    <div
                      className={styles.panel}
                      id={`${baseId}-panel`}
                      role="region"
                      aria-label={`Dependencies for ${selStep.label}`}
                      style={{ height: PANEL_H }}
                    >
                      <div
                        className={styles.panelInner}
                        style={{ width: W, height: PANEL_H }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className={styles.edges} width={W} height={PANEL_H} shapeRendering="crispEdges" aria-hidden="true">
                          {ego.needs.map((nStep, idx) => (
                            <path
                              key={`in-${nStep.id}`}
                              d={elbow(xL + colW, nbY(idx) + NB_H / 2, midIn, yCtrMid, xC)}
                            />
                          ))}
                          {ego.unlocks.map((uStep, idx) => (
                            <path
                              key={`out-${uStep.id}`}
                              className={styles.edgeOut}
                              d={elbow(xC + colW, yCtrMid, midOut, nbY(idx) + NB_H / 2, xR)}
                            />
                          ))}
                        </svg>

                        <span className={styles.colHead} style={{ left: xL, width: colW }}>
                          needs{nD ? ` · ${nD}` : ""}
                        </span>
                        <span className={styles.colHead} style={{ left: xR, width: colW }}>
                          unlocks{nU ? ` · ${nU}` : ""}
                        </span>
                        <button
                          type="button"
                          className={styles.close}
                          aria-label="Collapse dependencies"
                          onClick={() => setExpanded(null)}
                        >
                          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.4" fill="none" />
                          </svg>
                        </button>

                        {nD === 0 && (
                          <span className={styles.none} style={{ left: xL, top: yCtrMid - 8, width: colW }}>
                            — none —
                          </span>
                        )}
                        {ego.needs.map((nStep, idx) => {
                          const st = barState(nStep);
                          return (
                            <button
                              key={`nd-${nStep.id}`}
                              type="button"
                              className={cx(styles.chip, nStep.ghost && styles.chipGhost)}
                              style={{ left: xL, top: nbY(idx), width: colW, height: NB_H }}
                              onClick={() => walkTo(nStep)}
                              title={nStep.technical ?? nStep.label}
                              data-neighbour="need"
                            >
                              <span className={styles.chipDot} style={{ background: neighbourDotVar(st) }} />
                              <span className={styles.chipName}>{nStep.label}</span>
                              <span className={styles.chipMeta}>{neighbourText(nStep, "need")}</span>
                            </button>
                          );
                        })}

                        <div
                          className={cx(styles.chip, styles.chipCenter)}
                          style={{ left: xC, top: yCtrTop, width: colW, height: CTR_H }}
                          onClick={() => onStepClick?.(selStep)}
                          role={onStepClick ? "button" : undefined}
                          tabIndex={onStepClick ? 0 : undefined}
                          onKeyDown={(e) => {
                            if (onStepClick && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              onStepClick(selStep);
                            }
                          }}
                          data-center
                        >
                          <span className={styles.chipCenterName}>{selStep.label}</span>
                          <span className={styles.chipCenterMeta}>
                            <StatusBadge status={selStep.status} size="sm" />
                            {selStep.end && (
                              <Text as="span" variant="machine" className={styles.chipCenterTime}>
                                {formatClock(selStep.start)} → {formatClock(selStep.end)} ·{" "}
                                {formatDuration(selStep.end.getTime() - selStep.start.getTime())}
                              </Text>
                            )}
                          </span>
                        </div>

                        {nU === 0 && (
                          <span className={styles.none} style={{ left: xR, top: yCtrMid - 8, width: colW }}>
                            — none —
                          </span>
                        )}
                        {ego.unlocks.map((uStep, idx) => {
                          const st = barState(uStep);
                          return (
                            <button
                              key={`ul-${uStep.id}`}
                              type="button"
                              className={cx(styles.chip, uStep.ghost && styles.chipGhost)}
                              style={{ left: xR, top: nbY(idx), width: colW, height: NB_H }}
                              onClick={() => walkTo(uStep)}
                              title={uStep.technical ?? uStep.label}
                              data-neighbour="unlock"
                            >
                              <span className={styles.chipDot} style={{ background: neighbourDotVar(st) }} />
                              <span className={styles.chipName}>{uStep.label}</span>
                              <span className={styles.chipMeta}>{neighbourText(uStep, "unlock")}</span>
                            </button>
                          );
                        })}

                        <div className={styles.foot} style={{ left: P_PADX, right: P_PADX }}>
                          <Text
                            as="span"
                            variant="machine"
                            className={cx(styles.footNeeds, needsMet === nD || nD === 0 ? styles.footMet : styles.footPending)}
                          >
                            {needsText}
                          </Text>
                          <Text as="span" variant="machine" className={styles.footImpact}>
                            {impactText}
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
