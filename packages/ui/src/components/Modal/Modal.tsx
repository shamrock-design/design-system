import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import styles from "./Modal.module.css";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  /** Controlled open state. Leave unset for uncontrolled (pair with `trigger` or `defaultOpen`). */
  open?: boolean;
  defaultOpen?: boolean;
  /** Fires for every close path: × button, Esc, scrim click, footer `Dialog.Close` actions. */
  onOpenChange?: (open: boolean) => void;
  /** Max-width preset: sm 420 / md 560 / lg 760. */
  size?: ModalSize;
  /** Optional element rendered as the opening trigger (typically a `Button`). */
  trigger?: ReactElement;
  /** Keep the modal open on scrim clicks (Esc still closes). Use for confirmations. */
  disableScrimDismiss?: boolean;
  children?: ReactNode;
}

/** Shared × glyph (mirrors `@shamrock-design/icons` x.svg — icons is a devDependency here). */
export function CloseGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * Blocking overlay for a focused task. Composable parts: `Modal.Header`,
 * `Modal.Body` (scrollable), `Modal.Footer` (right-aligned actions).
 * Focus trap, scroll lock, Esc/scrim dismissal and focus return come from Base UI Dialog.
 */
function ModalRoot({
  open,
  defaultOpen,
  onOpenChange,
  size = "md",
  trigger,
  disableScrimDismiss = false,
  children,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      disablePointerDismissal={disableScrimDismiss}
    >
      {trigger ? <Dialog.Trigger render={trigger} /> : null}
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.scrim} />
        <Dialog.Popup className={[styles.popup, styles[size]].filter(Boolean).join(" ")}>{children}</Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface ModalHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Labels the dialog (wired to aria-labelledby via Base UI). */
  title: ReactNode;
  /** Optional supporting line (wired to aria-describedby). */
  description?: ReactNode;
  /** Hide the × close button — only for flows that must exit through a footer action. */
  hideClose?: boolean;
}

function ModalHeader({ title, description, hideClose = false, className, ...rest }: ModalHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.headerText}>
        <Dialog.Title className={styles.title}>{title}</Dialog.Title>
        {description != null && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
      </div>
      {!hideClose && (
        <Dialog.Close className={styles.close} aria-label="Close">
          <CloseGlyph />
        </Dialog.Close>
      )}
    </header>
  );
}

/** Scrollable content region. */
function ModalBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.body, className].filter(Boolean).join(" ")} {...rest} />;
}

/** Right-aligned action row. Wrap closing actions in Base UI `Dialog.Close render={<Button/>}`. */
function ModalFooter({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <footer className={[styles.footer, className].filter(Boolean).join(" ")} {...rest} />;
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
