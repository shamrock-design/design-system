import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@shamrock-design/icons";
import type { Status } from "../../constants/status";
import styles from "./ChatKit.module.css";

export type AgentOrbSize = "sm" | "md";

export interface AgentOrbProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** sm 24 / md 30. */
  size?: AgentOrbSize;
  /** Glyph inside the orb. Pass an icon name (shortcut) or any node. Defaults to `layers`. */
  icon?: IconName | ReactNode;
  /** Presence/status dot in the corner. Omit for no dot. Drives the dot color only. */
  status?: Status;
  /** Pulse the status dot. Defaults to true for `running`. */
  pulse?: boolean;
  /** Accessible label. When omitted the orb is decorative (`aria-hidden`). */
  label?: string;
}

const ICON_SIZE: Record<AgentOrbSize, number> = { sm: 13, md: 16 };
const DOT_SIZE: Record<AgentOrbSize, number> = { sm: 8, md: 9 };

/**
 * The AI companion's identity mark: an accent-tinted circle with a glyph and an
 * optional presence dot (the canon circle exception). Reused by ChatMessage and
 * CompanionPanel. Color of the dot comes from the status enum — never encode a
 * different state in it.
 */
export function AgentOrb({
  size = "md",
  icon = "layers",
  status,
  pulse,
  label,
  className,
  style,
  ...rest
}: AgentOrbProps) {
  const shouldPulse = pulse ?? status === "running";
  const dotStyle =
    status != null
      ? ({ "--sh-orb-dot": `var(--sh-color-status-${status}-base)` } as CSSProperties)
      : undefined;

  return (
    <span
      className={[styles.orb, styles[size === "sm" ? "orbSm" : "orbMd"], className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={style}
      {...rest}
    >
      {typeof icon === "string" ? <Icon name={icon as IconName} size={ICON_SIZE[size]} /> : icon}
      {status != null && (
        <span
          className={[styles.orbDot, shouldPulse && styles.orbDotPulse].filter(Boolean).join(" ")}
          style={{ ...dotStyle, width: DOT_SIZE[size], height: DOT_SIZE[size] }}
        />
      )}
    </span>
  );
}
