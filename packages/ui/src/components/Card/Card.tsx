import type { AnchorHTMLAttributes, CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { SpaceToken } from "../../primitives/Stack/Stack";
import type { Status } from "../../constants/status";
import styles from "./Card.module.css";

export type CardVariant = "glass" | "solid" | "faint";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  /** glass = surface-card + blur; solid = surface-solid (dense data); faint = surface-faint. */
  variant?: CardVariant;
  /**
   * 3px top color bar. `true` = accent-base; a `Status` value = that status's
   * base color (the `.pcard` stage-bar pattern). Decorative — pair with a
   * StatusBadge for the actual state label (canon: never color alone).
   */
  accentBar?: boolean | Status;
  /** Hover lift + shadow-2 + focus ring. Inferred true when `onClick`/`href` is set. */
  interactive?: boolean;
  /** Renders the card as an `<a>`. Wins over `onClick` for element choice. */
  href?: string;
  /** Renders the card as a `<button type="button">` (unless `href` is set). */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Index into the spacing scale (`--sh-space-N`). Use 0 for flush content. */
  padding?: SpaceToken;
  children?: ReactNode;
}

/**
 * The generic composition surface: glass/solid/faint panel + hairline border,
 * optional stage color-bar, optional button/link semantics. Metrics with
 * baselines belong to KPITile; free-form everything else belongs here.
 */
function CardRoot({
  variant = "glass",
  accentBar = false,
  interactive,
  href,
  onClick,
  padding = 6,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const isInteractive = interactive ?? (onClick != null || href != null);
  const vars: CSSProperties = { "--sh-card-padding": `var(--sh-space-${padding})` } as CSSProperties;
  if (typeof accentBar === "string") {
    (vars as Record<string, string>)["--sh-card-accent"] = `var(--sh-color-status-${accentBar}-base)`;
  }

  const classes = [
    styles.card,
    styles[variant],
    accentBar && styles.accentGlow,
    isInteractive && styles.interactive,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle = { ...vars, ...style };

  if (href != null) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        style={mergedStyle}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  if (onClick != null) {
    return (
      <button type="button" onClick={onClick} className={classes} style={mergedStyle} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <div className={classes} style={mergedStyle} {...rest}>
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  /** Trailing slot — actions, StatusBadge, machine timestamp. */
  trailing?: ReactNode;
}

/** Optional title row: semibold title + trailing slot. */
function CardHeader({ title, trailing, className, ...rest }: CardHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")} {...rest}>
      <span className={styles.headerTitle}>{title}</span>
      {trailing != null && <span className={styles.headerTrailing}>{trailing}</span>}
    </header>
  );
}

export const Card = Object.assign(CardRoot, { Header: CardHeader });
