import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

afterEach(cleanup);

const options = [
  { value: "ibp-prd", label: "IBP Production", description: "PLNG-ALL-PLNG-PRD" },
  { value: "ibp-qas", label: "IBP Quality", description: "PLNG-ALL-PLNG-QAS" },
  { value: "ecc-dev", label: "ECC Development", disabled: true },
];

describe("Select", () => {
  it("shows the placeholder, opens on click, and selects an option", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} placeholder="Pick a system…" aria-label="System" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "System" });
    expect(trigger).toHaveTextContent("Pick a system…");

    await userEvent.click(trigger);
    const option = await screen.findByRole("option", { name: /IBP Quality/ });
    expect(screen.getByText("PLNG-ALL-PLNG-QAS")).toBeInTheDocument();

    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith("ibp-qas");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(trigger).toHaveTextContent("IBP Quality");
  });

  it("renders the defaultValue label uncontrolled", () => {
    render(<Select options={options} defaultValue="ibp-prd" aria-label="System" />);
    expect(screen.getByRole("combobox", { name: "System" })).toHaveTextContent("IBP Production");
  });

  it("respects controlled value and reports changes without switching itself", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} value="ibp-prd" onValueChange={onValueChange} aria-label="System" />);
    const trigger = screen.getByRole("combobox", { name: "System" });
    expect(trigger).toHaveTextContent("IBP Production");

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: /IBP Quality/ }));
    expect(onValueChange).toHaveBeenCalledWith("ibp-qas");
    expect(trigger).toHaveTextContent("IBP Production");
  });

  it("marks disabled options and does not select them", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} aria-label="System" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "System" }));
    const disabledOption = await screen.findByRole("option", { name: /ECC Development/ });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(disabledOption);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not open when disabled and exposes invalid state", async () => {
    render(<Select options={options} disabled invalid aria-label="System" />);
    const trigger = screen.getByRole("combobox", { name: "System" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger).catch(() => undefined);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
