import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button";
import { Modal } from "./Modal";
import { ConfirmModal } from "./ConfirmModal";
import { WizardModal } from "./WizardModal";

describe("Modal", () => {
  it("opens from the trigger with a labelled dialog and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Modal trigger={<Button variant="outline">Open report</Button>}>
        <Modal.Header title="Sync report" description="Latest run summary." />
        <Modal.Body>Body content</Modal.Body>
        <Modal.Footer>
          <Button>Acknowledge</Button>
        </Modal.Footer>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open report" }));
    const dialog = await screen.findByRole("dialog", { name: "Sync report" });
    expect(dialog).toHaveAccessibleDescription("Latest run summary.");
    expect(screen.getByText("Body content")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes via the header × and reports onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal trigger={<Button>Open</Button>} onOpenChange={onOpenChange}>
        <Modal.Header title="Settings" />
      </Modal>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const { rerender } = render(
      <Modal open={false}>
        <Modal.Header title="Controlled" />
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Modal open>
        <Modal.Header title="Controlled" />
      </Modal>,
    );
    expect(await screen.findByRole("dialog", { name: "Controlled" })).toBeInTheDocument();
  });
});

describe("ConfirmModal", () => {
  it("fires onConfirm and closes; destructive flag styles the confirm button", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        trigger={<Button>Delete dataset</Button>}
        title="Delete dataset?"
        body="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={onConfirm}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Delete dataset" }));
    await screen.findByRole("dialog", { name: "Delete dataset?" });
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();

    const confirm = screen.getByRole("button", { name: "Delete" });
    expect(confirm.className).toMatch(/destructive/);

    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("fires onCancel and closes without confirming", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        trigger={<Button>Archive</Button>}
        title="Archive workflow?"
        body="You can restore it later."
        confirmLabel="Archive"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Archive" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});

const steps = [
  { title: "Source", content: <div>Pick a source</div> },
  { title: "Review", content: <div>Review mapping</div> },
];

describe("WizardModal", () => {
  it("walks Back/Next/Finish through the steps and closes on finish", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    const onStepChange = vi.fn();
    render(
      <WizardModal
        trigger={<Button>Add dataset</Button>}
        title="Add dataset"
        steps={steps}
        onStepChange={onStepChange}
        onFinish={onFinish}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Add dataset" }));
    await screen.findByRole("dialog", { name: "Add dataset" });

    expect(screen.getByText("Pick a source")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
    const [first, second] = screen.getAllByRole("listitem");
    expect(first).toHaveAttribute("aria-current", "step");
    expect(second).not.toHaveAttribute("aria-current");

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onStepChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByText("Review mapping")).toBeInTheDocument();
    expect(screen.queryByText("Pick a source")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "Back" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(onStepChange).toHaveBeenLastCalledWith(0);
    expect(screen.getByText("Pick a source")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(onFinish).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("resets the uncontrolled step when reopened, and honors controlled activeStep", async () => {
    const user = userEvent.setup();
    render(<WizardModal trigger={<Button>Open wizard</Button>} title="Wizard" steps={steps} />);
    await user.click(screen.getByRole("button", { name: "Open wizard" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Open wizard" }));
    expect(await screen.findByText("Step 1 of 2")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    render(<WizardModal open title="Controlled wizard" steps={steps} activeStep={1} />);
    expect(await screen.findByText("Step 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Review mapping")).toBeInTheDocument();
  });
});
