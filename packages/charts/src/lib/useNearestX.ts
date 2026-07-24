import { useCallback, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { nearestIndex } from "./math";

export interface NearestXState {
  /** Index of the datum nearest the pointer, or `null` when the pointer is away. */
  index: number | null;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Tracks which datum a pointer is nearest, by pixel distance along x. Attach the returned
 * handlers to a plot-area overlay whose left edge coincides with the plotted origin, so the
 * pointer's local x compares directly against `xPixels` (the scaled x of each datum).
 *
 * jsdom can't measure layout, so this stays quiet in tests; the pure `nearestIndex` math it
 * relies on is unit-tested directly.
 */
export function useNearestX(xPixels: number[]): NearestXState {
  const [index, setIndex] = useState<number | null>(null);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<SVGElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      setIndex(nearestIndex(xPixels, localX));
    },
    [xPixels],
  );

  const onPointerLeave = useCallback(() => setIndex(null), []);

  return { index, onPointerMove, onPointerLeave };
}
