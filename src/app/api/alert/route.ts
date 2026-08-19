/**
 * POST /api/alert
 * Sends real email alerts to all trusted contacts when a safety session expires
 * or the user triggers an SOS. Uses Nodemailer + Gmail App Password (free).
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import twilio from "twilio";
import type { Alert } from "@/types";

// ── Gmail transporter (configured via env vars) ──────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password, NOT your main password
    },
  });
}

function createSmsClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

function normalizePhoneNumber(value: string): string {
  return value.trim().replace(/[\s().-]/g, "");
}

// ── Mode labels ───────────────────────────────────────────────────────────────
const MODE_LABELS: Record<string, string> = {
  walking: "🚶 Walking home",
  cab: "🚕 Cab ride",
  meeting: "🤝 Meeting someone",
};

const REASON_LABELS: Record<string, string> = {
  expired: "⏰ Check-in timer expired — no response",
  sos: "🆘 Manual SOS triggered",
};

// ── Email template ────────────────────────────────────────────────────────────
function buildEmailHtml(alert: Alert, recipientName: string): string {
  const triggeredTime = new Date(alert.triggeredAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const locationHtml = alert.location
    ? `<a href="https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}" 
         style="color:#7c3aed;text-decoration:none;font-weight:600;">
         📍 View on Google Maps (${alert.location.latitude.toFixed(5)}, ${alert.location.longitude.toFixed(5)})
       </a>`
    : `<span style="color:#f59e0b;">⚠ Location not available</span>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#dc2626);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🚨</div>
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">
        RAAHI SAFETY ALERT
      </h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">
        Immediate attention required
      </p>
    </div>

    <!-- Body -->
    <div style="background:#1e293b;border-radius:0 0 16px 16px;padding:32px;">
      <p style="color:#cbd5e1;font-size:16px;margin:0 0 24px;">
        Hi <strong style="color:#fff;">${recipientName}</strong>,<br><br>
        You're receiving this because you were listed as a trusted contact in Raahi.
        Someone may need your help right now.
      </p>

      <!-- Alert details -->
      <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #334155;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:140px;">Triggered at</td>
            <td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${triggeredTime}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reason</td>
            <td style="padding:8px 0;color:#fca5a5;font-size:14px;font-weight:600;">${REASON_LABELS[alert.reason] ?? alert.reason}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Activity</td>
            <td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${MODE_LABELS[alert.sessionMode] ?? alert.sessionMode}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Last location</td>
            <td style="padding:8px 0;font-size:14px;">${locationHtml}</td>
          </tr>
        </table>
      </div>

      <!-- Action prompt -->
      <div style="background:#7c3aed22;border:1px solid #7c3aed55;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#c4b5fd;margin:0;font-size:14px;line-height:1.6;">
          <strong style="color:#a78bfa;">What to do:</strong> Try calling or messaging this person immediately.
          If you cannot reach them within a few minutes, consider contacting emergency services.
        </p>
      </div>

      <p style="color:#475569;font-size:12px;margin:0;text-align:center;line-height:1.6;">
        This alert was sent by <strong style="color:#7c3aed;">Raahi</strong> — Personal Safety Companion<br>
        If this was a false alarm, the person using Raahi will notify you shortly.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText(alert: Alert, recipientName: string): string {
  const triggeredTime = new Date(alert.triggeredAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  const locationStr = alert.location
    ? `https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`
    : "Location not available";

  return [
    "🚨 RAAHI SAFETY ALERT",
    `Hi ${recipientName},`,
    `Someone listed you as a trusted contact in Raahi and may need your help.`,
    `Triggered at: ${triggeredTime}`,
    `Reason: ${REASON_LABELS[alert.reason] ?? alert.reason}`,
    `Activity: ${MODE_LABELS[alert.sessionMode] ?? alert.sessionMode}`,
    `Last location: ${locationStr}`,
    `Please try contacting this person immediately. If unreachable, consider calling emergency services.`,
    `— Raahi Personal Safety Companion`,
  ].join("\n\n");
}

function buildSmsText(alert: Alert): string {
  const location = alert.location
    ? `https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`
    : "Location unavailable";
  const reason = REASON_LABELS[alert.reason] ?? alert.reason;
  return [
    "RAAHI SAFETY ALERT",
    reason,
    `Activity: ${MODE_LABELS[alert.sessionMode] ?? alert.sessionMode}`,
    `Location: ${location}`,
    "Please call or message this person immediately.",
  ].join("\n");
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let alert: Alert;
  try {
    alert = (await req.json()) as Alert;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const emailContacts = alert.contacts.filter(
    (c) => c.contactType === "email" && c.contactInfo.includes("@")
  );
  const phoneContacts = alert.contacts.filter((c) => c.contactType === "phone");
  const emailConfigured = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  const smsClient = createSmsClient();

  const results: Array<{ contact: string; success: boolean; error?: string }> = [];

  if (emailConfigured) {
    const transporter = createTransporter();
    for (const contact of emailContacts) {
      try {
        await transporter.sendMail({
          from: `"Raahi Safety Alert" <${process.env.GMAIL_USER}>`,
          to: contact.contactInfo,
          subject: `🚨 Safety Alert for ${contact.name} — Raahi`,
          text: buildEmailText(alert, contact.name),
          html: buildEmailHtml(alert, contact.name),
        });
        results.push({ contact: contact.contactInfo, success: true });
        console.log(`[alert] Email sent to ${contact.name} <${contact.contactInfo}>`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        results.push({ contact: contact.contactInfo, success: false, error: message });
        console.error(`[alert] Failed to send email to ${contact.contactInfo}:`, message);
      }
    }
  }

  if (smsClient && process.env.TWILIO_PHONE_NUMBER) {
    for (const contact of phoneContacts) {
      try {
        await smsClient.messages.create({
          body: buildSmsText(alert),
          from: process.env.TWILIO_PHONE_NUMBER,
          to: normalizePhoneNumber(contact.contactInfo),
        });
        results.push({ contact: contact.contactInfo, success: true });
        console.log(`[alert] SMS sent to ${contact.name} <${contact.contactInfo}>`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        results.push({ contact: contact.contactInfo, success: false, error: message });
        console.error(`[alert] Failed to send SMS to ${contact.contactInfo}:`, message);
      }
    }
  }

  const sent = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const configuredContacts = (emailConfigured ? emailContacts.length : 0)
    + (smsClient && process.env.TWILIO_PHONE_NUMBER ? phoneContacts.length : 0);

  return NextResponse.json({
    ok: sent > 0 || configuredContacts === 0,
    sent,
    failed,
    skipped: alert.contacts.length - configuredContacts,
    results,
    message: configuredContacts === 0
      ? "No alert delivery provider is configured for these contacts."
      : undefined,
  });
}
