/**
 * THE canonical status vocabulary for every Shamrock surface: badges, tags,
 * table cells, timeline nodes, chart accents. See docs/guidelines/status-vocabulary.md.
 *
 * Production apps drifted into "Finished"/"Completed"/"success" and
 * "Overdue"/"Delayed" — `mapLegacyStatus` normalizes those during migration.
 */
export const STATUSES = [
  "neutral",
  "info",
  "success",
  "warning",
  "critical",
  "pending",
  "running",
] as const;

export type Status = (typeof STATUSES)[number];

/** Human display labels. Status must always render as dot + label, never color alone. */
export const STATUS_LABELS: Record<Status, string> = {
  neutral: "Neutral",
  info: "Info",
  success: "Success",
  warning: "Warning",
  critical: "Critical",
  pending: "Pending",
  running: "Running",
};

const LEGACY: Record<string, Status> = {
  // done family
  finished: "success",
  completed: "success",
  complete: "success",
  success: "success",
  passed: "success",
  pass: "success",
  done: "success",
  healthy: "success",
  active: "success",
  "on-time": "success",
  // failure family
  failed: "critical",
  fail: "critical",
  aborted: "critical",
  error: "critical",
  blocked: "critical",
  // late family
  overdue: "warning",
  delayed: "warning",
  late: "warning",
  warn: "warning",
  // in-flight family
  running: "running",
  "in-progress": "running",
  executing: "running",
  // waiting family
  pending: "pending",
  queued: "pending",
  scheduled: "pending",
  locked: "pending",
  "no-runs": "pending",
  ready: "info",
  "up-next": "info",
};

/** Normalize a legacy/foreign status string to the canonical enum. */
export function mapLegacyStatus(raw: string): Status {
  const key = raw.trim().toLowerCase().replace(/[\s_]+/g, "-");
  const mapped = LEGACY[key] ?? (STATUSES as readonly string[]).includes(key);
  if (typeof mapped === "string") return mapped;
  return mapped ? (key as Status) : "neutral";
}
