import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { EmptyState } from "../EmptyState/EmptyState";
import styles from "./CodeConsole.module.css";

export type CodeConsoleLevel = "info" | "warn" | "error";

export interface CodeConsoleLine {
  text: string;
  level?: CodeConsoleLevel;
}

export interface CodeConsoleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Leveled log mode. Mutually exclusive with `code`; wins if both are set. */
  lines?: CodeConsoleLine[];
  /** Plain code-block mode. */
  code?: string;
  /** Header title slot (machine face). */
  title?: ReactNode;
  /** Header trailing slot: duration, exit code, timestamp. */
  meta?: ReactNode;
  /** Auto-scroll to the bottom when new lines arrive. */
  follow?: boolean;
  /** Scroll cap for the body. Number → px. */
  maxHeight?: number | string;
  /** Left line-number gutter (ink-6). */
  lineNumbers?: boolean;
  /** Copy button with a transient "Copied" state. */
  copyable?: boolean;
}

const LEVEL_CLASS: Record<CodeConsoleLevel, string> = {
  info: styles.info!,
  warn: styles.warn!,
  error: styles.error!,
};

/**
 * Read-only terminal/log surface. THE one sanctioned dark surface (terminal
 * idiom): ink background, inverse text, status `-base` variants for warn/error.
 */
export function CodeConsole({
  lines,
  code,
  title,
  meta,
  follow = false,
  maxHeight = 320,
  lineNumbers = false,
  copyable = false,
  className,
  ...rest
}: CodeConsoleProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const codeLines = code !== undefined ? code.split("\n") : null;
  const hasLines = lines !== undefined && lines.length > 0;
  const hasCode = code !== undefined && code.length > 0;
  const isEmpty = !hasLines && !hasCode;

  // follow: pin to bottom whenever the content changes.
  useEffect(() => {
    if (!follow) return;
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [follow, lines, code]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  async function handleCopy() {
    const text = hasLines
      ? lines!.map((l) => l.text).join("\n")
      : code ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard unavailable (insecure context / denied) — stay silent, no dark-surface error UI.
    }
  }

  const bodyStyle: CSSProperties = {
    maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
  };

  const showHeader = title !== undefined || meta !== undefined || copyable;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      {showHeader && (
        <div className={styles.header}>
          {title !== undefined && <span className={styles.title}>{title}</span>}
          <span className={styles.headerSpacer} />
          {meta !== undefined && <span className={styles.meta}>{meta}</span>}
          {copyable && !isEmpty && (
            <button type="button" className={styles.copyButton} onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      )}

      {isEmpty ? (
        <div className={styles.empty}>
          <EmptyState
            size="sm"
            title="No logs yet."
            description="Run an execution to see live logs here."
          />
        </div>
      ) : (
        <div
          ref={bodyRef}
          className={styles.body}
          style={bodyStyle}
          tabIndex={0}
          role="log"
          aria-label={typeof title === "string" ? title : "Console output"}
        >
          {hasLines ? (
            <ol className={[styles.lines, lineNumbers && styles.withNumbers].filter(Boolean).join(" ")}>
              {lines!.map((line, index) => (
                <li key={index} className={[styles.line, line.level && LEVEL_CLASS[line.level]].filter(Boolean).join(" ")}>
                  {lineNumbers && <span className={styles.gutter} aria-hidden="true">{index + 1}</span>}
                  <span className={styles.lineText}>{line.text}</span>
                </li>
              ))}
            </ol>
          ) : (
            <ol className={[styles.lines, lineNumbers && styles.withNumbers].filter(Boolean).join(" ")}>
              {codeLines!.map((text, index) => (
                <li key={index} className={styles.line}>
                  {lineNumbers && <span className={styles.gutter} aria-hidden="true">{index + 1}</span>}
                  <span className={styles.lineText}>{text}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
