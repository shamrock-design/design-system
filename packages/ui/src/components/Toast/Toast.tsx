import { useCallback, useMemo, type CSSProperties, type ReactNode } from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import type { Status } from "../../constants/status";
import { CloseGlyph } from "../Modal/Modal";
import styles from "./Toast.module.css";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Canonical status — drives the accent bar + dot. Defaults to `neutral` (calm by default). */
  status?: Status;
  /** Auto-dismiss delay. Defaults to the provider's `durationMs` (5s). `0` disables. */
  durationMs?: number;
}

export interface UseToastReturn {
  /** Fire a toast. Returns its id — reuse the id via a second call to update in place. */
  toast: (options: ToastOptions) => string;
  /** Dismiss one toast by id, or all toasts when omitted. */
  dismiss: (id?: string) => void;
}

/**
 * The Shamrock toast API over Base UI's toast manager.
 * Must be called under `ToastProvider`.
 */
export function useToast(): UseToastReturn {
  const manager = BaseToast.useToastManager();
  const toast = useCallback(
    ({ title, description, status = "neutral", durationMs }: ToastOptions) =>
      manager.add({ title, description, type: status, timeout: durationMs }),
    [manager],
  );
  const dismiss = useCallback((id?: string) => manager.close(id), [manager]);
  return useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
}

function statusVars(status: Status): CSSProperties {
  return { "--sh-toast-status-base": `var(--sh-color-status-${status}-base)` } as CSSProperties;
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <>
      {toasts.map((toast) => {
        const status = (toast.type ?? "neutral") as Status;
        return (
          <BaseToast.Root
            key={toast.id}
            toast={toast}
            className={styles.toast}
            style={statusVars(status)}
            data-status={status}
            swipeDirection="right"
          >
            <div className={styles.titleRow}>
              <span className={styles.dot} aria-hidden="true" />
              <BaseToast.Title className={styles.title} />
            </div>
            <BaseToast.Description className={styles.description} />
            <BaseToast.Close className={styles.close} aria-label="Dismiss">
              <CloseGlyph size={12} />
            </BaseToast.Close>
          </BaseToast.Root>
        );
      })}
    </>
  );
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Default auto-dismiss delay (ms). `0` disables auto-dismiss. */
  durationMs?: number;
  /** Max toasts on screen; older ones are hidden until space frees up. */
  limit?: number;
}

/**
 * App-level provider: wires Base UI's toast manager and renders the
 * bottom-right viewport (at `--sh-z-toast`). Hovering the stack pauses timers.
 */
export function ToastProvider({ children, durationMs = 5000, limit = 3 }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={durationMs} limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className={styles.viewport} aria-label="Notifications">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
