import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChatComposer } from "./ChatComposer";
import { ChatMessage } from "./ChatMessage";
import { SuggestionChips } from "./SuggestionChips";
import { ThinkingBlock } from "./ThinkingBlock";
import styles from "./ChatKit.module.css";

describe("ChatComposer", () => {
  it("sends the trimmed value on Enter and clears when uncontrolled", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} placeholder="Ask" />);
    const textarea = screen.getByPlaceholderText("Ask");

    await user.type(textarea, "hello{Enter}");

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith("hello");
    expect(textarea).toHaveValue("");
  });

  it("does not send on Shift+Enter — it inserts a newline", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} placeholder="Ask" />);
    const textarea = screen.getByPlaceholderText("Ask");

    await user.type(textarea, "line{Shift>}{Enter}{/Shift}more");

    expect(onSend).not.toHaveBeenCalled();
    expect(textarea).toHaveValue("line\nmore");
  });

  it("blocks send when disabled", () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} disabled defaultValue="ready" placeholder="Ask" />);

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    // Even a direct Enter keydown is a no-op while disabled.
    fireEvent.keyDown(screen.getByPlaceholderText("Ask"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("respects a controlled value: the parent owns the text, send does not clear it", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const onChange = vi.fn();
    render(<ChatComposer onSend={onSend} onChange={onChange} value="fixed" placeholder="Ask" />);
    const textarea = screen.getByPlaceholderText("Ask");

    expect(textarea).toHaveValue("fixed");

    await user.type(textarea, "x");
    expect(onChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("fixed"); // controlled — unchanged

    await user.type(textarea, "{Enter}");
    expect(onSend).toHaveBeenCalledWith("fixed");
    expect(textarea).toHaveValue("fixed"); // not cleared
  });
});

describe("ThinkingBlock", () => {
  it("toggles the body open and closed", async () => {
    const user = userEvent.setup();
    render(
      <ThinkingBlock label="REASONING">
        <div>step one</div>
      </ThinkingBlock>,
    );

    expect(screen.getByText("step one")).toBeInTheDocument(); // open by default
    const header = screen.getByRole("button", { name: /reasoning/i });

    await user.click(header);
    expect(screen.queryByText("step one")).not.toBeInTheDocument();

    await user.click(header);
    expect(screen.getByText("step one")).toBeInTheDocument();
  });

  it("shows the spinner only while active", () => {
    const { rerender } = render(
      <ThinkingBlock active>
        <div>thinking…</div>
      </ThinkingBlock>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(
      <ThinkingBlock active={false}>
        <div>thinking…</div>
      </ThinkingBlock>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("SuggestionChips", () => {
  it("fires a chip's onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SuggestionChips items={[{ label: "Why at risk?", onClick }]} />);

    await user.click(screen.getByRole("button", { name: "Why at risk?" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("ChatMessage", () => {
  it("aligns by role and omits the orb for users", () => {
    const { container } = render(<ChatMessage role="user">Hi</ChatMessage>);
    expect(container.firstElementChild).toHaveClass(styles.user!);
    expect(container.getElementsByClassName(styles.orb!)).toHaveLength(0);
  });

  it("aligns assistant left and renders the orb", () => {
    const { container } = render(<ChatMessage role="assistant">Hello</ChatMessage>);
    expect(container.firstElementChild).toHaveClass(styles.assistant!);
    expect(container.getElementsByClassName(styles.orb!).length).toBeGreaterThan(0);
  });
});
