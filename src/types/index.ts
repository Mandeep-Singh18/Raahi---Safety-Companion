// ─── Core Domain Types for Raahi ─────────────────────────────────────────────

export type ContactType = "phone" | "email";

export interface Contact {
  id: string;
  name: string;
  contactInfo: string;
  contactType: ContactType;
  createdAt: string; // ISO 8601
}

export type SessionMode = "walking" | "cab" | "meeting";

export type SessionStatus = "active" | "safe" | "alerted";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface Session {
  id: string;
  mode: SessionMode;
  durationMinutes: number;
  startedAt: string; // ISO 8601
  location: GeoLocation | null;
  status: SessionStatus;
}

export type AlertReason = "expired" | "sos";

export interface Alert {
  id: string;
  sessionId: string;
  contacts: Contact[];
  location: GeoLocation | null;
  triggeredAt: string; // ISO 8601
  reason: AlertReason;
  sessionMode: SessionMode;
}

// ─── API types ────────────────────────────────────────────────────────────────

export interface CreateContactPayload {
  name: string;
  contactInfo: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  contactType?: ContactType;
}
