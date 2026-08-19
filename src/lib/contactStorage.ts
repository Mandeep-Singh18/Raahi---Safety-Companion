import type { Contact } from "@/types";

const CONTACTS_STORAGE_KEY = "raahi.trustedContacts";

export function loadStoredContacts(): Contact[] {
  try {
    const raw = window.localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!raw) return [];
    const contacts = JSON.parse(raw) as unknown;
    return Array.isArray(contacts) ? contacts as Contact[] : [];
  } catch {
    return [];
  }
}

export function saveStoredContacts(contacts: Contact[]): void {
  window.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}