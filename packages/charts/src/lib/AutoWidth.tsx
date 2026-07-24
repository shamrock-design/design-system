import type { ReactNode } from "react";
import { ParentSize } from "@visx/responsive";

export interface AutoWidthProps {
  /** When provided, bypasses measurement entirely (used by tests, where jsdom can't measure). */
  width?: number;
  children: (width: number) => ReactNode;
}

/**
 * Supplies a pixel width to a chart: the explicit `width` prop when given, otherwise the measured
 * width of a full-bleed wrapper via `@visx/responsive`'s `ParentSize`. Height is always explicit,
 * so only width needs measuring.
 */
export function AutoWidth({ width, children }: AutoWidthProps) {
  if (width != null) return <>{children(width)}</>;
  return (
    <div style={{ width: "100%" }}>
      <ParentSize>{({ width: measured }) => (measured > 0 ? children(measured) : null)}</ParentSize>
    </div>
  );
}
