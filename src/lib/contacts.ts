/**
 * lib/contacts.ts
 * Pure contact validation logic + server-side file store.
 * Validation is used both server-side (API route) and can be imported in tests.
 */

import type { Contact, ContactType, ValidationResult, CreateContactPayload } from "@/types";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// ─── Validation ───────────────────────────────────────────────────────────────

const PHONE_REGEX = /^[+\d][\d\s\-().]{6,19}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Detects whether a string looks like a phone number or email.
 * Returns undefined if it matches neither.
 */
function detectContactType(contactInfo: string): ContactType | undefined {
  const trimmed = contactInfo.trim();
  if (EMAIL_REGEX.test(trimmed)) return "email";
  if (PHONE_REGEX.test(trimmed)) return "phone";
  return undefined;
}

/**
 * Validates a raw contact payload from the client.
 * Returns a ValidationResult with all error messages (never throws).
 */
export function validateContact(payload: CreateContactPayload): ValidationResult {
  const errors: string[] = [];

  const name = (payload.name ?? "").trim();
  const contactInfo = (payload.contactInfo ?? "").trim();

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > 100) {
    errors.push("Name must be 100 characters or fewer.");
  }

  if (!contactInfo) {
    errors.push("Contact info (phone or email) is required.");
  }

  const contactType = detectContactType(contactInfo);

  if (contactInfo && !contactType) {
    errors.push(
      "Contact info must be a valid phone number (e.g. +91 98765 43210) or email address."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    contactType,
  };
}

// ─── File-based store (server-only) ──────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readContacts(): Contact[] {
  ensureDataDir();
  if (!fs.existsSync(CONTACTS_FILE)) return [];
  try {
    const raw = fs.readFileSync(CONTACTS_FILE, "utf-8");
    return JSON.parse(raw) as Contact[];
  } catch {
    return [];
  }
}

export function writeContacts(contacts: Contact[]): void {
  ensureDataDir();
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf-8");
}

export function addContact(payload: CreateContactPayload): Contact {
  const newContact = createContact(payload);
  const existing = readContacts();
  writeContacts([...existing, newContact]);
  return newContact;
}

export function createContact(payload: CreateContactPayload): Contact {
  const validation = validateContact(payload);
  if (!validation.valid || !validation.contactType) {
    throw new Error(validation.errors.join("; "));
  }

  const newContact: Contact = {
    id: randomUUID(),
    name: payload.name.trim(),
    contactInfo: payload.contactInfo.trim(),
    contactType: validation.contactType,
    createdAt: new Date().toISOString(),
  };
  return newContact;
}

export function deleteContact(id: string): boolean {
  const contacts = readContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return false;
  writeContacts(filtered);
  return true;
}
