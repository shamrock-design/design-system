import type { ElementType, HTMLAttributes } from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "lead"
  | "body"
  | "meta"
  | "caption"
  | "micro"
  | "kpi"
  | "machine"
  | "label-caps";

export type TextTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "subtle"
  | "faint"
  | "disabled"
  | "machine"
  | "inverse"
  | "accent";

const VARIANT_CLASS: Record<TextVariant, string> = {
  h1: styles.h1!,
  h2: styles.h2!,
  h3: styles.h3!,
  lead: styles.lead!,
  body: styles.body!,
  meta: styles.meta!,
  caption: styles.caption!,
  micro: styles.micro!,
  kpi: styles.kpi!,
  machine: styles.machine!,
  "label-caps": styles.labelCaps!,
};

const TONE_CLASS: Record<TextTone, string> = {
  primary: styles.tonePrimary!,
  secondary: styles.toneSecondary!,
  tertiary: styles.toneTertiary!,
  subtle: styles.toneSubtle!,
  faint: styles.toneFaint!,
  disabled: styles.toneDisabled!,
  machine: styles.toneMachine!,
  inverse: styles.toneInverse!,
  accent: styles.toneAccent!,
};

const DEFAULT_TAG: Partial<Record<TextVariant, ElementType>> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Type role from the token scale. `machine` and `kpi` use the machine face. */
  variant?: TextVariant;
  tone?: TextTone;
}

/**
 * The only sanctioned way to set type. Maps 1:1 onto the semantic type roles —
 * never set font-size/family/color directly in product code.
 */
export function Text({ as, variant = "body", tone, className, ...rest }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant] ?? "span";
  const defaultTone: TextTone =
    variant === "machine" ? "machine" : variant === "meta" || variant === "caption" ? "secondary" : "primary";
  return (
    <Tag
      className={[styles.text, VARIANT_CLASS[variant], TONE_CLASS[tone ?? defaultTone], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
