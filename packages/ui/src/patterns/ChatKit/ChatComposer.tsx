import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react";
import { Icon, type IconName } from "@shamrock-design/icons";
import { Button } from "../../components/Button/Button";
import styles from "./ChatKit.module.css";

export interface ChatComposerProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value" | "defaultValue" | "onKeyDown"> {
  /** Fired with the trimmed text on Enter or send-button press. */
  onSend: (text: string) => void;
  placeholder?: string;
  /** Blocks typing and sending. */
  disabled?: boolean;
  /** Controlled value. Pair with `onChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Send-button glyph. Defaults to `arrow-right`. */
  sendIcon?: IconName;
  /** Accessible label for the send button. */
  sendLabel?: string;
}

/**
 * The input row: an auto-growing textarea styled like TextInput plus an accent
 * send Button. Enter sends (and clears when uncontrolled); Shift+Enter inserts a
 * newline. Works controlled (`value` + `onChange`) or uncontrolled.
 */
export function ChatComposer({
  onSend,
  placeholder = "Ask a question…",
  disabled = false,
  value,
  defaultValue,
  onChange,
  sendIcon = "arrow-right",
  sendLabel = "Send",
  className,
  rows = 1,
  ...rest
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(() => defaultValue ?? "");
  const currentValue = isControlled ? (value ?? "") : innerValue;
  const canSend = !disabled && currentValue.trim().length > 0;

  // Auto-grow the textarea to fit its content (capped in CSS).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    if (el.scrollHeight > 0) el.style.height = `${el.scrollHeight}px`;
  }, [currentValue]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInnerValue(event.target.value);
    onChange?.(event);
  };

  const send = () => {
    if (!canSend) return;
    onSend(currentValue.trim());
    if (!isControlled) setInnerValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <div
      className={[styles.composer, disabled && styles.composerDisabled, className].filter(Boolean).join(" ")}
    >
      <textarea
        ref={textareaRef}
        className={styles.composerInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      <Button
        className={styles.composerSend}
        size="sm"
        iconOnly
        aria-label={sendLabel}
        disabled={!canSend}
        onClick={send}
      >
        <Icon name={sendIcon} size={14} />
      </Button>
    </div>
  );
}
