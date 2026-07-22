import { describe, expect, it } from "vitest";
import { STATUSES, mapLegacyStatus } from "./status";

describe("mapLegacyStatus", () => {
  it("normalizes the fragmented done-family vocab", () => {
    expect(mapLegacyStatus("Finished")).toBe("success");
    expect(mapLegacyStatus("Completed")).toBe("success");
    expect(mapLegacyStatus("success")).toBe("success");
    expect(mapLegacyStatus("PASS")).toBe("success");
  });

  it("normalizes the late/failed families", () => {
    expect(mapLegacyStatus("Overdue")).toBe("warning");
    expect(mapLegacyStatus("Delayed")).toBe("warning");
    expect(mapLegacyStatus("Aborted")).toBe("critical");
    expect(mapLegacyStatus("failed")).toBe("critical");
  });

  it("passes canonical values through", () => {
    for (const status of STATUSES) {
      expect(mapLegacyStatus(status)).toBe(status);
    }
  });

  it("handles spacing/casing variants and unknowns", () => {
    expect(mapLegacyStatus("no runs")).toBe("pending");
    expect(mapLegacyStatus("In Progress")).toBe("running");
    expect(mapLegacyStatus("whatever-else")).toBe("neutral");
  });
});
