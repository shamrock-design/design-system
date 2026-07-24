import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders a static div by default with the glass variant and default padding var", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card.className).toMatch(/glass/);
    expect(card.style.getPropertyValue("--sh-card-padding")).toBe("var(--sh-space-6)");
  });

  it("applies variant and padding token", () => {
    render(
      <Card data-testid="card" variant="solid" padding={0}>
        Flush
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.className).toMatch(/solid/);
    expect(card.style.getPropertyValue("--sh-card-padding")).toBe("var(--sh-space-0)");
  });

  it("accentBar renders the accent glow; a Status value sets the status color var", () => {
    const { rerender } = render(
      <Card data-testid="card" accentBar>
        A
      </Card>,
    );
    let card = screen.getByTestId("card");
    expect(card.className).toMatch(/accentGlow/);

    rerender(
      <Card data-testid="card" accentBar="critical">
        A
      </Card>,
    );
    card = screen.getByTestId("card");
    expect(card.className).toMatch(/accentGlow/);
    expect(card.style.getPropertyValue("--sh-card-accent")).toBe("var(--sh-color-status-critical-base)");
  });

  it("renders a button with onClick and fires it", async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Open run</Card>);
    const button = screen.getByRole("button", { name: "Open run" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toMatch(/interactive/);
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders an anchor with href (winning over onClick for semantics)", () => {
    render(
      <Card href="#detail" onClick={() => {}}>
        Run detail
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Run detail" });
    expect(link).toHaveAttribute("href", "#detail");
    expect(link.className).toMatch(/interactive/);
  });

  it("interactive can be forced without click semantics", () => {
    render(
      <Card data-testid="card" interactive>
        Hover me
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card.className).toMatch(/interactive/);
  });

  it("Card.Header renders title and trailing slot", () => {
    render(
      <Card>
        <Card.Header title="Demand planning" trailing={<span>badge</span>} />
      </Card>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Demand planning")).toBeInTheDocument();
    expect(screen.getByText("badge")).toBeInTheDocument();
  });
});
