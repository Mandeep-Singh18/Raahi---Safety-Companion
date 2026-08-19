/**
 * __tests__/contacts.test.ts
 * Unit tests for contact validation logic.
 */

import { describe, it, expect } from "vitest";
import { validateContact } from "@/lib/contacts";

describe("validateContact", () => {
  it("accepts a valid email address", () => {
    const result = validateContact({ name: "Priya", contactInfo: "priya@example.com" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.contactType).toBe("email");
  });

  it("accepts a valid Indian phone number", () => {
    const result = validateContact({ name: "Arjun", contactInfo: "+91 98765 43210" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.contactType).toBe("phone");
  });

  it("accepts a plain 10-digit phone number", () => {
    const result = validateContact({ name: "Sneha", contactInfo: "9876543210" });
    expect(result.valid).toBe(true);
    expect(result.contactType).toBe("phone");
  });

  it("rejects an empty name", () => {
    const result = validateContact({ name: "", contactInfo: "test@example.com" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name is required.");
  });

  it("rejects a whitespace-only name", () => {
    const result = validateContact({ name: "   ", contactInfo: "test@example.com" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name is required.");
  });

  it("rejects garbage contact info", () => {
    const result = validateContact({ name: "Ali", contactInfo: "not-valid-anything" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("valid phone number") || e.includes("email"))).toBe(
      true
    );
  });

  it("rejects an email missing a domain", () => {
    const result = validateContact({ name: "Kumar", contactInfo: "kumar@" });
    expect(result.valid).toBe(false);
  });

  it("rejects empty contact info", () => {
    const result = validateContact({ name: "Meera", contactInfo: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Contact info (phone or email) is required.");
  });

  it("rejects a name over 100 characters", () => {
    const longName = "A".repeat(101);
    const result = validateContact({ name: longName, contactInfo: "test@example.com" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name must be 100 characters or fewer.");
  });
});
