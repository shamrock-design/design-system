import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { CloseGlyph } from "../Modal/Modal";
import styles from "./Drawer.module.css";

export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  /** Controlled open state. Leave unset for uncontrolled (pair with `trigger` or `defaultOpen`). */
  open?: boolean;
  defaultOpen?: boolean;
  /** Fires for every close path: × button, Esc, scrim/outside press. */
  onOpenChange?: (open: boolean) => void;
  /** Panel width preset: sm 360 / md 440 / lg 560. */
  size?: DrawerSize;
  /** Optional element rendered as the opening trigger (typically a `Button`). */
  trigger?: ReactElement;
  /**
   * `true` (default): scrim, focus trap and page scroll lock — a focused detail task.
   * `false`: no scrim, the rest of the page stays interactive — a persistent inspector.
   */
  modal?: boolean;
  /** Keep the drawer open on scrim/outside presses (Esc still closes). */
  disableScrimDismiss?: boolean;
  children?: ReactNode;
}

/**
 * Right-side slide-in detail panel (the benchmark `.side` pattern / RapidX node
 * inspector). Composable parts: `Drawer.Header` (eyebrow + title + ×),
 * `Drawer.Body` (scrollable), `Drawer.Footer` (full-width vertical action stack).
 * Dismissal, focus trap and focus return come from Base UI Dialog.
 */
function DrawerRoot({
  open,
  defaultOpen,
  onOpenChange,
  size = "md",
  trigger,
  modal = true,
  disableScrimDismiss = false,
  children,
}: DrawerProps) {
  return (
    <Dialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      modal={modal}
      disablePointerDismissal={disableScrimDismiss}
    >
      {trigger ? <Dialog.Trigger render={trigger} /> : null}
      <Dialog.Portal>
        {modal && <Dialog.Backdrop className={styles.scrim} />}
        <Dialog.Popup className={[styles.panel, styles[size]].filter(Boolean).join(" ")}>{children}</Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface DrawerHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Labels the drawer (wired to aria-labelledby via Base UI). */
  title: ReactNode;
  /** Label-caps machine eyebrow above the title, e.g. "STEP 07". */
  eyebrow?: ReactNode;
  /** Hide the × close button — only for flows that must exit through a footer action. */
  hideClose?: boolean;
}

function DrawerHeader({ title, eyebrow, hideClose = false, className, ...rest }: DrawerHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.headerText}>
        {eyebrow != null && <span className={styles.eyebrow}>{eyebrow}</span>}
        <Dialog.Title className={styles.title}>{title}</Dialog.Title>
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
function DrawerBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.body, className].filter(Boolean).join(" ")} {...rest} />;
}

/**
 * Vertical action stack — children stretch full width (RapidX inspector pattern).
 * Wrap closing actions in Base UI `Dialog.Close render={<Button/>}`.
 */
function DrawerFooter({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <footer className={[styles.footer, className].filter(Boolean).join(" ")} {...rest} />;
}

export const Drawer = Object.assign(DrawerRoot, {
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
});
