import { describe, it, expect } from "vitest";
import { RegisterSchema } from "./auth.schema";

describe("RegisterSchema", () => {
  it("should validate a correct payload", () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      businessEmail: "john@example.com",
    };
    const result = RegisterSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should fail validation for short names", () => {
    const payload = {
      firstName: "J",
      lastName: "D",
      businessEmail: "john@example.com",
    };
    const result = RegisterSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.some(i => i.message === "First name must be at least 2 characters")).toBe(true);
      expect(issues.some(i => i.message === "Last name must be at least 2 characters")).toBe(true);
    }
  });

  it("should fail validation for invalid email", () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      businessEmail: "invalid-email",
    };
    const result = RegisterSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
