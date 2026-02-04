"use client";

import { useState } from "react";

const ageRanges = ["18-25", "26-35", "36-50", "51-65", "65+"] as const;
const experienceLevels = ["naive", "light", "regular", "heavy"] as const;

const usageTimes = [
  "Morning (before the day)",
  "Afternoon (breaks)",
  "Evening (after work)",
  "Night (before bed)",
  "Only on weekends",
] as const;

const goals = [
  "Sleep", // includes falling/staying asleep
  "Anxiety & calm",
  "Pain & physical comfort",
  "Focus & deep work",
  "Social ease",
  "Creativity & hobbies",
  "Athletic recovery",
] as const;

const healthFlags = [
  "Heart or blood pressure conditions",
  "History of anxiety / panic attacks",
  "History of depression / mood disorders",
  "Balance or fall risk",
  "Current prescription medications",
] as const;

const lifestyle = [
  "Caffeine most days",
  "Alcohol most weeks",
  "Regular exercise (3+ times/week)",
  "Shift work / irregular sleep",
] as const;

const formatPreferences = [
  "Capsules only",
  "Capsules + gummies",
  "Open to tinctures",
  "Prefer as few product types as possible",
] as const;

const toleranceLevels = [
  "I feel things easily / very sensitive",
  "Average sensitivity",
  "I usually need more than most people",
] as const;

const psychProfiles = [
  "Careful experimenter (slow, data-driven)",
  "Burned-out professional looking for better boundaries",
  "Retired and curious about aging well",
  "Creative who wants structure, not chaos",
] as const;

