import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Stack.module.css";

/** Index into the spacing scale (--sh-space-N). */
export type SpaceToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface LayoutProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  gap?: SpaceToken;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  children?: ReactNode;
}

function gapVar(gap: SpaceToken | undefined): CSSProperties | undefined {
  if (gap === undefined) return undefined;
  return { "--sh-stack-gap": `var(--sh-space-${gap})` } as CSSProperties;
}

/** Vertical flow. The default building block — reach for this before writing flex CSS. */
export function Stack({ as: Tag = "div", gap, align, justify, style, className, ...rest }: LayoutProps) {
  return (
    <Tag
      className={[styles.stack, className].filter(Boolean).join(" ")}
      style={{ ...gapVar(gap), alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    />
  );
}

/** Horizontal flow, wraps by default, centers items vertically. */
export function Inline({ as: Tag = "div", gap, align, justify, style, className, ...rest }: LayoutProps) {
  return (
    <Tag
      className={[styles.inline, className].filter(Boolean).join(" ")}
      style={{ ...gapVar(gap), alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    />
  );
}

interface GridProps extends LayoutProps {
  /** Minimum column width before wrapping, e.g. "240px". */
  minChildWidth?: string;
}

/** Responsive auto-fill card grid. */
export function Grid({ as: Tag = "div", gap, minChildWidth, style, className, ...rest }: GridProps) {
  const vars = {
    ...gapVar(gap),
    ...(minChildWidth ? ({ "--sh-grid-min": minChildWidth } as CSSProperties) : undefined),
  };
  return (
    <Tag
      className={[styles.grid, className].filter(Boolean).join(" ")}
      style={{ ...vars, ...style }}
      {...rest}
    />
  );
}
