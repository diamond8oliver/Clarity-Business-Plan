"use client";

import { useState } from "react";
import { products } from "../dummyData";

const QUICK_TAGS = [
  "helped sleep",
  "felt groggy",
  "perfect dose",
  "too mild",
  "no effect",
  "great for reading",
] as const;

export default function LogDosePage() {
  const [productSku, setProductSku] = useState(products[0]?.sku ?? "");
  const [rating, setRating] = useState(4);
  const [thumbs, setThumbs] = useState<"up" | "down" | null>("up");
  const [selectedTags, setSelectedTags] = useState<string[]>(["helped sleep"]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const product = products.find((p) => p.sku === productSku) ?? products[0];

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Log a dose with quick rating & tags
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This page simulates the post-dose check-in: a quick star rating,
            thumbs up/down, and optional tags that feed into personalization.
          </p>
        </header>

        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  value={productSku}
                  onChange={(e) => setProductSku(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
                >
                  {products.map((p) => (
                    <option key={p.sku} value={p.sku} className="bg-zinc-900">
                      {p.name} · {p.thcMgPerCapsule} mg ({p.intendedEffect})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quick rating</label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 text-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          setThumbs(star >= 4 ? "up" : star <= 2 ? "down" : null);
                        }}
                        className="text-amber-400"
                      >
                        {star <= rating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">{rating}/5</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="block text-sm font-medium mb-1">Thumbs</span>
                <div className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 p-0.5 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => setThumbs("up")}
                    className={`px-3 py-1 rounded-full ${
                      thumbs === "up"
                        ? "bg-emerald-500 text-white"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    👍
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbs("down")}
                    className={`px-3 py-1 rounded-full ${
                      thumbs === "down"
                        ? "bg-rose-500 text-white"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    👎
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <span className="block text-sm font-medium mb-1">Quick tags</span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs border transition ${
                        selectedTags.includes(tag)
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Optional notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Slept through the night but woke a bit groggy at 7am."
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Save dose (demo)
            </button>
          </form>

          {submitted && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
              <p className="font-medium mb-1">This is a demo submission only.</p>
              <p>
                In a real app this entry would be saved to your dose history and
                used by the personalization engine. For now it just shows how the
                quick rating UX would feel.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
