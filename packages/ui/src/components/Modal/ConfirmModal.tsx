import type { ReactElement, ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "../Button/Button";
import { Text } from "../../primitives/Text/Text";
import { Modal, type ModalSize } from "./Modal";

export interface ConfirmModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional element rendered as the opening trigger (typically a `Button`). */
  trigger?: ReactElement;
  size?: ModalSize;
  title: ReactNode;
  /** One or two sentences stating exactly what will happen. */
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Irreversible action — renders the confirm action as a destructive Button. */
  destructive?: boolean;
  /** Called when the confirm action is pressed (the modal closes afterwards). */
  onConfirm?: () => void;
  /** Called when the cancel action is pressed. Esc/× close without firing this. */
  onCancel?: () => void;
}

/**
 * Composed confirmation dialog. Scrim clicks never dismiss it — a confirmation
 * must be answered (or escaped explicitly via Esc/×).
 */
export function ConfirmModal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  size = "sm",
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      size={size}
      disableScrimDismiss
    >
      <Modal.Header title={title} />
      <Modal.Body>
        <Text as="p" variant="body" tone="secondary">
          {body}
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Dialog.Close render={<Button variant="ghost" onClick={onCancel} />}>{cancelLabel}</Dialog.Close>
        <Dialog.Close render={<Button variant={destructive ? "destructive" : "primary"} onClick={onConfirm} />}>
          {confirmLabel}
        </Dialog.Close>
      </Modal.Footer>
    </Modal>
  );
}
