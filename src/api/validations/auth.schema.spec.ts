import { describe, it, expect } from "vitest";
import { RegisterSchema, ResendOTPSchema } from "./auth.schema";

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

describe("ResendOTPSchema", () => {
  it("should validate a correct email payload", () => {
    const payload = {
      email: "user@example.com",
    };
    const result = ResendOTPSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("should trim and lowercase email", () => {
    const payload = {
      email: "  USER@EXAMPLE.COM  ",
    };
    const result = ResendOTPSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("should fail validation for invalid email", () => {
    const payload = {
      email: "invalid-email",
    };
    const result = ResendOTPSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should fail validation for missing email", () => {
    const payload = {};
    const result = ResendOTPSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
