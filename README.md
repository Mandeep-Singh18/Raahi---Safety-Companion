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

### Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Vitest** for unit testing

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

Copy `.env.local.example` to `.env.local` before running. Phase 2 will add Gemini API key here.

---

*Built for safety. Designed with care.*
