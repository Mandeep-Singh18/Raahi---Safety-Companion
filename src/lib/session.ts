/**
 * lib/session.ts
 * Session creation helpers — pure factory functions.
 */

import type { Session, SessionMode, GeoLocation } from "@/types";


/**
 * Creates a new Session object with a unique ID and current timestamp.
 * Pure factory — callers provide all inputs; no side effects.
 */
export function createSession(
  mode: SessionMode,
  durationMinutes: number,
  location: GeoLocation | null
): Session {
  return {
    id: globalThis.crypto.randomUUID(),
    mode,
    durationMinutes: Math.max(1, Math.min(120, durationMinutes)), // clamp 1–120 min
    startedAt: new Date().toISOString(),
    location,
    status: "active",
  };
}

/**
 * Returns a display label for each session mode, including an emoji icon.
 */
export function getSessionModeDisplayInfo(mode: SessionMode): {
  label: string;
  icon: string;
  description: string;
} {
  const info = {
    walking: {
      label: "Walking home",
      icon: "🚶",
      description: "Share your location while walking to your destination",
    },
    cab: {
      label: "Cab ride",
      icon: "🚕",
      description: "Stay safe during a taxi or rideshare journey",
    },
    meeting: {
      label: "Meeting someone",
      icon: "🤝",
      description: "Check in when meeting a new person",
    },
  } satisfies Record<SessionMode, { label: string; icon: string; description: string }>;

  return info[mode];
}
