import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Raahi — Personal Safety Companion",
    template: "%s | Raahi",
  },
  description:
    "Raahi keeps you safe with timed check-ins and instant alerts to your trusted contacts when you don't respond.",
  keywords: ["personal safety", "check-in", "safety app", "trusted contacts", "SOS"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 font-sans antialiased">
        {/* Skip to main content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
            focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold
            focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          Skip to main content
        </a>

        {/* Global navigation */}
        <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-1 focus:outline-none focus:ring-2
                focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="Raahi home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 text-base shadow-lg shadow-violet-950/50" aria-hidden="true">🛡️</span>
              <span className="text-xl font-black tracking-tight text-white">Raahi</span>
              <span className="hidden rounded-full bg-violet-900/60 px-2 py-0.5 text-xs font-medium text-violet-300 sm:inline">
                Safety Companion
              </span>
            </Link>

            <ul className="flex items-center gap-1" role="list">
              <li className="hidden sm:block">
                <Link
                  href="/"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors
                    hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2
                    focus:ring-violet-400 focus:ring-offset-1 focus:ring-offset-slate-950"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors
                    hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2
                    focus:ring-violet-400 focus:ring-offset-1 focus:ring-offset-slate-950"
                >
                  Contacts
                </Link>
              </li>
              <li>
                <Link
                  href="/session"
                  className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white
                    transition-all duration-200 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-900/30
                    focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1
                    focus:ring-offset-slate-950"
                >
                  <span className="hidden sm:inline">Start Session</span>
                  <span className="sm:hidden">Session</span>
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Page content */}
        <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-800/60 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">🛡️</span>
                <span className="text-sm font-semibold text-slate-400">Raahi</span>
              </div>
              <p className="text-xs text-slate-600">
                Built for the Safety Net Hackathon · Phase 1 · Personal Safety Companion
              </p>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Home</Link>
                <Link href="/contacts" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Contacts</Link>
                <Link href="/session" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Session</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
