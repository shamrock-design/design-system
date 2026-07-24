import type { CascadeStep, Status } from "@shamrock-design/ui";

/**
 * Sample data for the spnr flagship rebuild (benchmark quality gate).
 * spnr is an agentic-workflow platform: each Process is a goal the agent pursues
 * end-to-end through Connectors, pausing only when it needs a person.
 * Shared by ProcessesView (landing) and BuilderView (run detail + Ask SPNR).
 */

export type ProcessLifecycle = "live" | "paused" | "draft";
export type ProcessTrigger = "schedule" | "event" | "manual";

export interface SpnrProcess {
  id: string;
  name: string;
  desc: string;
  lifecycle: ProcessLifecycle;
  trigger: ProcessTrigger;
  /** Canonical status of the most recent run. */
  latestRunStatus: Status;
  /** Machine-face relative time, e.g. "12m ago". */
  latestRunLabel: string;
  /** How many runs are in flight right now. */
  inflight: number;
  /** Machine-face "next run in …" when scheduled/live. */
  next?: string;
  /** Set when the process needs a person — renders the critical attention pill. */
  attention?: string;
}

export const TRIGGER_LABEL: Record<ProcessTrigger, string> = {
  schedule: "Schedule",
  event: "Event",
  manual: "Manual",
};

/** Map the process lifecycle to a canonical status for the dot/badge. */
export const LIFECYCLE_STATUS: Record<ProcessLifecycle, Status> = {
  live: "success",
  paused: "warning",
  draft: "neutral",
};

export const PROCESSES: SpnrProcess[] = [
  {
    id: "supply-replan",
    name: "Weekly Supply Replan",
    desc: "Rebuilds the constrained supply plan from fresh master data, then hands off to review when a gate trips.",
    lifecycle: "live",
    trigger: "schedule",
    latestRunStatus: "critical",
    latestRunLabel: "8m ago",
    inflight: 1,
    next: "next run in 6d",
    attention: "gate blocked",
  },
  {
    id: "mdm-recon",
    name: "Master Data Reconciliation",
    desc: "Nightly reconciliation of product, location and BOM master data across IBP, ECC and BW.",
    lifecycle: "live",
    trigger: "schedule",
    latestRunStatus: "success",
    latestRunLabel: "3h ago",
    inflight: 0,
    next: "next run in 9h",
  },
  {
    id: "exception-triage",
    name: "Exception Triage",
    desc: "Watches the exception queue and routes each anomaly to the right owner with a suggested fix.",
    lifecycle: "live",
    trigger: "event",
    latestRunStatus: "running",
    latestRunLabel: "live",
    inflight: 3,
  },
  {
    id: "demand-sensing",
    name: "Demand Sensing Sync",
    desc: "Pulls short-term demand signals and refreshes the sensing layer before the daily planning window.",
    lifecycle: "paused",
    trigger: "schedule",
    latestRunStatus: "neutral",
    latestRunLabel: "2d ago",
    inflight: 0,
  },
  {
    id: "orphan-sweep",
    name: "Orphan Sweep",
    desc: "Finds planning objects with no owning demand and proposes cleanup, holding for approval before deleting.",
    lifecycle: "live",
    trigger: "event",
    latestRunStatus: "warning",
    latestRunLabel: "41m ago",
    inflight: 0,
    attention: "7 orphans held",
  },
  {
    id: "capacity-guardrail",
    name: "Capacity Guardrail",
    desc: "Checks rough-cut capacity against committed load and raises a case when a resource crosses its band.",
    lifecycle: "draft",
    trigger: "manual",
    latestRunStatus: "neutral",
    latestRunLabel: "not published",
    inflight: 0,
  },
];

/** The run rendered in the builder — a Weekly Supply Replan run stalled at the RBP gate. */
const d = (h: number, m = 0) => new Date(2026, 6, 22, h, m);

export const RUN_PROCESS = PROCESSES[0]!; // Weekly Supply Replan
export const RUN_ID = "RUN-2202";
export const RUN_NOW = d(21, 25);

export const RUN_STEPS: CascadeStep[] = [
  { id: "mds", label: "Master Data Sync", technical: "/IBP/MDMR_EXECUTE", start: d(19), end: d(20, 21), status: "success", unlocks: ["rbp"] },
  { id: "rbp", label: "RBP Load & Validation", technical: "PLNG-RBP-LOAD", start: d(20, 30), end: d(21), status: "critical", needs: ["mds"], gate: true, unlocks: ["srr", "dem"] },
  { id: "srr", label: "Exclude SRR", technical: "/IBP/SRR_EXCLUDE", start: d(21, 10), end: d(21, 40), status: "running", needs: ["rbp"], unlocks: ["cap"] },
  { id: "dem", label: "Demand Snapshot", technical: "/IBP/DEM_SNAPSHOT_W", start: d(21, 15), end: d(22), status: "pending", needs: ["rbp"], ghost: true },
  { id: "cap", label: "Capacity Rough-Cut", technical: "PLNG-CAP-ROUGHCUT", start: d(22), end: d(23), status: "pending", needs: ["srr"], kin: true },
];
