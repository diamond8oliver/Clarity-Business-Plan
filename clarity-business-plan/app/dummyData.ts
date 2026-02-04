export type Product = {
  sku: string;
  name: string;
  thcMgPerCapsule: number;
  intendedEffect: "sleep" | "calm" | "relief" | "focus";
  persona: string;
  description: string;
};

export type DosingHistoryEntry = {
  id: number;
  date: string; // ISO date
  productSku: string;
  productName: string;
  desiredOutcome: Product["intendedEffect"];
  quickRating: number; // 1-5
  thumbs: "up" | "down" | null;
  tags: string[];
  notes?: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
};

export const products: Product[] = [
  {
    sku: "CRX-DR-2.5",
    name: "Deep Rest Micro",
    thcMgPerCapsule: 2.5,
    intendedEffect: "sleep",
    persona: "sensitive_sleeper_first_time",
    description:
      "Low-dose 2.5 mg capsule with myrcene and linalool for sensitive or first-time users easing into sleep microdosing.",
  },
  {
    sku: "CRX-DR-5",
    name: "Deep Rest",
    thcMgPerCapsule: 5,
    intendedEffect: "sleep",
    persona: "cautious_sleeper_evening_routine",
    description:
      "Gentle 5 mg THC capsule with sedating terpenes for people building a predictable nighttime routine.",
  },
  {
    sku: "CRX-DR-10",
    name: "Deep Rest Plus",
    thcMgPerCapsule: 10,
    intendedEffect: "sleep",
    persona: "experienced_sleeper_high_tolerance",
    description:
      "10 mg sleep capsule for experienced users who already know they tolerate higher doses well.",
  },
  {
    sku: "CRX-CL-2.5",
    name: "Calm Clarity",
    thcMgPerCapsule: 2.5,
    intendedEffect: "calm",
    persona: "daytime_anxiety_soft_landing",
    description:
      "Daytime microdose for calm without heavy sedation, with brighter limonene-forward terpenes.",
  },
  {
    sku: "CRX-FC-2.5",
    name: "Focus Crisp",
    thcMgPerCapsule: 2.5,
    intendedEffect: "focus",
    persona: "knowledge_worker_deep_work",
    description:
      "Light daytime focus capsule with a bright, pinene-forward terpene profile for reading, planning, and deep work.",
  },
  {
    sku: "CRX-RL-5",
    name: "Gentle Relief",
    thcMgPerCapsule: 5,
    intendedEffect: "relief",
    persona: "joint_pain_walks_and_hobbies",
    description:
      "5 mg capsule aimed at joint and muscle discomfort, with beta-caryophyllene and myrcene for a warm, easing effect.",
  },
];

// Simple static history to power the Letterboxd-style grid.
export const dosingHistory: DosingHistoryEntry[] = [
  {
    id: 40,
    date: "2026-02-02",
    productSku: "CRX-DR-5",
    productName: "Deep Rest",
    desiredOutcome: "sleep",
    quickRating: 5,
    thumbs: "up",
    tags: ["helped sleep", "perfect dose"],
    notes: "Fell asleep quickly and woke up rested.",
    timeOfDay: "night",
  },
  {
    id: 39,
    date: "2026-02-01",
    productSku: "CRX-DR-5",
    productName: "Deep Rest",
    desiredOutcome: "sleep",
    quickRating: 4,
    thumbs: "up",
    tags: ["helped sleep", "felt groggy"],
    notes: "Slept well but felt a bit slow until 9am.",
    timeOfDay: "night",
  },
  {
    id: 38,
    date: "2026-01-31",
    productSku: "CRX-RL-5",
    productName: "Gentle Relief",
    desiredOutcome: "relief",
    quickRating: 5,
    thumbs: "up",
    tags: ["eased joint pain"],
    notes: "Knee pain was noticeably lower on my morning walk.",
    timeOfDay: "morning",
  },
  {
    id: 37,
    date: "2026-01-30",
    productSku: "CRX-DR-2.5",
    productName: "Deep Rest Micro",
    desiredOutcome: "sleep",
    quickRating: 4,
    thumbs: "up",
    tags: ["helped sleep"],
    notes: "Felt gentler than the 5 mg capsule but still helped me fall asleep.",
    timeOfDay: "night",
  },
  {
    id: 36,
    date: "2026-01-29",
    productSku: "CRX-FC-2.5",
    productName: "Focus Crisp",
    desiredOutcome: "focus",
    quickRating: 4,
    thumbs: "up",
    tags: ["great for reading"],
    notes: "Nice for a quiet morning of email and reading.",
    timeOfDay: "morning",
  },
  {
    id: 35,
    date: "2026-01-28",
    productSku: "CRX-CL-2.5",
    productName: "Calm Clarity",
    desiredOutcome: "calm",
    quickRating: 3,
    thumbs: null,
    tags: ["too mild", "no effect"],
    notes: "Very subtle, might need a slightly higher dose.",
    timeOfDay: "afternoon",
  },
  {
    id: 34,
    date: "2026-01-27",
    productSku: "CRX-DR-10",
    productName: "Deep Rest Plus",
    desiredOutcome: "sleep",
    quickRating: 3,
    thumbs: null,
    tags: ["helped sleep", "felt groggy"],
    notes: "Slept deeply but felt heavier than I&apos;d like in the morning.",
    timeOfDay: "night",
  },
  {
    id: 33,
    date: "2026-01-26",
    productSku: "CRX-DR-5",
    productName: "Deep Rest",
    desiredOutcome: "sleep",
    quickRating: 4,
    thumbs: "up",
    tags: ["helped sleep"],
    timeOfDay: "night",
  },
  {
    id: 32,
    date: "2026-01-25",
    productSku: "CRX-CL-2.5",
    productName: "Calm Clarity",
    desiredOutcome: "calm",
    quickRating: 4,
    thumbs: "up",
    tags: ["helped sleep"],
    notes: "Took the edge off evening anxiety without making me drowsy.",
    timeOfDay: "evening",
  },
  {
    id: 31,
    date: "2026-01-24",
    productSku: "CRX-FC-2.5",
    productName: "Focus Crisp",
    desiredOutcome: "focus",
    quickRating: 4,
    thumbs: "up",
    tags: ["great for reading"],
    timeOfDay: "afternoon",
  },
];
