import { describe, expect, it } from "vitest";
import { typesVersion } from "../index";

describe("types package", () => {
  it("exports a runtime version string", () => {
    expect(typesVersion).toMatch(/\d+\.\d+\.\d+/);
  });
});
