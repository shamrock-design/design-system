import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ChatKit.module.css";

export interface SuggestionItem {
  label: ReactNode;
  onClick?: () => void;
  /** Disable this single chip. */
  disabled?: boolean;
}

export interface SuggestionChipsProps extends HTMLAttributes<HTMLDivElement> {
  items: SuggestionItem[];
  /** Accessible label for the chip group. */
  "aria-label"?: string;
}

/**
 * Prompt starters ("Refine, add, remove, ask…") as accent-outline buttons in a
 * wrapping row. Tag-like, but interactive — each fires its own `onClick`.
 */
export function SuggestionChips({ items, className, "aria-label": ariaLabel = "Suggestions", ...rest }: SuggestionChipsProps) {
  if (items.length === 0) return null;
  return (
    <div
      className={[styles.suggestions, className].filter(Boolean).join(" ")}
      role="group"
      aria-label={ariaLabel}
      {...rest}
    >
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          className={styles.chip}
          onClick={item.onClick}
          disabled={item.disabled}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
