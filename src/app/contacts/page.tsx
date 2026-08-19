"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";
import type { Contact } from "@/types";
import { ContactForm } from "@/components/ContactForm";
import { ContactList } from "@/components/ContactList";
import { AriaLiveRegion } from "@/components/AriaLiveRegion";

// Note: metadata must be in a server component; placed in a separate layout or
// via a server wrapper. For this client component page we set document title inline.

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    document.title = "Trusted Contacts | Raahi";
  }, []);

  useEffect(() => {
    async function loadContacts() {
      try {
        const res = await fetch("/api/contacts");
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
        setContacts(data);
      } catch {
        setLoadError("Could not load contacts. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    }
    loadContacts();
  }, []);

  function handleContactAdded(contact: Contact) {
    setContacts((prev) => [...prev, contact]);
    setStatusMsg(`${contact.name} added to trusted contacts.`);
  }

  async function handleRemove(id: string) {
    const contact = contacts.find((c) => c.id === id);
    try {
      const res = await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setStatusMsg(contact ? `${contact.name} removed from trusted contacts.` : "Contact removed.");
    } catch {
      setStatusMsg("Failed to remove contact. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <AriaLiveRegion message={statusMsg} />

      {/* Page header */}
      <header>
        <h1 className="text-2xl font-black text-white sm:text-3xl">Trusted Contacts</h1>
        <p className="mt-1 text-sm text-slate-400">
          These people will be alerted if you don't check in during a safety session.
        </p>
      </header>

      {/* Two-column layout on desktop */}
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        {/* Add contact form — left column (narrower) */}
        <section
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2"
          aria-label="Add new trusted contact"
        >
          <ContactForm onContactAdded={handleContactAdded} />
        </section>

        {/* Contact list — right column (wider) */}
        <section className="lg:col-span-3" aria-label="Your trusted contacts">
          {isLoading ? (
            <div className="flex items-center justify-center py-12" aria-busy="true">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-violet-500" />
              <span className="sr-only">Loading contacts...</span>
            </div>
          ) : loadError ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-5 py-4"
            >
              <p className="flex items-center gap-2 text-sm font-medium text-rose-300">
                <span aria-hidden="true">⚠</span> {loadError}
              </p>
            </div>
          ) : (
            <ContactList contacts={contacts} onRemove={handleRemove} />
          )}
        </section>
      </div>
    </div>
  );
}

