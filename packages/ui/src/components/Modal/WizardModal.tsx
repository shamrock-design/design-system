import { useState, type ReactElement, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "../Button/Button";
import { Text } from "../../primitives/Text/Text";
import { Modal, type ModalSize } from "./Modal";
import styles from "./Modal.module.css";

export interface WizardStep {
  title: string;
  content: ReactNode;
}

export interface WizardModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional element rendered as the opening trigger (typically a `Button`). */
  trigger?: ReactElement;
  size?: ModalSize;
  title: ReactNode;
  description?: ReactNode;
  /** Ordered steps. Keep it ≤ 4 — longer flows want a full page. */
  steps: WizardStep[];
  /** Controlled active step index. Leave unset for internal state. */
  activeStep?: number;
  /** Initial step for the uncontrolled case. */
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** Called when the finish action on the last step is pressed (the modal closes afterwards). */
  onFinish?: () => void;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
}

/** Check glyph for completed steps (mirrors `@shamrock-design/icons` check.svg). */
function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * Composed multi-step modal: numbered progress dots (active = accent-filled,
 * done = check, hairline connectors) + Back/Next/finish footer.
 * The uncontrolled step resets when the modal closes.
 */
export function WizardModal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  size = "md",
  title,
  description,
  steps,
  activeStep,
  defaultStep = 0,
  onStepChange,
  onFinish,
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
}: WizardModalProps) {
  if (process.env.NODE_ENV !== "production" && steps.length === 0) {
    throw new Error("Shamrock WizardModal: `steps` must contain at least one step.");
  }
  const [internalStep, setInternalStep] = useState(defaultStep);
  const isControlled = activeStep !== undefined;
  const current = Math.min(Math.max(isControlled ? activeStep : internalStep, 0), steps.length - 1);
  const isLast = current === steps.length - 1;

  const goTo = (next: number) => {
    if (!isControlled) setInternalStep(next);
    onStepChange?.(next);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && !isControlled) setInternalStep(defaultStep);
    onOpenChange?.(next);
  };

  return (
    <Modal
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      size={size}
      disableScrimDismiss
    >
      <Modal.Header title={title} description={description} />
      <ol className={styles.steps}>
        {steps.map((step, index) => {
          const state = index < current ? styles.stepDone : index === current ? styles.stepActive : undefined;
          return (
            <li
              key={`${index}-${step.title}`}
              className={[styles.step, state].filter(Boolean).join(" ")}
              aria-current={index === current ? "step" : undefined}
            >
              <span className={styles.stepDot} aria-hidden="true">
                {index < current ? <CheckGlyph /> : index + 1}
              </span>
              <span className={styles.stepTitle}>{step.title}</span>
              {index < steps.length - 1 && <span className={styles.stepConnector} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <Modal.Body>{steps[current]?.content}</Modal.Body>
      <Modal.Footer>
        <Text variant="machine" className={styles.stepCount}>
          Step {current + 1} of {steps.length}
        </Text>
        <Button variant="outline" disabled={current === 0} onClick={() => goTo(current - 1)}>
          {backLabel}
        </Button>
        {isLast ? (
          <Dialog.Close render={<Button variant="primary" onClick={onFinish} />}>{finishLabel}</Dialog.Close>
        ) : (
          <Button variant="primary" onClick={() => goTo(current + 1)}>
            {nextLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