export default function SettingsPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [ageRange, setAgeRange] = useState<(typeof ageRanges)[number] | "">("");
  const [experience, setExperience] = useState<(typeof experienceLevels)[number] | "">(
    ""
  );

  // Step 2
  const [selectedUsageTimes, setSelectedUsageTimes] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 3
  const [selectedHealthFlags, setSelectedHealthFlags] = useState<string[]>([]);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);

  // Step 4
  const [tolerance, setTolerance] = useState<string>("");
  const [formatPref, setFormatPref] = useState<string>("");
  const [psychProfile, setPsychProfile] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const isStep1Valid = !!ageRange && !!experience;
  const isStep2Valid = selectedGoals.length > 0;
  const isStep3Valid = true; // optional; all flags are advisory
  const isStep4Valid = !!tolerance && !!formatPref;

  function toggleItem(value: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function handleNext() {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    if (step === 3 && !isStep3Valid) return;
    if (step === 4 && !isStep4Valid) return;
    setStep((prev) => Math.min(prev + 1, 4));
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings & preferences (demo survey)
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This 4-step flow mirrors how ClarityRx would learn about someone&apos;s
            goals, lifestyle, and tolerance before making any product or dosing
            suggestions. Nothing here is saved — it&apos;s purely an interactive demo.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <StepIndicator step={step} />

          {step === 1 && (
            <Step1
              ageRange={ageRange}
              experience={experience}
              setAgeRange={setAgeRange}
              setExperience={setExperience}
            />
          )}
          {step === 2 && (
            <Step2
              selectedUsageTimes={selectedUsageTimes}
              selectedGoals={selectedGoals}
              toggleUsage={(v) => toggleItem(v, selectedUsageTimes, setSelectedUsageTimes)}
              toggleGoal={(v) => toggleItem(v, selectedGoals, setSelectedGoals)}
            />
          )}
          {step === 3 && (
            <Step3
              selectedHealthFlags={selectedHealthFlags}
              selectedLifestyle={selectedLifestyle}
              toggleHealthFlag={(v) => toggleItem(v, selectedHealthFlags, setSelectedHealthFlags)}
              toggleLifestyle={(v) => toggleItem(v, selectedLifestyle, setSelectedLifestyle)}
            />
          )}
          {step === 4 && (
            <Step4
              tolerance={tolerance}
              formatPref={formatPref}
              psychProfile={psychProfile}
              notes={notes}
              setTolerance={setTolerance}
              setFormatPref={setFormatPref}
              setPsychProfile={setPsychProfile}
              setNotes={setNotes}
            />
          )}

          <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
            <div className="space-x-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border border-zinc-300 px-4 py-1.5 text-[11px] font-medium hover:border-emerald-500 dark:border-zinc-700"
                >
                  Back
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 4 && !isStep4Valid)
              }
              className="rounded-full bg-emerald-600 px-5 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-40"
            >
              {step === 4 ? "Finish (demo)" : "Next"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 text-[11px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          <p className="mb-1 font-semibold text-zinc-800 dark:text-zinc-100">
            How this would be used in the real product
          </p>
          <p>
            In production, ClarityRx would combine answers from this survey with
            your logged doses and outcomes to choose a capsule, dose band, and
            coaching language that fits your age, health context, and lifestyle.
            It&apos;s inspired by precision-medicine onboarding flows you see in
            modern telehealth platforms, but tuned for terpenes and THC.
          </p>
        </section>
      </main>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const labels = ["Basics", "When & why", "Health & lifestyle", "Tolerance & format"];
  return (
    <ol className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
      {labels.map((label, idx) => {
        const index = idx + 1;
        const active = step === index;
        const complete = step > index;
        return (
          <li key={label} className="flex items-center gap-1">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : complete
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "border-zinc-300 text-zinc-500 dark:border-zinc-700"
              }`}
            >
              {index}
            </span>
            <span className={active ? "text-emerald-600 dark:text-emerald-300" : ""}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Step1(props: {
  ageRange: string;
  experience: string;
  setAgeRange: (v: (typeof ageRanges)[number]) => void;
  setExperience: (v: (typeof experienceLevels)[number]) => void;
}) {
  const { ageRange, experience, setAgeRange, setExperience } = props;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Step 1 · Basics</h2>
        <p className="mt-1 text-xs text-zinc-500">
          We start with simple framing questions so we can calibrate how cautiously
          to interpret your results.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1">Age range</label>
          <div className="flex flex-wrap gap-2">
            {ageRanges.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAgeRange(r)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium border transition ${
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
          <label className="block text-xs font-medium mb-1">Cannabis experience</label>
          <div className="flex flex-wrap gap-2">
            {experienceLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setExperience(lvl)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium border capitalize transition ${
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
      </div>
    </div>
  );
}

function Step2(props: {
  selectedUsageTimes: string[];
  selectedGoals: string[];
  toggleUsage: (v: string) => void;
  toggleGoal: (v: string) => void;
}) {
  const { selectedUsageTimes, selectedGoals, toggleUsage, toggleGoal } = props;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Step 2 · When and why you&apos;d use THC</h2>
        <p className="mt-1 text-xs text-zinc-500">
          This helps us separate sleep support from daytime focus, social use, and
          recovery so recommendations don&apos;t bleed across contexts.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1">Typical times</label>
          <div className="flex flex-wrap gap-2">
            {usageTimes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleUsage(item)}
                className={`rounded-full px-3 py-1 text-[11px] border transition ${
                  selectedUsageTimes.includes(item)
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Primary goals</label>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                className={`rounded-full px-3 py-1 text-[11px] border transition ${
                  selectedGoals.includes(g)
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3(props: {
  selectedHealthFlags: string[];
  selectedLifestyle: string[];
  toggleHealthFlag: (v: string) => void;
  toggleLifestyle: (v: string) => void;
}) {
  const { selectedHealthFlags, selectedLifestyle, toggleHealthFlag, toggleLifestyle } = props;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Step 3 · Health & lifestyle context</h2>
        <p className="mt-1 text-xs text-zinc-500">
          These answers would never replace medical advice, but they help us stay
          conservative for people with higher-risk profiles.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1">Health flags (optional)</label>
          <div className="flex flex-wrap gap-2">
            {healthFlags.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleHealthFlag(item)}
                className={`rounded-full px-3 py-1 text-[11px] border text-left transition ${
                  selectedHealthFlags.includes(item)
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Lifestyle (optional)</label>
          <div className="flex flex-wrap gap-2">
            {lifestyle.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleLifestyle(item)}
                className={`rounded-full px-3 py-1 text-[11px] border text-left transition ${
                  selectedLifestyle.includes(item)
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4(props: {
  tolerance: string;
  formatPref: string;
  psychProfile: string;
  notes: string;
  setTolerance: (v: string) => void;
  setFormatPref: (v: string) => void;
  setPsychProfile: (v: string) => void;
  setNotes: (v: string) => void;
}) {
  const { tolerance, formatPref, psychProfile, notes, setTolerance, setFormatPref, setPsychProfile, setNotes } = props;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Step 4 · Tolerance & format preferences</h2>
        <p className="mt-1 text-xs text-zinc-500">
          This step shapes the initial starting point: capsule vs other formats,
          how bold to be with dose changes, and how we talk to you.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1">How sensitive do you feel?</label>
          <div className="flex flex-col gap-2">
            {toleranceLevels.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTolerance(t)}
                className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  tolerance === t
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Preferred formats</label>
          <div className="flex flex-col gap-2">
            {formatPreferences.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormatPref(f)}
                className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  formatPref === f
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1">You&apos;re most like…</label>
          <div className="flex flex-col gap-2">
            {psychProfiles.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPsychProfile(p)}
                className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  psychProfile === p
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Anything else we should keep in mind?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="e.g. I&apos;m curious but nervous about feeling out of control; I also take a beta blocker."
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-[11px] outline-none focus:border-emerald-500 dark:border-zinc-700"
          />
        </div>
      </div>
    </div>
  );
}
