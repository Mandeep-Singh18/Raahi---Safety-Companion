/**
 * lib/alert.ts
 * Pure alert generation logic — no side effects, fully unit-testable.
 */

import type { Session, Contact, Alert, AlertReason } from "@/types";


/**
 * Generates an Alert object from a session and its trusted contacts.
 * Pure function — takes all data as arguments, returns a new Alert.
 */
export function generateAlert(
  session: Session,
  contacts: Contact[],
  reason: AlertReason
): Alert {
  return {
    id: globalThis.crypto.randomUUID(),
    sessionId: session.id,
    contacts: [...contacts],
    location: session.location,
    triggeredAt: new Date().toISOString(),
    reason,
    sessionMode: session.mode,
  };
}

/**
 * Returns a human-readable label for the session mode.
 */
export function getSessionModeLabel(mode: Session["mode"]): string {
  const labels: Record<Session["mode"], string> = {
    walking: "Walking home",
    cab: "Cab ride",
    meeting: "Meeting someone",
  };
  return labels[mode];
}

/**
 * Returns a human-readable reason label for the alert trigger.
 */
export function getAlertReasonLabel(reason: AlertReason): string {
  return reason === "sos" ? "Manual SOS" : "Check-in timer expired";
}

/**
 * Formats a complete alert into a human-readable message string.
 * Used for display and logging — simulates what would be sent via SMS/email.
 */
export function formatAlertMessage(alert: Alert): string {
  const contactNames = alert.contacts.map((c) => c.name).join(", ");
  const locationStr = alert.location
    ? `${alert.location.latitude.toFixed(5)}, ${alert.location.longitude.toFixed(5)}`
    : "Location unavailable";
  const modeLabel = getSessionModeLabel(alert.sessionMode);
  const reasonLabel = getAlertReasonLabel(alert.reason);
  const triggeredTime = new Date(alert.triggeredAt).toLocaleTimeString();

  return (
    `🚨 RAAHI SAFETY ALERT\n` +
    `Triggered at: ${triggeredTime}\n` +
    `Reason: ${reasonLabel}\n` +
    `Activity: ${modeLabel}\n` +
    `Last known location: ${locationStr}\n` +
    `Notified contacts: ${contactNames || "None"}`
  );
}

/**
 * Returns a short summary suitable for the UI alert banner.
 */
export function getAlertSummary(alert: Alert): string {
  const count = alert.contacts.length;
  const names =
    count === 0
      ? "no contacts"
      : count === 1
        ? alert.contacts[0].name
        : `${alert.contacts[0].name} and ${count - 1} other${count - 1 > 1 ? "s" : ""}`;
  return `Alert sent to ${names}.`;
}
