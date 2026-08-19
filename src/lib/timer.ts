/**
 * lib/timer.ts
 * Pure timer logic — no side effects, fully unit-testable.
 */

import type { Session } from "@/types";

/**
 * Returns the Unix timestamp (ms) at which the session expires.
 */
export function getExpiryTime(session: Session): number {
  return new Date(session.startedAt).getTime() + session.durationMinutes * 60_000;
}

/**
 * Returns the number of milliseconds remaining in the session.
 * Returns a negative number if the session has already expired.
 */
export function getRemainingMs(session: Session, now: number = Date.now()): number {
  return getExpiryTime(session) - now;
}

/**
 * Returns true if the session timer has run out.
 * Accepts an optional `now` parameter so it can be tested without real time.
 */
export function isSessionExpired(session: Session, now: number = Date.now()): boolean {
  return getRemainingMs(session, now) <= 0;
}

/**
 * Formats remaining milliseconds as "MM:SS" for display.
 * Clamps to "00:00" when negative.
 */
export function formatCountdown(remainingMs: number): string {
  const clamped = Math.max(0, remainingMs);
  const totalSeconds = Math.ceil(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Returns true if the remaining time is a "notable" interval that
 * should be announced via ARIA live region (every 5 min, at 1 min,
 * 30 sec, 10 sec — avoids overwhelming screen reader users).
 */
export function shouldAnnounce(remainingMs: number): boolean {
  const remaining = Math.ceil(remainingMs / 1000); // in seconds
  if (remaining <= 0) return true;
  if (remaining === 10) return true;
  if (remaining === 30) return true;
  if (remaining === 60) return true;
  if (remaining % 300 === 0) return true; // every 5 minutes
  return false;
}

/**
 * Generates an ARIA announcement message for the current timer state.
 */
export function getTimerAnnouncement(remainingMs: number): string {
  const remaining = Math.ceil(remainingMs / 1000);
  if (remaining <= 0) return "Time is up. Alert is being triggered.";
  if (remaining <= 10) return `${remaining} seconds remaining. Press I'm Safe to cancel alert.`;
  if (remaining <= 60) return `${remaining} seconds remaining.`;
  const minutes = Math.floor(remaining / 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""} remaining.`;
}
