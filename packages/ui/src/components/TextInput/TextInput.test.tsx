import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  it("works uncontrolled and forwards native props", async () => {
    render(<TextInput defaultValue="MD" placeholder="Job name" aria-label="Job name" />);
    const input = screen.getByRole("textbox", { name: "Job name" });
    expect(input).toHaveValue("MD");
    await userEvent.type(input, "MR");
    expect(input).toHaveValue("MDMR");
  });

  it("works controlled", async () => {
    function Harness() {
      const [value, setValue] = useState("");
      return <TextInput value={value} onChange={(event) => setValue(event.target.value)} aria-label="Query" />;
    }
    render(<Harness />);
    const input = screen.getByRole("textbox", { name: "Query" });
    await userEvent.type(input, "ECC");
    expect(input).toHaveValue("ECC");
  });

  it("sets aria-invalid when invalid", () => {
    render(<TextInput invalid aria-label="Cron" />);
    expect(screen.getByRole("textbox", { name: "Cron" })).toHaveAttribute("aria-invalid", "true");
  });

  it("search: shows the clear button only when non-empty and onClear is provided", async () => {
    const onClear = vi.fn();
    render(<TextInput search onClear={onClear} aria-label="Search jobs" />);
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: "Search jobs" });
    await userEvent.type(input, "BW");
    const clear = screen.getByRole("button", { name: "Clear" });
    await userEvent.click(clear);

    expect(onClear).toHaveBeenCalledOnce();
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("search without onClear never renders a clear button", async () => {
    render(<TextInput search defaultValue="IBP" aria-label="Search jobs" />);
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("controlled search: clear button defers emptying to the consumer", async () => {
    function Harness() {
      const [value, setValue] = useState("IBP");
      return (
        <TextInput
          search
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onClear={() => setValue("")}
          aria-label="Search jobs"
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("textbox", { name: "Search jobs" })).toHaveValue("");
  });

  it("does not react to typing or clearing when disabled", () => {
    render(<TextInput search onClear={vi.fn()} disabled defaultValue="IBP" aria-label="Search jobs" />);
    expect(screen.getByRole("textbox", { name: "Search jobs" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });
});
