"use client";

import { useState, useId } from "react";
import type { Contact } from "@/types";

interface ContactFormProps {
  onContactAdded: (contact: Contact) => void;
}

interface FormErrors {
  name?: string;
  contactInfo?: string;
  general?: string;
}

export function ContactForm({ onContactAdded }: ContactFormProps) {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const nameId = useId();
  const contactInfoId = useId();
  const nameErrorId = useId();
  const contactInfoErrorId = useId();
  const successId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), contactInfo: contactInfo.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const apiErrors: FormErrors = {};
        if (Array.isArray(data.details)) {
          data.details.forEach((err: string) => {
            if (err.toLowerCase().includes("name")) apiErrors.name = err;
            else apiErrors.contactInfo = err;
          });
        } else {
          apiErrors.general = data.error ?? "Something went wrong. Please try again.";
        }
        setErrors(apiErrors);
        return;
      }

      onContactAdded(data as Contact);
      setName("");
      setContactInfo("");
      setSuccessMessage(`${data.name} added successfully!`);
    } catch {
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add trusted contact"
      className="space-y-5"
    >
      <fieldset className="space-y-5">
        <legend className="text-lg font-semibold text-white">Add a Trusted Contact</legend>

        {/* Name field */}
        <div className="space-y-1.5">
          <label htmlFor={nameId} className="block text-sm font-medium text-slate-300">
            Full Name <span aria-hidden="true" className="text-rose-400">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? nameErrorId : undefined}
            aria-invalid={!!errors.name}
            className={`w-full rounded-xl border bg-slate-800 px-4 py-3 text-white placeholder-slate-500
              transition-colors focus:outline-none focus:ring-2
              ${
                errors.name
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-600 focus:ring-violet-500 focus:border-violet-500"
              }`}
          />
          {errors.name && (
            <p id={nameErrorId} role="alert" className="flex items-center gap-1.5 text-sm text-rose-400">
              <span aria-hidden="true">⚠</span> {errors.name}
            </p>
          )}
        </div>

        {/* Contact Info field */}
        <div className="space-y-1.5">
          <label htmlFor={contactInfoId} className="block text-sm font-medium text-slate-300">
            Phone or Email <span aria-hidden="true" className="text-rose-400">*</span>
          </label>
          <input
            id={contactInfoId}
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="e.g. +91 98765 43210 or priya@example.com"
            autoComplete="tel"
            aria-required="true"
            aria-describedby={errors.contactInfo ? contactInfoErrorId : undefined}
            aria-invalid={!!errors.contactInfo}
            className={`w-full rounded-xl border bg-slate-800 px-4 py-3 text-white placeholder-slate-500
              transition-colors focus:outline-none focus:ring-2
              ${
                errors.contactInfo
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-600 focus:ring-violet-500 focus:border-violet-500"
              }`}
          />
          {errors.contactInfo && (
            <p id={contactInfoErrorId} role="alert" className="flex items-center gap-1.5 text-sm text-rose-400">
              <span aria-hidden="true">⚠</span> {errors.contactInfo}
            </p>
          )}
        </div>
      </fieldset>

      {/* General error */}
      {errors.general && (
        <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-950/50 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-rose-300">
            <span aria-hidden="true">⚠</span> {errors.general}
          </p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div
          id={successId}
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-500/30 bg-emerald-950/50 px-4 py-3"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-300">
            <span aria-hidden="true">✓</span> {successMessage}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white
          transition-all duration-200 hover:bg-violet-500 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900
          disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Adding...
          </span>
        ) : (
          "Add Contact"
        )}
      </button>
    </form>
  );
}
