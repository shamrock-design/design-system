import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, getIdentityColorIndex, getInitials } from "./Avatar";

describe("getInitials", () => {
  it("takes the first letters of the first two words", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("grace brewster murray hopper")).toBe("GB");
    expect(getInitials("Cher")).toBe("C");
    expect(getInitials("  spaced   out  ")).toBe("SO");
  });
});

describe("getIdentityColorIndex", () => {
  it("is deterministic and within 1..5", () => {
    const a = getIdentityColorIndex("Ada Lovelace");
    const b = getIdentityColorIndex("Ada Lovelace");
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(1);
    expect(a).toBeLessThanOrEqual(5);
  });
});

describe("Avatar", () => {
  it("renders initials with an accessible label and the identity color var", () => {
    render(<Avatar name="Ada Lovelace" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar).toHaveTextContent("AL");
    expect(avatar.style.getPropertyValue("--sh-avatar-bg")).toBe(
      `var(--sh-color-chart-cat-${getIdentityColorIndex("Ada Lovelace")})`,
    );
  });

  it("renders an image with empty alt when src is provided", () => {
    const { container } = render(<Avatar name="Grace Hopper" src="/grace.png" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("src", "/grace.png");
    expect(screen.queryByText("GH")).not.toBeInTheDocument();
  });

  it("falls back to initials when the image fails to load", () => {
    const { container } = render(<Avatar name="Grace Hopper" src="/broken.png" />);
    const img = container.querySelector("img")!;
    fireEvent.error(img);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("GH")).toBeInTheDocument();
  });

  it("muted drops the identity color for a hairline ring variant", () => {
    render(<Avatar name="Alan Turing" muted />);
    const avatar = screen.getByRole("img", { name: "Alan Turing" });
    expect(avatar.className).toMatch(/muted/);
    expect(avatar.style.getPropertyValue("--sh-avatar-bg")).toBe("");
  });

  it("applies the size class", () => {
    render(<Avatar name="Ada Lovelace" size="lg" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).className).toMatch(/lg/);
  });
});
