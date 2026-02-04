import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClarityRx – Personalized THC Microdosing",
  description:
    "ClarityRx helps adults 50–75 experiment with gentle THC microdoses and track outcomes with a private, data-driven app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-zinc-200 bg-white/70 px-6 py-4 text-sm backdrop-blur dark:border-zinc-800 dark:bg-black/60">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                  ClarityRx
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Gentle THC, real outcomes.
                </span>
              </div>
              <nav className="hidden gap-4 text-xs text-zinc-600 dark:text-zinc-300 sm:flex">
                <a href="/" className="hover:text-emerald-500">
                  Demo flows
                </a>
                <a href="/history" className="hover:text-emerald-500">
                  Diary
                </a>
                <a href="/assistant" className="hover:text-emerald-500">
                  Assistant
                </a>
                <a href="/settings" className="hover:text-emerald-500">
                  Settings
                </a>
              </nav>
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <footer className="border-t border-zinc-200 bg-white/70 px-6 py-4 text-[11px] text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <span>© ClarityRx (demo)</span>
              <span className="hidden sm:inline">
                Designed for adults 50–75 exploring cannabis for wellness.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
