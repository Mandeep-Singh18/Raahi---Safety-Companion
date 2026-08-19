/**
 * __tests__/alert.test.ts
 * Unit tests for alert generation and formatting logic.
 */

import { describe, it, expect } from "vitest";
import { generateAlert, formatAlertMessage, getAlertSummary, getAlertReasonLabel } from "@/lib/alert";
import type { Session, Contact } from "@/types";

const mockSession: Session = {
  id: "session-001",
  mode: "walking",
  durationMinutes: 15,
  startedAt: new Date(Date.now() - 16 * 60_000).toISOString(), // started 16 min ago
  location: { latitude: 28.6139, longitude: 77.209, accuracy: 20 },
  status: "active",
};

const mockContacts: Contact[] = [
  {
    id: "c1",
    name: "Ravi",
    contactInfo: "+91 98765 00001",
    contactType: "phone",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Nisha",
    contactInfo: "nisha@example.com",
    contactType: "email",
    createdAt: new Date().toISOString(),
  },
];

describe("generateAlert", () => {
  it("creates an alert with reason 'expired'", () => {
    const alert = generateAlert(mockSession, mockContacts, "expired");
    expect(alert.reason).toBe("expired");
    expect(alert.sessionId).toBe("session-001");
  });

  it("creates an alert with reason 'sos'", () => {
    const alert = generateAlert(mockSession, mockContacts, "sos");
    expect(alert.reason).toBe("sos");
  });

  it("includes all provided contacts in the alert", () => {
    const alert = generateAlert(mockSession, mockContacts, "expired");
    expect(alert.contacts).toHaveLength(2);
    expect(alert.contacts.map((c) => c.name)).toContain("Ravi");
    expect(alert.contacts.map((c) => c.name)).toContain("Nisha");
  });

  it("captures the session location", () => {
    const alert = generateAlert(mockSession, mockContacts, "sos");
    expect(alert.location).not.toBeNull();
    expect(alert.location?.latitude).toBeCloseTo(28.6139);
  });

  it("generates a unique id and triggeredAt timestamp", () => {
    const alert1 = generateAlert(mockSession, mockContacts, "sos");
    const alert2 = generateAlert(mockSession, mockContacts, "sos");
    expect(alert1.id).not.toBe(alert2.id);
    expect(alert1.triggeredAt).toBeTruthy();
  });

  it("handles a session with no location", () => {
    const noLocSession: Session = { ...mockSession, location: null };
    const alert = generateAlert(noLocSession, mockContacts, "expired");
    expect(alert.location).toBeNull();
  });

  it("handles an empty contacts list", () => {
    const alert = generateAlert(mockSession, [], "sos");
    expect(alert.contacts).toHaveLength(0);
  });
});

describe("formatAlertMessage", () => {
  it("includes contact names in the message", () => {
    const alert = generateAlert(mockSession, mockContacts, "expired");
    const message = formatAlertMessage(alert);
    expect(message).toContain("Ravi");
    expect(message).toContain("Nisha");
  });

  it("includes the trigger reason", () => {
    const alert = generateAlert(mockSession, mockContacts, "sos");
    const message = formatAlertMessage(alert);
    expect(message).toContain("Manual SOS");
  });

  it("shows 'Location unavailable' when location is null", () => {
    const noLocSession: Session = { ...mockSession, location: null };
    const alert = generateAlert(noLocSession, mockContacts, "expired");
    const message = formatAlertMessage(alert);
    expect(message).toContain("Location unavailable");
  });
});

describe("getAlertSummary", () => {
  it("summarises a single contact correctly", () => {
    const alert = generateAlert(mockSession, [mockContacts[0]], "sos");
    expect(getAlertSummary(alert)).toBe("Alert sent to Ravi.");
  });

  it("summarises multiple contacts correctly", () => {
    const alert = generateAlert(mockSession, mockContacts, "sos");
    expect(getAlertSummary(alert)).toContain("Ravi");
    expect(getAlertSummary(alert)).toContain("1 other");
  });

  it("handles no contacts gracefully", () => {
    const alert = generateAlert(mockSession, [], "sos");
    expect(getAlertSummary(alert)).toBe("Alert sent to no contacts.");
  });
});

describe("getAlertReasonLabel", () => {
  it("returns correct label for sos", () => {
    expect(getAlertReasonLabel("sos")).toBe("Manual SOS");
  });
  it("returns correct label for expired", () => {
    expect(getAlertReasonLabel("expired")).toBe("Check-in timer expired");
  });
});
