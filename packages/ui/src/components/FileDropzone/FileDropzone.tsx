import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./FileDropzone.module.css";

export interface FileDropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  /** File-type filter for the picker, e.g. ".xlsx" — echoed in the zone copy. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Why the zone is disabled — rendered inside it ("Select an L0 stage above to enable upload"). */
  disabledReason?: string;
  /** Accepted files from the picker or a drop. */
  onFiles?: (files: File[]) => void;
  /** Files larger than this are rejected: inline critical text + `onError`. */
  maxBytes?: number;
  onError?: (message: string, rejected: File[]) => void;
  /** Controlled chip list of already-selected files. */
  selectedFiles?: File[];
  onRemove?: (file: File, index: number) => void;
  /** Replaces the built-in upload glyph. */
  icon?: ReactNode;
}

/** Format a byte count as B / KB / MB with one decimal (machine value). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${stripZero(bytes / 1024)} KB`;
  return `${stripZero(bytes / (1024 * 1024))} MB`;
}

function stripZero(n: number): string {
  return n.toFixed(1).replace(/\.0$/, "");
}

function defaultIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 20 20"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13V3.5M10 3.5L6 7.5M10 3.5l4 4" />
      <path d="M3 13v3h14v-3" />
    </svg>
  );
}

/**
 * Drag & drop file intake over one hidden input. The entire zone is a native
 * button (Enter/Space open the picker); "browse" is a styled span inside it.
 * Dashed border is sanctioned here only — it is the drop affordance.
 */
export function FileDropzone({
  accept,
  multiple = false,
  disabled = false,
  disabledReason,
  onFiles,
  maxBytes,
  onError,
  selectedFiles,
  onRemove,
  icon,
  className,
  ...rest
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragOver, setDragOver] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  function acceptFiles(incoming: File[]) {
    if (incoming.length === 0) return;
    const files = multiple ? incoming : incoming.slice(0, 1);
    if (maxBytes !== undefined) {
      const rejected = files.filter((f) => f.size > maxBytes);
      const ok = files.filter((f) => f.size <= maxBytes);
      if (rejected.length > 0) {
        const message = `${rejected.map((f) => f.name).join(", ")} exceeds the ${formatBytes(maxBytes)} limit.`;
        setErrorText(message);
        onError?.(message, rejected);
      } else {
        setErrorText(null);
      }
      if (ok.length > 0) onFiles?.(ok);
      return;
    }
    setErrorText(null);
    onFiles?.(files);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFiles(Array.from(event.target.files ?? []));
    // Allow re-selecting the same file.
    event.target.value = "";
  }

  function handleDragEnter(event: DragEvent) {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragOver(true);
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragOver(false);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragOver(false);
    if (disabled) return;
    acceptFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  const fileNoun = accept ? `your ${accept} file${multiple ? "s" : ""}` : multiple ? "files" : "a file";

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <button
        type="button"
        className={[
          styles.zone,
          dragOver && styles.zoneDragOver,
          disabled && styles.zoneDisabled,
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon ?? defaultIcon()}
        </span>
        <span className={styles.copy}>
          Drag &amp; drop {fileNoun} here, or <span className={styles.browse}>browse</span>
        </span>
        {disabled && disabledReason ? (
          <span className={styles.hint}>{disabledReason}</span>
        ) : (
          maxBytes !== undefined && (
            <span className={styles.hint}>Max file size {formatBytes(maxBytes)}</span>
          )
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        className={styles.input}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleInputChange}
      />

      {errorText && (
        <div className={styles.error} role="alert">
          {errorText}
        </div>
      )}

      {selectedFiles && selectedFiles.length > 0 && (
        <ul className={styles.chips}>
          {selectedFiles.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.chip}>
              <span className={styles.chipName} title={file.name}>
                {file.name}
              </span>
              <span className={styles.chipSize}>{formatBytes(file.size)}</span>
              {onRemove && (
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file, index)}
                >
                  <svg
                    viewBox="0 0 12 12"
                    width={10}
                    height={10}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l6 6M9 3l-6 6" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
