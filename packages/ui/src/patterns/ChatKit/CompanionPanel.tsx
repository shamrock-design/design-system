import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "@shamrock-design/icons";
import { Button } from "../../components/Button/Button";
import type { Status } from "../../constants/status";
import { AgentOrb } from "./AgentOrb";
import { ChatComposer, type ChatComposerProps } from "./ChatComposer";
import { SuggestionChips, type SuggestionItem } from "./SuggestionChips";
import styles from "./ChatKit.module.css";

export interface CompanionPanelProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "onSubmit"> {
  /** Panel title, e.g. "Planning Intelligence". */
  title: ReactNode;
  /** Machine/secondary line under the title, e.g. "grounded in run history · R1-2026-W21". */
  subtitle?: ReactNode;
  /** Presence dot on the orb. Defaults to `success` (online). */
  status?: Status;
  /** Renders a × close button in the header when provided. */
  onClose?: () => void;
  /** Fired by the composer on send. */
  onSend: (text: string) => void;
  /** Prompt starters rendered above the composer. */
  suggestions?: SuggestionItem[];
  /** Composer placeholder. */
  placeholder?: string;
  /** Disable the composer. */
  disabled?: boolean;
  /** Forwarded to the ChatComposer (e.g. controlled `value`/`onChange`). */
  composerProps?: Omit<ChatComposerProps, "onSend" | "placeholder" | "disabled">;
  /** The transcript — a stack of `ChatMessage`s. */
  children?: ReactNode;
}

/**
 * The AI companion container. A glass panel with a left hairline — meant to sit
 * inside AppShell content or a Drawer, NOT a modal. Composes the orb header, a
 * scrollable transcript, optional suggestion chips, and a pinned composer.
 */
export function CompanionPanel({
  title,
  subtitle,
  status = "success",
  onClose,
  onSend,
  suggestions,
  placeholder,
  disabled,
  composerProps,
  children,
  className,
  ...rest
}: CompanionPanelProps) {
  return (
    <section className={[styles.panel, className].filter(Boolean).join(" ")} {...rest}>
      <header className={styles.panelHeader}>
        <AgentOrb size="md" status={status} />
        <div className={styles.panelHeaderText}>
          <span className={styles.panelTitle}>{title}</span>
          {subtitle != null && <span className={styles.panelSubtitle}>{subtitle}</span>}
        </div>
        {onClose && (
          <Button
            className={styles.panelClose}
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="x" size={16} />
          </Button>
        )}
      </header>

      <div className={styles.transcript} role="log" aria-live="polite">
        {children}
      </div>

      <div className={styles.panelFooter}>
        {suggestions && suggestions.length > 0 && (
          <SuggestionChips items={suggestions} aria-label="Suggested questions" />
        )}
        <ChatComposer onSend={onSend} placeholder={placeholder} disabled={disabled} {...composerProps} />
      </div>
    </section>
  );
}
