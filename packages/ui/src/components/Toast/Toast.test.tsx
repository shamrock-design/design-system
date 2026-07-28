import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToastProvider, useToast, type ToastOptions } from "./Toast";

function Fire({ options, label = "Fire" }: { options: ToastOptions; label?: string }) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast(options)}>
      {label}
    </button>
  );
}

function renderWithProvider(ui: React.ReactNode, providerProps?: { durationMs?: number; limit?: number }) {
  return render(<ToastProvider {...providerProps}>{ui}</ToastProvider>);
}

describe("Toast", () => {
  it("fires from the hook with title, description and a neutral default status", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Fire options={{ title: "Preferences saved", description: "Applies to this workspace only." }} />,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));

    const title = await screen.findByText("Preferences saved");
    expect(screen.getByText("Applies to this workspace only.")).toBeInTheDocument();
    const root = title.closest("[data-status]");
    expect(root).toHaveAttribute("data-status", "neutral");
  });

  it("maps status onto the toast for the accent bar + dot", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Fire options={{ title: "Export failed", status: "critical" }} />);
    await user.click(screen.getByRole("button", { name: "Fire" }));

    const title = await screen.findByText("Export failed");
    expect(title.closest("[data-status]")).toHaveAttribute("data-status", "critical");
  });

  it("dismisses via the × close button", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Fire options={{ title: "Sync started", durationMs: 0 }} />);
    await user.click(screen.getByRole("button", { name: "Fire" }));
    await screen.findByText("Sync started");

    // Base UI keeps × aria-hidden until the viewport is hovered/focused (SRs dismiss via the toast itself),
    // which also blanks its computed accessible name — query by attribute instead.
    const close = document.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]');
    expect(close).not.toBeNull();
    await user.click(close!);
    await waitFor(() => expect(screen.queryByText("Sync started")).not.toBeInTheDocument());
  });

  it("auto-dismisses after durationMs", async () => {
    const user = userEvent.setup();
    // durationMs must comfortably exceed the click/flush latency, or the toast can
    // auto-dismiss before findByText ever polls it — flaky on a loaded CI runner
    // (a 50ms toast vanished before the query ran). 1s keeps it reliably observable;
    // we then wait for it to clear, tolerating it already being gone.
    renderWithProvider(<Fire options={{ title: "Ephemeral", durationMs: 1000 }} />);
    await user.click(screen.getByRole("button", { name: "Fire" }));
    expect(await screen.findByText("Ephemeral")).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText("Ephemeral")).not.toBeInTheDocument(), { timeout: 3000 });
  });

  it("stacks multiple toasts in the viewport", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <>
        <Fire label="First" options={{ title: "First toast", durationMs: 0 }} />
        <Fire label="Second" options={{ title: "Second toast", status: "success", durationMs: 0 }} />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(screen.getByRole("button", { name: "Second" }));

    expect(await screen.findByText("First toast")).toBeInTheDocument();
    expect(screen.getByText("Second toast")).toBeInTheDocument();
  });

  it("dismiss() without an id clears all toasts", async () => {
    function FireAndClear() {
      const { toast, dismiss } = useToast();
      return (
        <>
          <button type="button" onClick={() => toast({ title: "One", durationMs: 0 })}>
            Fire one
          </button>
          <button type="button" onClick={() => toast({ title: "Two", durationMs: 0 })}>
            Fire two
          </button>
          <button type="button" onClick={() => dismiss()}>
            Clear
          </button>
        </>
      );
    }
    const user = userEvent.setup();
    renderWithProvider(<FireAndClear />);
    await user.click(screen.getByRole("button", { name: "Fire one" }));
    await user.click(screen.getByRole("button", { name: "Fire two" }));
    await screen.findByText("One");
    await screen.findByText("Two");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    await waitFor(() => {
      expect(screen.queryByText("One")).not.toBeInTheDocument();
      expect(screen.queryByText("Two")).not.toBeInTheDocument();
    });
  });
});
