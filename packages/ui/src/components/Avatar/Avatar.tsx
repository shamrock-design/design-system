import { useState } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full display name — accessible label, initials source and color-hash key. */
  name: string;
  /** Photo URL. Falls back to initials on load error. */
  src?: string;
  /** sm 24 / md 32 / lg 40. */
  size?: AvatarSize;
  /** Circle only — the sanctioned dot/orb radius exception (canon #1). */
  shape?: AvatarShape;
  /** Hairline ring + ink text on glass instead of the identity color. */
  muted?: boolean;
}

/** First letters of the first two words ("Ada Lovelace" → "AL"). */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** Deterministic hash of the name into the categorical set index 1–5. */
export function getIdentityColorIndex(name: string): 1 | 2 | 3 | 4 | 5 {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return ((hash % 5) + 1) as 1 | 2 | 3 | 4 | 5;
}

/**
 * Identity mark: initials or photo in a circle. The identity background hashes
 * the name into `--sh-color-chart-cat-1..5` — the ONLY sanctioned decorative
 * use of the categorical palette (see SPEC). Same name → same color, every theme.
 */
export function Avatar({ name, src, size = "md", shape = "circle", muted = false, className, style, ...rest }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = src != null && !imageFailed;
  const vars = muted
    ? undefined
    : ({ "--sh-avatar-bg": `var(--sh-color-chart-cat-${getIdentityColorIndex(name)})` } as CSSProperties);

  return (
    <span
      role="img"
      aria-label={name}
      className={[styles.avatar, styles[size], styles[shape], muted && styles.muted, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
