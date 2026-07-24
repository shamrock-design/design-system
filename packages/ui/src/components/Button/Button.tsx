import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  /** Square icon-only button. Requires `aria-label`. */
  iconOnly?: boolean;
  /** Shows a spinner (replacing iconStart) and makes the button click-inert without removing focus. */
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  iconStart,
  iconEnd,
  iconOnly = false,
  loading = false,
  fullWidth = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  if (process.env.NODE_ENV !== "production" && iconOnly && !rest["aria-label"]) {
    throw new Error("Shamrock Button: iconOnly requires an aria-label.");
  }
  return (
    <button
      type={type}
      className={[
        styles.button,
        styles[size],
        styles[variant],
        iconOnly && styles.iconOnly,
        loading && styles.loading,
        fullWidth && styles.fullWidth,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : iconStart}
      {!iconOnly && children}
      {iconOnly && !loading && children}
      {!loading && iconEnd}
    </button>
  );
}
