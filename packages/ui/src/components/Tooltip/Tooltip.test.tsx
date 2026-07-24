import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip";

afterEach(cleanup);

describe("Tooltip", () => {
  it("opens on hover after the delay and renders the content", async () => {
    render(
      <Tooltip content="Full value" delay={0}>
        <button type="button">trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByText("Full value")).not.toBeInTheDocument();
    await userEvent.hover(screen.getByRole("button", { name: "trigger" }));
    await waitFor(() => expect(screen.getByText("Full value")).toBeInTheDocument());
  });

  it("opens instantly on keyboard focus and closes on blur", async () => {
    render(
      <Tooltip content="Focused hint">
        <button type="button">trigger</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "trigger" })).toHaveFocus();
    await waitFor(() => expect(screen.getByText("Focused hint")).toBeInTheDocument());
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByText("Focused hint")).not.toBeInTheDocument());
  });

  it("never opens when disabled", async () => {
    render(
      <Tooltip content="Hidden" delay={0} disabled>
        <button type="button">trigger</button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button", { name: "trigger" }));
    await userEvent.tab();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("supports controlled open", () => {
    render(
      <Tooltip content="Always on" open>
        <button type="button">trigger</button>
      </Tooltip>,
    );
    expect(screen.getByText("Always on")).toBeInTheDocument();
  });
});
