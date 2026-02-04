"use client";

import { useMemo, useState } from "react";
import { dosingHistory, products } from "../dummyData";

export default function HistoryPage() {
  const [productFilter, setProductFilter] = useState<string>("all");
  const [goalFilter, setGoalFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return dosingHistory.filter((entry) => {
      if (productFilter !== "all" && entry.productSku !== productFilter) return false;
      if (goalFilter !== "all" && entry.desiredOutcome !== goalFilter) return false;
      return true;
    });
  }, [productFilter, goalFilter]);

  const stats = useMemo(() => buildStats(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dose diary & personal stats (demo)
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This page shows a Letterboxd-style view of your recent doses using
            static demo data: cards per dose plus simple personal insights.
          </p>
        </header>

        <section className="flex flex-wrap gap-4 items-center rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Product
            </span>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="rounded-full border border-zinc-300 bg-transparent px-3 py-1 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700"
            >
              <option value="all">All products</option>
              {products.map((p) => (
                <option key={p.sku} value={p.sku} className="bg-zinc-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Goal
            </span>
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="rounded-full border border-zinc-300 bg-transparent px-3 py-1 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700"
            >
              <option value="all">All goals</option>
              <option value="sleep">Sleep</option>
              <option value="calm">Calm</option>
              <option value="relief">Relief</option>
              <option value="focus">Focus</option>
            </select>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[minmax(0,2.5fr)_minmax(0,1.5fr)]">
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Recent doses
              </p>
              <p className="text-xs text-zinc-500">
                Showing {filtered.length} of {dosingHistory.length}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((entry) => (
                <DoseCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Personal stats
            </p>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  Total doses:
                </span>{" "}
                {stats.totalDoses}
              </li>
              <li>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  Favorite products:
                </span>{" "}
                {stats.favoriteProducts.length > 0
                  ? stats.favoriteProducts.join(", ")
                  : "Not enough data yet"}
              </li>
              <li>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  Weekend vs weekday rating:
                </span>{" "}
                {stats.weekendAvg.toFixed(2)} vs {stats.weekdayAvg.toFixed(2)}
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

function DoseCard({ entry }: { entry: (typeof dosingHistory)[number] }) {
  const stars = "★".repeat(entry.quickRating) + "☆".repeat(5 - entry.quickRating);
  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {entry.date}
          </p>
          <h3 className="mt-1 text-sm font-semibold leading-tight">
            {entry.productName}
          </h3>
          <p className="text-[11px] capitalize text-zinc-500">
            {entry.desiredOutcome} · {entry.timeOfDay}
          </p>
        </div>
        <div className="text-right text-amber-400 text-sm leading-none">
          <span>{stars}</span>
          {entry.thumbs && (
            <div className="mt-1 text-base">{entry.thumbs === "up" ? "👍" : "👎"}</div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {tag}
          </span>
        ))}
      </div>
      {entry.notes && (
        <p className="mt-2 line-clamp-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          {entry.notes}
        </p>
      )}
    </article>
  );
}

function buildStats(entries: typeof dosingHistory) {
  const totalDoses = entries.length;
  if (totalDoses === 0) {
    return {
      totalDoses: 0,
      favoriteProducts: [] as string[],
      weekendAvg: 0,
      weekdayAvg: 0,
    };
  }

  const ratingByProduct = new Map<string, { sum: number; count: number }>();
  const weekendRatings: number[] = [];
  const weekdayRatings: number[] = [];

  for (const e of entries) {
    const bucket = ratingByProduct.get(e.productName) ?? { sum: 0, count: 0 };
    bucket.sum += e.quickRating;
    bucket.count += 1;
    ratingByProduct.set(e.productName, bucket);

    const date = new Date(e.date + "T00:00:00");
    const weekday = date.getDay(); // 0 Sunday - 6 Saturday
    if (weekday === 0 || weekday === 6) weekendRatings.push(e.quickRating);
    else weekdayRatings.push(e.quickRating);
  }

  const avgByProduct: [string, number][] = Array.from(ratingByProduct.entries()).map(
    ([name, { sum, count }]) => [name, sum / count],
  );

  avgByProduct.sort((a, b) => b[1] - a[1]);

  const favoriteProducts = avgByProduct
    .filter(([_, avg]) => avg >= 4)
    .map(([name]) => name);

  const weekendAvg =
    weekendRatings.length > 0
      ? weekendRatings.reduce((a, b) => a + b, 0) / weekendRatings.length
      : 0;
  const weekdayAvg =
    weekdayRatings.length > 0
      ? weekdayRatings.reduce((a, b) => a + b, 0) / weekdayRatings.length
      : 0;

  return {
    totalDoses,
    favoriteProducts,
    weekendAvg,
    weekdayAvg,
  };
}
