import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@shamrock-design/icons";
import styles from "./ChatKit.module.css";

export interface RunRefChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The run id / doc name, rendered in the machine face. */
  children: ReactNode;
  /** Leading glyph: an icon name (shortcut) or any node. Defaults to `layers`. Pass `null` for none. */
  icon?: IconName | ReactNode;
  /** When set, the chip renders as a clickable `<button>`; otherwise a static `<span>`. */
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

/**
 * Inline machine-face reference to a run id or document (the benchmark
 * `.runref`). Clickable when `onClick` is provided, otherwise a static label.
 */
export function RunRefChip({ children, icon = "layers", onClick, className, ...rest }: RunRefChipProps) {
  const glyph =
    icon == null ? null : (
      <span className={styles.runrefIcon}>
        {typeof icon === "string" ? <Icon name={icon as IconName} size={11} aria-hidden /> : icon}
      </span>
    );

  if (onClick) {
    return (
      <button type="button" className={[styles.runref, className].filter(Boolean).join(" ")} onClick={onClick} {...rest}>
        {glyph}
        {children}
      </button>
    );
  }

  return (
    <span className={[styles.runref, className].filter(Boolean).join(" ")}>
      {glyph}
      {children}
    </span>
  );
}
