import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { KeyValueList } from "./KeyValueList";
import styles from "./KeyValueList.module.css";

describe("KeyValueList", () => {
  afterEach(cleanup);

  it("renders key/value pairs as a definition list", () => {
    render(
      <KeyValueList
        items={[
          { key: "L0 Stage", value: "Demand Planning" },
          { key: "Run ID", value: "R-2026-1104", mono: true },
          { key: "Finished" },
        ]}
      />,
    );
    expect(screen.getByText("L0 Stage").tagName).toBe("DT");
    expect(screen.getByText("Demand Planning").tagName).toBe("DD");
    expect(screen.getByText("R-2026-1104")).toHaveClass(styles.mono!);
    // missing value → em dash, disabled styling
    expect(screen.getByText("—")).toHaveClass(styles.missing!);
  });

  it("supports the inline orientation", () => {
    render(<KeyValueList orientation="inline" items={[{ key: "Mode", value: "Automated" }]} />);
    expect(screen.getByText("Mode")).toHaveClass(styles.inlineKey!);
    expect(screen.getByText("Automated")).toBeInTheDocument();
  });
});
