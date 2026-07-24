import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button";
import { Drawer } from "./Drawer";

function InspectorDrawer(props: Partial<Parameters<typeof Drawer>[0]>) {
  return (
    <Drawer trigger={<Button variant="outline">Inspect step</Button>} {...props}>
      <Drawer.Header eyebrow="STEP 07" title="MDM replication" />
      <Drawer.Body>Step detail</Drawer.Body>
      <Drawer.Footer>
        <Button fullWidth>Re-run step</Button>
      </Drawer.Footer>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("opens from the trigger with a labelled dialog, shows the eyebrow, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<InspectorDrawer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Inspect step" }));
    const dialog = await screen.findByRole("dialog", { name: "MDM replication" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("STEP 07")).toBeInTheDocument();
    expect(screen.getByText("Step detail")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Re-run step" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes via the header × and reports onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<InspectorDrawer onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Inspect step" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const { rerender } = render(<InspectorDrawer open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<InspectorDrawer open />);
    expect(await screen.findByRole("dialog", { name: "MDM replication" })).toBeInTheDocument();
  });

  it("renders a scrim when modal and none when modal={false}", async () => {
    const { rerender, baseElement } = render(<InspectorDrawer open />);
    await screen.findByRole("dialog");
    expect(baseElement.querySelector('[class*="scrim"]')).not.toBeNull();

    rerender(<InspectorDrawer open modal={false} />);
    await screen.findByRole("dialog");
    expect(baseElement.querySelector('[class*="scrim"]')).toBeNull();
  });

  it("hides the close button with hideClose", async () => {
    render(
      <Drawer open>
        <Drawer.Header title="No close" hideClose />
      </Drawer>,
    );
    await screen.findByRole("dialog", { name: "No close" });
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});
