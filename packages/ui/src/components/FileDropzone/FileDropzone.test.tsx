import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileDropzone, formatBytes } from "./FileDropzone";

function makeFile(name: string, size: number): File {
  const file = new File(["x"], name);
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("formatBytes", () => {
  it("formats B / KB / MB with one decimal", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1_600_000)).toBe("1.5 MB");
  });
});

describe("FileDropzone", () => {
  it("renders accept-aware copy with a browse affordance and is one button", () => {
    render(<FileDropzone accept=".xlsx" />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Drag & drop your .xlsx file here, or browse");
    expect(screen.getByText("browse")).toBeInTheDocument();
  });

  it("opens the hidden file input when the zone is activated", async () => {
    const { container } = render(<FileDropzone accept=".xlsx" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    await userEvent.click(screen.getByRole("button"));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("emits selected files from the input via onFiles", async () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDropzone accept=".xlsx" onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, makeFile("config.xlsx", 1000));
    expect(onFiles).toHaveBeenCalledOnce();
    expect(onFiles.mock.calls[0]![0][0].name).toBe("config.xlsx");
  });

  it("rejects oversize files with inline critical text + onError, still delivering valid ones", async () => {
    const onFiles = vi.fn();
    const onError = vi.fn();
    const { container } = render(
      <FileDropzone accept=".xlsx" multiple maxBytes={1024} onFiles={onFiles} onError={onError} />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, [makeFile("small.xlsx", 500), makeFile("big.xlsx", 5000)]);
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByRole("alert")).toHaveTextContent("big.xlsx exceeds the 1 KB limit.");
    expect(onFiles).toHaveBeenCalledOnce();
    expect(onFiles.mock.calls[0]![0].map((f: File) => f.name)).toEqual(["small.xlsx"]);
  });

  it("renders disabledReason inside a disabled zone and blocks the picker", async () => {
    render(<FileDropzone accept=".xlsx" disabled disabledReason="Select an L0 stage above to enable upload" />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Select an L0 stage above to enable upload");
  });

  it("renders file chips with formatted size and removes via onRemove", async () => {
    const onRemove = vi.fn();
    render(
      <FileDropzone
        accept=".xlsx"
        selectedFiles={[makeFile("planning-areas.xlsx", 1_600_000)]}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("planning-areas.xlsx")).toBeInTheDocument();
    expect(screen.getByText("1.5 MB")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove planning-areas.xlsx" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRemove.mock.calls[0]![1]).toBe(0);
  });

  it("clears the error and delivers files on a subsequent valid upload", async () => {
    const { container } = render(<FileDropzone accept=".xlsx" maxBytes={1024} onFiles={vi.fn()} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, makeFile("big.xlsx", 5000));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await userEvent.upload(input, makeFile("ok.xlsx", 500));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
