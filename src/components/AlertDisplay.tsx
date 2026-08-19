"use client";

import Link from "next/link";
import type { Alert } from "@/types";
import { formatAlertMessage, getAlertReasonLabel, getAlertSummary } from "@/lib/alert";
import { AriaLiveRegion } from "./AriaLiveRegion";

interface AlertDisplayProps {
  alert: Alert;
  onNewSession: () => void;
}

export function AlertDisplay({ alert, onNewSession }: AlertDisplayProps) {
  const summary = getAlertSummary(alert);
  const fullMessage = formatAlertMessage(alert);
  const reasonLabel = getAlertReasonLabel(alert.reason);

  return (
    <div className="space-y-6">
      {/* Assertive ARIA announcement */}
      <AriaLiveRegion
        message={`Safety alert triggered. ${summary} ${reasonLabel}.`}
        politeness="assertive"
      />

      {/* Alert header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full
          border-4 border-rose-500 bg-rose-950/60">
          <span className="text-4xl" role="img" aria-label="Alert sent">🚨</span>
        </div>
        <h2 className="text-2xl font-black text-rose-400">Alert Triggered</h2>
        <p className="mt-1 text-sm text-slate-400">{reasonLabel}</p>
      </div>

      {/* Summary banner */}
      <div
        role="status"
        aria-label={summary}
        className="rounded-2xl border border-rose-500/30 bg-rose-950/40 px-5 py-4 text-center"
      >
        <p className="text-base font-semibold text-rose-300">{summary}</p>
        <p className="mt-1 text-xs text-slate-400">
          Triggered at {new Date(alert.triggeredAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Full alert details */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Alert details</p>
        <pre
          className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-300"
          aria-label="Full alert message"
        >
          {fullMessage}
        </pre>
      </div>

      {/* Contacts notified */}
      {alert.contacts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Contacts notified</p>
          <ul className="space-y-2">
            {alert.contacts.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-emerald-700/30
                  bg-emerald-950/30 px-4 py-3"
              >
                <span aria-hidden="true" className="text-emerald-400">✓</span>
                <div>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.contactInfo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onNewSession}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4
            text-base font-bold text-white shadow-lg shadow-violet-900/40
            transition-all duration-200 hover:from-violet-500 hover:to-violet-400
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400
            focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Start New Session
        </button>
        <Link
          href="/contacts"
          className="block w-full rounded-2xl border border-slate-700 px-6 py-3
            text-center text-sm font-medium text-slate-300 transition-colors
            hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2
            focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Manage Contacts
        </Link>
      </div>
    </div>
  );
}
