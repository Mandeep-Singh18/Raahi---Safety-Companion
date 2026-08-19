import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Raahi — Personal Safety Companion",
  description:
    "Start a safety session and let trusted contacts know you arrived safely. Your personal safety net.",
};

const steps = [
  {
    step: "1",
    icon: "👤",
    title: "Add trusted contacts",
    desc: "Save people who should be alerted if you don't check in.",
  },
  {
    step: "2",
    icon: "🚶",
    title: "Start a session",
    desc: "Choose your activity and set a countdown timer.",
  },
  {
    step: "3",
    icon: "✓",
    title: "Check in when safe",
    desc: "Tap \"I'm Safe\" to end the session. Miss it and your contacts are notified.",
  },
];

const features = [
  {
    icon: "⏱️",
    title: "Timed Check-ins",
    desc: "Set a custom countdown. If you don't respond in time, your contacts are automatically alerted.",
  },
  {
    icon: "📍",
    title: "Location Sharing",
    desc: "Optionally share your location with trusted contacts so they know exactly where to find you.",
  },
  {
    icon: "🆘",
    title: "One-tap SOS",
    desc: "In an emergency, hit SOS to instantly notify all your trusted contacts without delay.",
  },
  {
    icon: "🚶‍♀️",
    title: "Activity Modes",
    desc: "Choose from Walking, Cab Ride, or Meeting — context-aware sessions for every situation.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your data stays local. No cloud sync, no tracking — just a simple safety net.",
  },
  {
    icon: "♿",
    title: "Accessible Design",
    desc: "Built with screen readers and keyboard navigation in mind — safety for everyone.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* ── Hero ── */}
      <section
        aria-labelledby="hero-heading"
        className="grid items-center gap-12 pt-6 lg:grid-cols-2 lg:gap-16 lg:pt-12"
      >
        {/* Left: text */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-700/40 bg-violet-950/60 px-3 py-1 text-xs font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Phase 1 · Safety Net Hackathon
            </span>
          </div>
          <div>
            <h1
              id="hero-heading"
              className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Your personal{" "}
              <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                safety net
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-400 sm:text-xl lg:max-w-xl">
              Start a timed safety session. If you don't check in, your trusted contacts are
              alerted automatically — no manual texting needed.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/session"
              id="start-session-cta"
              className="flex items-center justify-center gap-2 rounded-2xl
                bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4
                text-base font-bold text-white shadow-lg shadow-violet-900/40
                transition-all duration-200 hover:from-violet-500 hover:to-violet-400
                hover:shadow-violet-800/50 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
                focus:ring-offset-slate-950"
            >
              <span aria-hidden="true">🛡️</span> Start a Safety Session
            </Link>
            <Link
              href="/contacts"
              id="manage-contacts-cta"
              className="flex items-center justify-center gap-2 rounded-2xl
                border border-slate-700 bg-slate-900/60 px-8 py-4
                text-base font-medium text-slate-300 transition-all duration-200
                hover:border-slate-500 hover:text-white hover:bg-slate-800/60
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                focus:ring-offset-slate-950"
            >
              <span aria-hidden="true">👥</span> Manage Contacts
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            {["No sign-up needed", "Works offline", "Open source"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-slate-500">
                <span className="text-emerald-500" aria-hidden="true">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: preview card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-4 rounded-3xl bg-violet-600/10 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl
                bg-gradient-to-br from-violet-600 to-violet-800 shadow-xl shadow-violet-950/50">
                <span className="text-5xl" role="img" aria-label="Shield">🛡️</span>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Active Session</p>
                <p className="text-4xl font-black tabular-nums text-white">14:32</p>
                <p className="text-sm text-slate-400">Walking · Location captured</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-950/60 px-4 py-3 text-center">
                  <p className="text-xs text-emerald-400 font-medium">I'm Safe ✓</p>
                </div>
                <div className="rounded-xl border border-rose-600/40 bg-rose-950/40 px-4 py-3 text-center">
                  <p className="text-xs text-rose-400 font-medium">🆘 SOS Alert</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <p className="text-xs text-slate-500">2 contacts watching</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section aria-labelledby="how-heading" className="space-y-8">
        <div className="text-center">
          <h2 id="how-heading" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            How it works
          </h2>
          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">Three simple steps</p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3" aria-label="Steps to use Raahi">
          {steps.map(({ step, icon, title, desc }) => (
            <li
              key={step}
              className="relative flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60
                px-6 py-6 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                  bg-violet-900/60 text-lg font-black text-violet-400">
                  <span aria-hidden="true">{step}</span>
                </div>
                <span className="text-2xl" aria-hidden="true">{icon}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Features grid ── */}
      <section aria-labelledby="features-heading" className="space-y-8">
        <div className="text-center">
          <h2 id="features-heading" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Features
          </h2>
          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">Everything you need to stay safe</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40
                px-6 py-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/70"
            >
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section aria-label="Get started">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/80 to-slate-900/80
          border border-violet-800/40 px-8 py-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-violet-800/10" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Ready?</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Start your first safety session</h2>
            <p className="mt-3 text-slate-400 sm:text-lg">Takes less than 30 seconds to set up.</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/session"
                className="flex items-center gap-2 rounded-2xl bg-violet-600 px-8 py-4
                  text-base font-bold text-white shadow-lg shadow-violet-900/50
                  transition-all duration-200 hover:bg-violet-500 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
                  focus:ring-offset-slate-950"
              >
                <span aria-hidden="true">🛡️</span> Start Session Now
              </Link>
              <Link
                href="/contacts"
                className="flex items-center gap-2 rounded-2xl border border-slate-600 px-8 py-4
                  text-base font-medium text-slate-300 transition-all duration-200
                  hover:border-slate-400 hover:text-white
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                  focus:ring-offset-slate-950"
              >
                <span aria-hidden="true">👥</span> Add Contacts First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety note */}
      <aside
        className="rounded-2xl border border-amber-700/30 bg-amber-950/30 px-5 py-4"
        aria-label="Important note"
      >
        <p className="flex items-start gap-2 text-sm text-amber-300">
          <span aria-hidden="true" className="mt-0.5 shrink-0">⚠</span>
          <span>
            <strong>Phase 1:</strong> This app simulates alert sending — no real SMS or email is
            dispatched yet. Add AI-powered escalation in Phase 2.
          </span>
        </p>
      </aside>
    </div>
  );
}

