import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import styles from "./Tooltip.module.css";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Tooltip body. For truncated values this is the full, untruncated value. */
  content: ReactNode;
  /** A single trigger element — Base UI merges the trigger behavior onto it. */
  children: ReactElement;
  side?: TooltipSide;
  /** Hover open delay in ms. Keyboard focus opens instantly. */
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Renders the trigger but never opens the tooltip. */
  disabled?: boolean;
}

/**
 * Ink-bubble clarification on hover/focus. Canon: every truncated value must
 * carry one of these with the full value (docs/guidelines/truncation.md).
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 300,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
}: TooltipProps) {
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      disabled={disabled}
    >
      <BaseTooltip.Trigger render={children} delay={delay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className={styles.positioner}>
          <BaseTooltip.Popup className={styles.popup}>{content}</BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export interface TooltipProviderProps {
  children?: ReactNode;
  /** Shared hover open delay in ms. Per-tooltip `delay` still wins. */
  delay?: number;
  closeDelay?: number;
  /** Window (ms) in which an adjacent tooltip opens instantly after one closes. */
  timeout?: number;
}

/**
 * Groups adjacent tooltips (toolbars, icon rows): once one is open, moving to
 * a sibling trigger opens its tooltip instantly.
 */
export function TooltipProvider({ children, delay = 300, closeDelay, timeout }: TooltipProviderProps) {
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
      {children}
    </BaseTooltip.Provider>
  );
}
