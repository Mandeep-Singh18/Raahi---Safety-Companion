/**
 * __tests__/timer.test.ts
 * Unit tests for pure timer logic.
 */

import { describe, it, expect } from "vitest";
import {
  isSessionExpired,
  getRemainingMs,
  formatCountdown,
  shouldAnnounce,
  getTimerAnnouncement,
} from "@/lib/timer";
import type { Session } from "@/types";

function makeSession(startedMinutesAgo: number, durationMinutes = 15): Session {
  return {
    id: "test-session",
    mode: "walking",
    durationMinutes,
    startedAt: new Date(Date.now() - startedMinutesAgo * 60_000).toISOString(),
    location: null,
    status: "active",
  };
}

describe("isSessionExpired", () => {
  it("returns false for a freshly started session", () => {
    const session = makeSession(0, 15);
    expect(isSessionExpired(session)).toBe(false);
  });

  it("returns false for a session with time remaining", () => {
    const session = makeSession(10, 15); // 10 min elapsed, 15 min duration
    expect(isSessionExpired(session)).toBe(false);
  });

  it("returns true when session duration has passed", () => {
    const session = makeSession(20, 15); // 20 min elapsed, 15 min duration
    expect(isSessionExpired(session)).toBe(true);
  });

  it("returns true exactly at expiry (edge case)", () => {
    const session = makeSession(0, 15);
    // Simulate now being exactly at expiry
    const futureNow = new Date(session.startedAt).getTime() + 15 * 60_000;
    expect(isSessionExpired(session, futureNow)).toBe(true);
  });

  it("accepts a custom 'now' for deterministic testing", () => {
    const session = makeSession(0, 5);
    const fiveMinutesLater = Date.now() + 6 * 60_000;
    expect(isSessionExpired(session, fiveMinutesLater)).toBe(true);
  });
});

describe("getRemainingMs", () => {
  it("returns a positive number for an active session", () => {
    const session = makeSession(5, 15); // 5 min elapsed, 10 min left
    const remaining = getRemainingMs(session);
    expect(remaining).toBeGreaterThan(0);
    // Roughly 10 minutes left (allow ±5s for test execution)
    expect(remaining).toBeGreaterThan(9 * 60_000 - 5000);
    expect(remaining).toBeLessThan(11 * 60_000);
  });

  it("returns zero or negative for an expired session", () => {
    const session = makeSession(20, 15);
    expect(getRemainingMs(session)).toBeLessThanOrEqual(0);
  });
});

describe("formatCountdown", () => {
  it("formats 90 seconds as '01:30'", () => {
    expect(formatCountdown(90_000)).toBe("01:30");
  });

  it("formats 0 ms as '00:00'", () => {
    expect(formatCountdown(0)).toBe("00:00");
  });

  it("clamps negative values to '00:00'", () => {
    expect(formatCountdown(-5000)).toBe("00:00");
  });

  it("formats 15 minutes as '15:00'", () => {
    expect(formatCountdown(15 * 60_000)).toBe("15:00");
  });

  it("formats 1 second as '00:01'", () => {
    expect(formatCountdown(1000)).toBe("00:01");
  });
});

describe("shouldAnnounce", () => {
  it("announces at 10 seconds remaining", () => {
    expect(shouldAnnounce(10_000)).toBe(true);
  });

  it("announces at 30 seconds remaining", () => {
    expect(shouldAnnounce(30_000)).toBe(true);
  });

  it("announces at 60 seconds remaining", () => {
    expect(shouldAnnounce(60_000)).toBe(true);
  });

  it("does NOT announce at 45 seconds remaining", () => {
    expect(shouldAnnounce(45_000)).toBe(false);
  });

  it("announces at expiry (0 ms)", () => {
    expect(shouldAnnounce(0)).toBe(true);
  });
});

describe("getTimerAnnouncement", () => {
  it("announces time-up at 0 ms", () => {
    const msg = getTimerAnnouncement(0);
    expect(msg.toLowerCase()).toContain("time is up");
  });

  it("includes seconds count when under 60s", () => {
    const msg = getTimerAnnouncement(30_000);
    expect(msg).toContain("30 seconds");
  });

  it("includes minute count when over 60s", () => {
    const msg = getTimerAnnouncement(5 * 60_000);
    expect(msg).toContain("5 minute");
  });
});
