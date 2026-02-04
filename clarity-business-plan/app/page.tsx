import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            ClarityRx
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Personalized THC microdosing for adults 50–75.
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            This interactive demo lets you click through the core ClarityRx app flows:
            onboarding, dosing logs, your dose diary, and a simple assistant chat —
            all powered by realistic dummy data.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/onboarding"
            className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-1 text-base font-semibold">1. Onboarding & starter dose</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Answer a few questions and see a recommended starting capsule and dose
              for a California adult 50–75.
            </p>
          </Link>

          <Link
            href="/log-dose"
            className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-1 text-base font-semibold">2. Log a dose & quick rating</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Record a dose with thumbs up/down, 1–5 stars, and quick tags like
              “helped sleep” or “felt groggy”.
            </p>
          </Link>

          <Link
            href="/history"
            className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-1 text-base font-semibold">3. Dose diary & stats</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Browse a Letterboxd-style history of every dose with filters and
              personal stats like favorite products and weekend patterns.
            </p>
          </Link>

          <Link
            href="/assistant"
            className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-1 text-base font-semibold">4. Assistant chat (mock)</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Ask example questions like “Why am I groggy?” and see safe,
              educational responses using mock data.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}
