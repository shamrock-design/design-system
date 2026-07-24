import type { ChartTone } from "./types";

/** Number of slots in the validated categorical chart palette. */
export const CATEGORICAL_SLOTS = 5;

/** Dev-only guard that doesn't depend on Node's `process` typings (keeps the DTS build clean). */
function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
  return env !== "production";
}

/**
 * Resolve a categorical series color from its fixed slot index.
 *
 * Colors are assigned in FIXED order (0 → `--sh-color-chart-cat-1` … 4 → cat-5) and NEVER
 * cycled: a 6th series is a design smell, not a repeated hue. In dev this throws so the
 * mistake surfaces immediately; in prod it wraps (defensive) rather than crash a dashboard.
 *
 * Color follows the entity — pass a series' `colorIndex` here to keep its hue stable when
 * other series are filtered out.
 */
export function seriesColor(index: number): string {
  if (isDev() && (index < 0 || index >= CATEGORICAL_SLOTS)) {
    throw new Error(
      `Shamrock charts: series color index ${index} is out of range (0–${CATEGORICAL_SLOTS - 1}). ` +
        "The categorical palette has exactly 5 slots — fold extra series into “Other” or facet into small multiples.",
    );
  }
  const slot = ((index % CATEGORICAL_SLOTS) + CATEGORICAL_SLOTS) % CATEGORICAL_SLOTS;
  return `var(--sh-color-chart-cat-${slot + 1})`;
}

/**
 * Resolve the color for an inline glyph's tone. `neutral` → calm ink, `accent` → the themable
 * system accent, and every other value maps to that status' base color. Status tones are for
 * glyphs that already carry a visible status label (canon #4 — never color alone).
 */
export function toneColor(tone: ChartTone): string {
  if (tone === "neutral") return "var(--sh-color-ink-5)";
  if (tone === "accent") return "var(--sh-color-accent-base)";
  return `var(--sh-color-status-${tone}-base)`;
}
