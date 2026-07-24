import type { HTMLAttributes, ReactNode } from "react";
import { AgentOrb } from "./AgentOrb";
import styles from "./ChatKit.module.css";

export type ChatRole = "user" | "assistant";

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  /**
   * Assistant avatar. Defaults to an `<AgentOrb />` when `role="assistant"`.
   * Pass `null` to suppress it, or a custom node to override. Ignored for users.
   */
  avatar?: ReactNode;
  /** Machine-face timestamp shown under the message. */
  timestamp?: ReactNode;
  children?: ReactNode;
}

/**
 * A single turn in the transcript. User turns are right-aligned accent-tinted
 * bubbles; assistant turns sit left on glass/transparent beside the orb. Rich
 * children (bold spans, RunRefChip, StatusBadge, ThinkingBlock) render inline.
 */
export function ChatMessage({ role, avatar, timestamp, children, className, ...rest }: ChatMessageProps) {
  const isAssistant = role === "assistant";
  const orb = isAssistant ? (avatar === undefined ? <AgentOrb size="sm" /> : avatar) : null;

  return (
    <div
      className={[styles.message, styles[role], className].filter(Boolean).join(" ")}
      data-role={role}
      {...rest}
    >
      {orb}
      <div className={styles.body}>
        <div className={[styles.bubble, isAssistant ? styles.bubbleAssistant : styles.bubbleUser].join(" ")}>
          {children}
        </div>
        {timestamp != null && <time className={styles.timestamp}>{timestamp}</time>}
      </div>
    </div>
  );
}
