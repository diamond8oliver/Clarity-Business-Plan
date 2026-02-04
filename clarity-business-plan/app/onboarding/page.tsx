"use client";

import { useState } from "react";
import { products, type Product } from "../dummyData";

const ageRanges = ["50-60", "60-70", "70-80"] as const;
const goals = ["sleep", "calm", "relief", "focus"] as const;
const experienceLevels = ["naive", "light", "regular", "heavy"] as const;

export default function OnboardingPage() {
  const [ageRange, setAgeRange] = useState<(typeof ageRanges)[number] | "">("");
  const [primaryGoal, setPrimaryGoal] = useState<(typeof goals)[number] | "">("");
  const [experience, setExperience] = useState<
    (typeof experienceLevels)[number] | ""
  >("naive");
  const [result, setResult] = useState<{
    product: Product;
    explanation: string;
  } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ageRange || !primaryGoal || !experience) return;

    const product = chooseStarterProduct({ ageRange, primaryGoal, experience });

    const explanation = buildExplanation({ ageRange, primaryGoal, experience, product });
    setResult({ product, explanation });
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Onboarding: find a gentle starting capsule
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This flow uses dummy data to mimic how ClarityRx would suggest a
            starting product and dose for adults 50–75.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Age range</label>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAgeRange(r)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                      ageRange === r
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primary goal</label>
              <div className="flex flex-wrap gap-2">
                {goals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPrimaryGoal(g)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border capitalize transition ${
                      primaryGoal === g
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cannabis experience
              </label>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border capitalize transition ${
                      experience === lvl
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              disabled={!ageRange || !primaryGoal || !experience}
            >
              Get starter recommendation
            </button>
          </form>

          <div className="space-y-4">
            {!result ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Once you fill out the form, you&apos;ll see a suggested starting
                capsule and dose based on age range, goal, and experience.
              </p>
            ) : (
              <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500">
                  Suggested starter
                </p>
                <h2 className="text-lg font-semibold">{result.product.name}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {result.product.thcMgPerCapsule} mg THC · {" "}
                  <span className="capitalize">{result.product.intendedEffect}</span>
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {result.product.description}
                </p>
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
                  {result.explanation}
                </p>
                <p className="mt-2 text-[11px] text-zinc-500">
                  This is not medical advice. Real dosing decisions should be made
                  with a clinician who understands your medications and health
                  history.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function chooseStarterProduct(args: {
  ageRange: (typeof ageRanges)[number];
  primaryGoal: (typeof goals)[number];
  experience: (typeof experienceLevels)[number];
}): Product {
  const { ageRange, primaryGoal, experience } = args;

  if (primaryGoal === "sleep") {
    if (ageRange !== "50-60" && experience === "naive") {
      // older + naive -> lowest dose sleep capsule
      return products.find((p) => p.sku === "CRX-DR-2.5") ?? products[0];
    }
    // sleep but not fully naive -> standard sleep capsule
    return products.find((p) => p.sku === "CRX-DR-5") ?? products[1] ?? products[0];
  }

  if (primaryGoal === "calm") {
    return products.find((p) => p.sku === "CRX-CL-2.5") ?? products[2] ?? products[0];
  }

  if (primaryGoal === "focus") {
    return products.find((p) => p.sku === "CRX-FC-2.5") ?? products[3] ?? products[0];
  }

  // relief or other goals: bias toward gentle 5 mg for now
  return products.find((p) => p.sku === "CRX-RL-5") ?? products[1] ?? products[0];
}

function buildExplanation(args: {
  ageRange: string;
  primaryGoal: string;
  experience: string;
  product: Product;
}): string {
  const { ageRange, primaryGoal, experience, product } = args;

  const parts: string[] = [];
  parts.push(
    `You selected the ${ageRange} age range with a primary goal of ${primaryGoal}. ` +
      `You described your cannabis experience as ${experience}.`,
  );
  if (product.intendedEffect === "sleep") {
    parts.push(
      "We favor myrcene- and linalool-forward sleep capsules at lower THC doses, " +
        "especially for older or cannabis-naive adults.",
    );
  } else if (product.intendedEffect === "calm") {
    parts.push(
      "For daytime calm we bias toward lower THC with brighter terpenes like limonene, " +
        "to avoid heavy sedation.",
    );
  } else if (product.intendedEffect === "focus") {
    parts.push(
      "For focus we keep THC low and rely on limonene/pinene-forward blends that feel clearer.",
    );
  }
  parts.push(
    "This mock recommendation is intentionally conservative and for demo only — real dosing " +
      "should always be personalized with your clinician.",
  );

  return parts.join(" ");
}
