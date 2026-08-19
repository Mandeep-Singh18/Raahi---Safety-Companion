"use client";

import { useState, useEffect } from "react";
import type { Contact, Session, Alert, SessionMode, GeoLocation } from "@/types";
import { SessionSetup } from "@/components/SessionSetup";
import { SessionActive } from "@/components/SessionActive";
import { AlertDisplay } from "@/components/AlertDisplay";
import { createSession } from "@/lib/session";

type PageState = "setup" | "active" | "safe" | "alerted";

export default function SessionPage() {
  const [pageState, setPageState] = useState<PageState>("setup");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    document.title = "Safety Session | Raahi";
  }, []);

  // Load contacts once on mount
  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .catch(() => setContacts([]));
  }, []);

  function handleStart(mode: SessionMode, durationMinutes: number, location: GeoLocation | null) {
    const newSession = createSession(mode, durationMinutes, location);
    setSession(newSession);
    setPageState("active");
  }

  function handleSafe() {
    setPageState("safe");
  }

  function handleAlert(triggeredAlert: Alert) {
    setAlert(triggeredAlert);
    setPageState("alerted");
  }

  function handleNewSession() {
    setSession(null);
    setAlert(null);
    setPageState("setup");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header — changes with state */}
      {pageState === "setup" && (
        <header>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Start Safety Session</h1>
          <p className="mt-1 text-sm text-slate-400">
            Set your activity and check-in timer. We'll alert your contacts if you don't respond.
          </p>
          {contacts.length === 0 && (
            <div className="mt-3 rounded-xl border border-amber-700/30 bg-amber-950/30 px-4 py-3">
              <p className="text-sm text-amber-300">
                ⚠{" "}
                <a href="/contacts" className="underline hover:text-amber-200">
                  Add trusted contacts
                </a>{" "}
                first so someone can be alerted if needed.
              </p>
            </div>
          )}
        </header>
      )}

      {pageState === "active" && (
        <header>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Session Active</h1>
          <p className="mt-1 text-sm text-slate-400">Check in before the timer runs out.</p>
        </header>
      )}

      {pageState === "safe" && (
        <header>
          <h1 className="text-2xl font-black text-emerald-400 sm:text-3xl">You're Safe! ✓</h1>
          <p className="mt-1 text-sm text-slate-400">Session ended. No alerts were sent.</p>
        </header>
      )}

      {pageState === "alerted" && (
        <header>
          <h1 className="text-2xl font-black text-rose-400 sm:text-3xl">Alert Triggered</h1>
        </header>
      )}

      {/* Main content area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        {pageState === "setup" && <SessionSetup onStart={handleStart} />}

        {pageState === "active" && session && (
          <SessionActive
            session={session}
            contacts={contacts}
            onSafe={handleSafe}
            onAlert={handleAlert}
          />
        )}

        {pageState === "safe" && (
          <div className="space-y-6 text-center">
            <div
              role="status"
              aria-live="polite"
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full
                border-4 border-emerald-500 bg-emerald-950/60"
            >
              <span className="text-5xl" role="img" aria-label="Checkmark">✓</span>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">Checked in successfully</p>
              <p className="mt-1 text-sm text-slate-400">
                Great — no alerts were sent. Stay safe out there.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNewSession}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4
                text-base font-bold text-white shadow-lg shadow-violet-900/40
                transition-all duration-200 hover:from-violet-500 hover:to-violet-400
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400
                focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Start New Session
            </button>
          </div>
        )}

        {pageState === "alerted" && alert && (
          <AlertDisplay alert={alert} onNewSession={handleNewSession} />
        )}
      </div>
    </div>
  );
}

