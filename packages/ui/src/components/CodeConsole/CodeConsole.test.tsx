import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeConsole, type CodeConsoleLine } from "./CodeConsole";

const lines: CodeConsoleLine[] = [
  { text: "starting", level: "info" },
  { text: "slow area", level: "warn" },
  { text: "boom", level: "error" },
];

describe("CodeConsole", () => {
  it("renders leveled lines with text", () => {
    render(<CodeConsole lines={lines} />);
    expect(screen.getByRole("log")).toBeInTheDocument();
    expect(screen.getByText("starting")).toBeInTheDocument();
    expect(screen.getByText("slow area")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("renders line numbers when enabled", () => {
    render(<CodeConsole lines={lines} lineNumbers />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a plain code block split into lines", () => {
    render(<CodeConsole code={"line one\nline two"} lineNumbers />);
    expect(screen.getByText("line one")).toBeInTheDocument();
    expect(screen.getByText("line two")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders the sm EmptyState when there is nothing to show", () => {
    render(<CodeConsole lines={[]} />);
    expect(screen.getByText("No logs yet.")).toBeInTheDocument();
    expect(screen.getByText("Run an execution to see live logs here.")).toBeInTheDocument();
    expect(screen.queryByRole("log")).not.toBeInTheDocument();
  });

  it("renders title and meta in the header", () => {
    render(<CodeConsole lines={lines} title="runner.py" meta="exit 0" />);
    expect(screen.getByText("runner.py")).toBeInTheDocument();
    expect(screen.getByText("exit 0")).toBeInTheDocument();
  });

  describe("copyable", () => {
    let writeText: ReturnType<typeof vi.fn>;
    beforeEach(() => {
      writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
      });
    });
    afterEach(() => {
      delete (navigator as unknown as Record<string, unknown>).clipboard;
    });

    it("copies joined line text and shows a transient Copied state", async () => {
      render(<CodeConsole lines={lines} copyable />);
      const button = screen.getByRole("button", { name: "Copy" });
      await userEvent.click(button);
      expect(writeText).toHaveBeenCalledWith("starting\nslow area\nboom");
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
      await waitFor(
        () => expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument(),
        { timeout: 2500 },
      );
    });

    it("copies the plain code block", async () => {
      render(<CodeConsole code={"a\nb"} copyable />);
      await userEvent.click(screen.getByRole("button", { name: "Copy" }));
      expect(writeText).toHaveBeenCalledWith("a\nb");
    });

    it("hides the copy button in the empty state", () => {
      render(<CodeConsole lines={[]} copyable />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  it("follows: scrolls the body to the bottom when new lines arrive", async () => {
    const scrollTo = vi.fn();
    // jsdom has no layout; make scrollHeight readable and capture scrollTop writes.
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get() {
        return 500;
      },
    });
    const scrollTopSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTop", {
      configurable: true,
      get() {
        return 0;
      },
      set(v) {
        scrollTopSpy(v);
      },
    });

    function Harness() {
      const [data, setData] = useState<CodeConsoleLine[]>([{ text: "a" }]);
      return (
        <>
          <button onClick={() => setData((d) => [...d, { text: `line-${d.length}` }])}>add</button>
          <CodeConsole lines={data} follow />
        </>
      );
    }
    render(<Harness />);
    // initial mount already pins to bottom
    expect(scrollTopSpy).toHaveBeenCalledWith(500);
    scrollTopSpy.mockClear();
    await userEvent.click(screen.getByRole("button", { name: "add" }));
    expect(scrollTopSpy).toHaveBeenCalledWith(500);

    // cleanup overrides
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).scrollHeight;
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).scrollTop;
    void scrollTo;
  });

  it("does not scroll when follow is off", () => {
    const scrollTopSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, get: () => 500 });
    Object.defineProperty(HTMLElement.prototype, "scrollTop", {
      configurable: true,
      get: () => 0,
      set: (v) => scrollTopSpy(v),
    });
    render(<CodeConsole lines={lines} />);
    expect(scrollTopSpy).not.toHaveBeenCalled();
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).scrollHeight;
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).scrollTop;
  });
});
