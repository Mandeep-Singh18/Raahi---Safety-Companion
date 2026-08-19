"use client";

import { useEffect, useState, useCallback } from "react";
import type { Session, Contact, Alert } from "@/types";
import {
  getRemainingMs,
  isSessionExpired,
  formatCountdown,
  shouldAnnounce,
  getTimerAnnouncement,
} from "@/lib/timer";
import { generateAlert, getSessionModeLabel } from "@/lib/alert";
import { AriaLiveRegion } from "./AriaLiveRegion";

interface SessionActiveProps {
  session: Session;
  contacts: Contact[];
  onSafe: () => void;
  onAlert: (alert: Alert) => void;
}

export function SessionActive({ session, contacts, onSafe, onAlert }: SessionActiveProps) {
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(session));
  const [announcement, setAnnouncement] = useState("");
  const [alertAnnouncement, setAlertAnnouncement] = useState("");
  const [hasExpired, setHasExpired] = useState(false);

  const triggerAlert = useCallback(
    (reason: "expired" | "sos") => {
      const alert = generateAlert(session, contacts, reason);
      const msg =
        reason === "sos"
          ? "SOS activated. Alert sent to your trusted contacts."
          : "Check-in time expired. Alert sent to your trusted contacts.";
      setAlertAnnouncement(msg);

      // Fire real email alerts — non-blocking, runs in background
      fetch("/api/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.sent > 0) {
            console.log(`[Raahi] Alert notifications sent to ${data.sent} contact(s).`);
          } else {
            const deliveryError = data.results?.find(
              (result: { success: boolean; error?: string }) => !result.success
            )?.error;
            console.warn(
              "[Raahi] Alert delivery failed:",
              deliveryError ?? data.message ?? data.error ?? "No provider is configured."
            );
          }
        })
        .catch((err) => console.error("[Raahi] Failed to call /api/alert:", err));

      onAlert(alert);
    },
    [session, contacts, onAlert]
  );


  useEffect(() => {
    if (hasExpired) return;

    const interval = setInterval(() => {
      const remaining = getRemainingMs(session);
      setRemainingMs(remaining);

      if (isSessionExpired(session)) {
        clearInterval(interval);
        setHasExpired(true);
        triggerAlert("expired");
        return;
      }

      if (shouldAnnounce(remaining)) {
        setAnnouncement(getTimerAnnouncement(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, hasExpired, triggerAlert]);

  const pct = Math.max(0, Math.min(100, (remainingMs / (session.durationMinutes * 60_000)) * 100));
  const isLow = remainingMs < 60_000; // under 1 minute
  const isCritical = remainingMs < 30_000; // under 30 seconds

  const ringColor = isCritical
    ? "stroke-rose-500"
    : isLow
      ? "stroke-amber-400"
      : "stroke-violet-500";

  const textColor = isCritical ? "text-rose-400" : isLow ? "text-amber-400" : "text-white";

  // SVG circle maths
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="space-y-8">
      {/* ARIA announcements */}
      <AriaLiveRegion message={announcement} politeness="polite" />
      <AriaLiveRegion message={alertAnnouncement} politeness="assertive" />

      {/* Session context */}
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-400">Active session</p>
        <p className="mt-1 text-lg font-semibold text-white">{getSessionModeLabel(session.mode)}</p>
        {session.location ? (
          <p className="mt-1 text-xs text-slate-500">
            📍 Location captured · {session.location.latitude.toFixed(4)}, {session.location.longitude.toFixed(4)}
          </p>
        ) : (
          <p className="mt-1 text-xs text-amber-500">⚠ No location — session still active</p>
        )}
      </div>

      {/* Circular countdown */}
      <div className="flex flex-col items-center gap-4" role="timer" aria-label="Session countdown">
        <div className="relative">
          <svg width="200" height="200" className="-rotate-90" aria-hidden="true">
            {/* Track */}
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              className={`transition-all duration-1000 ${ringColor}`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          {/* Time text centered over SVG */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-4xl font-black tabular-nums tracking-tight transition-colors duration-500 ${textColor}`}
              aria-live="off"
            >
              {formatCountdown(remainingMs)}
            </span>
            <span className="mt-1 text-xs text-slate-500">remaining</span>
          </div>
        </div>

        {/* Urgency indicator — not color-only */}
        {isCritical && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/50 px-4 py-2"
          >
            <span aria-hidden="true" className="animate-pulse text-rose-400">⚠</span>
            <span className="text-sm font-semibold text-rose-300">Under 30 seconds — act now!</span>
          </div>
        )}
        {isLow && !isCritical && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-2"
          >
            <span aria-hidden="true" className="text-amber-400">⏳</span>
            <span className="text-sm font-medium text-amber-300">Less than 1 minute remaining</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {/* I'm Safe */}
        <button
          type="button"
          onClick={onSafe}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4
            text-base font-bold text-white shadow-lg shadow-emerald-900/40
            transition-all duration-200 hover:from-emerald-500 hover:to-emerald-400
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
            focus:ring-offset-slate-900"
        >
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true">✓</span> I'm Safe
          </span>
        </button>

        {/* SOS */}
        <button
          type="button"
          onClick={() => triggerAlert("sos")}
          aria-label="Send SOS alert immediately to all trusted contacts"
          className="group w-full rounded-2xl border-2 border-rose-600 bg-rose-950/50 px-6 py-4
            text-base font-bold text-rose-400 transition-all duration-200
            hover:border-rose-500 hover:bg-rose-900/60 hover:text-rose-300
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
            focus:ring-offset-slate-900"
        >
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true" className="text-xl">🆘</span>
            <span>SOS — Alert Now</span>
            <span className="rounded bg-rose-600/30 px-2 py-0.5 text-xs font-medium text-rose-300">Immediate</span>
          </span>
        </button>
      </div>

      {/* Contacts preview */}
      {contacts.length > 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Will be alerted</p>
          <ul className="space-y-1">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-sm text-slate-400">
                <span aria-hidden="true">{c.contactType === "email" ? "✉" : "📞"}</span>
                <span className="font-medium text-slate-300">{c.name}</span>
                <span className="text-slate-600">·</span>
                <span className="truncate">{c.contactInfo}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-700/30 bg-amber-950/30 p-4">
          <p className="text-sm text-amber-400">
            ⚠ No trusted contacts added. <a href="/contacts" className="underline hover:text-amber-300">Add contacts</a> so someone can be alerted.
          </p>
        </div>
      )}
    </div>
  );
}
