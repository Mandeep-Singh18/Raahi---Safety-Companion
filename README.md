# Raahi

> **AI-powered personal safety web app — Hackathon Project (Theme: Safety Net)**

## Phase 1: Safety Session + Check-in Loop

### Features
- **Trusted Contacts** — Add contacts with phone or email (server-validated)
- **Safety Sessions** — Start a timed session in Walking / Cab / Meeting mode
- **Live Location Capture** — Uses `navigator.geolocation` with graceful fallback
- **Countdown Timer** — Visible MM:SS countdown with ARIA live announcements
- **I'm Safe** — One-tap check-in to close the session cleanly
- **Automatic Alert** — Triggers when timer expires with no check-in
- **Manual SOS** — Always-visible button that bypasses the timer
- **Email Alerts** — Sends alerts to trusted contacts' email addresses when Gmail is configured
- **SMS and WhatsApp Alerts** — Planned for a future Twilio integration

### Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Vitest** for unit testing

---

## App Flow

1. Add trusted contacts using their name and email address.
2. Start a safety session by choosing an activity, duration, and optional location.
3. Keep the session active while the countdown runs.
4. Tap **I'm Safe** before the timer expires to end the session without an alert.
5. Tap **SOS** or allow the timer to expire to trigger an alert.
6. The alert is shown in the app and emailed to configured trusted contacts.
7. SMS and WhatsApp delivery through Twilio will be added in a future update.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── app/               # Next.js App Router pages + API routes
├── components/        # React UI components
├── lib/               # Pure logic (contacts, timer, alert, session)
├── types/             # TypeScript interfaces
└── __tests__/         # Vitest unit tests
data/
└── contacts.json      # Simple flat-file store (gitignored)
```

## Environment Setup

Create `.env.local` with the providers you want to use. Email alerts require a Gmail App Password:

```env
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

The email alert is sent to trusted contacts whose contact type is `email`. SMS and WhatsApp
delivery through Twilio will be added in a future update. Without Gmail credentials, the app
only changes the local screen to “Alert Triggered” and does not deliver an external notification.

---

*Built for safety. Designed with care.*
