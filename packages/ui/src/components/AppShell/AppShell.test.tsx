import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

function renderShell(shellProps: Parameters<typeof AppShell>[0] = {}) {
  return render(
    <AppShell {...shellProps}>
      <AppShell.Sidebar>
        <AppShell.Brand>Shamrock</AppShell.Brand>
        <AppShell.NavSection title="Operate">
          <AppShell.NavItem label="Runs" active count={128} onClick={() => undefined} />
          <AppShell.NavItem label="Explore" href="#explore" />
        </AppShell.NavSection>
      </AppShell.Sidebar>
      <AppShell.Topbar start={<span>trail</span>} end={<span>actions</span>} />
      <AppShell.ContextBar>filters</AppShell.ContextBar>
      <AppShell.Content>page body</AppShell.Content>
    </AppShell>,
  );
}

describe("AppShell", () => {
  it("renders semantic landmarks: aside, nav, header/banner, main", () => {
    renderShell();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Operate" })).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page body");
  });

  it("renders NavItem as <a> with href, <button> without, and marks active with aria-current", () => {
    renderShell();
    const link = screen.getByRole("link", { name: "Explore" });
    expect(link).toHaveAttribute("href", "#explore");
    const active = screen.getByRole("button", { name: /Runs/ });
    expect(active.tagName).toBe("BUTTON");
    expect(active).toHaveAttribute("aria-current", "page");
    expect(active).toHaveTextContent("128");
    expect(screen.getByRole("link", { name: "Explore" })).not.toHaveAttribute("aria-current");
  });

  it("toggles collapse uncontrolled and puts label in title when collapsed", async () => {
    renderShell();
    const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(toggle);
    const expandToggle = screen.getByRole("button", { name: "Expand sidebar" });
    expect(expandToggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute("title", "Explore");
  });

  it("respects controlled collapsed and reports intent via onCollapsedChange", async () => {
    const onCollapsedChange = vi.fn();
    renderShell({ collapsed: true, onCollapsedChange });
    const toggle = screen.getByRole("button", { name: "Expand sidebar" });
    await userEvent.click(toggle);
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
    // still collapsed — parent owns the state
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("supports defaultCollapsed", () => {
    renderShell({ defaultCollapsed: true });
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });
});
