"use client";

import type { Contact } from "@/types";

interface ContactListProps {
  contacts: Contact[];
  onRemove: (id: string) => Promise<void>;
}

export function ContactList({ contacts, onRemove }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
        <p className="text-2xl" aria-hidden="true">👤</p>
        <p className="mt-2 text-sm text-slate-400">No contacts yet.</p>
        <p className="text-sm text-slate-500">Add someone who will be alerted if you don't check in.</p>
      </div>
    );
  }

  return (
    <section aria-label="Trusted contacts list">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">
        {contacts.length} trusted contact{contacts.length !== 1 ? "s" : ""}
      </h2>
      <ul className="space-y-3">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50
              bg-slate-800/60 px-5 py-4 transition-colors hover:border-slate-600"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{contact.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-400">
                <span aria-hidden="true">
                  {contact.contactType === "email" ? "✉" : "📞"}
                </span>
                <span>
                  <span className="sr-only">
                    {contact.contactType === "email" ? "Email:" : "Phone:"}
                  </span>
                  {contact.contactInfo}
                </span>
              </p>
            </div>
            <button
              onClick={() => onRemove(contact.id)}
              aria-label={`Remove ${contact.name} from trusted contacts`}
              className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors
                hover:bg-rose-950/50 hover:text-rose-400
                focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 focus:ring-offset-slate-800"
            >
              <span aria-hidden="true" className="text-lg leading-none">×</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
