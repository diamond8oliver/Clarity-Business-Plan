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
    persona: "very_sensitive_over_65_sleep",
    description:
      "Low-dose 2.5 mg capsule for very sensitive or older users easing into sleep microdosing.",
  },
  {
    sku: "CRX-DR-5",
    name: "Deep Rest",
    thcMgPerCapsule: 5,
    intendedEffect: "sleep",
    persona: "naive_over_60_sleep",
    description:
      "Gentle 5 mg THC capsule with sedating terpenes for sleep support in cannabis-naive adults.",
  },
  {
    sku: "CRX-CL-2.5",
    name: "Calm Clarity",
    thcMgPerCapsule: 2.5,
    intendedEffect: "calm",
    persona: "daytime_anxiety_over_55",
    description: "Daytime microdose for calm without heavy sedation.",
  },
  {
    sku: "CRX-FC-2.5",
    name: "Focus Crisp",
    thcMgPerCapsule: 2.5,
    intendedEffect: "focus",
    persona: "retired_professional_daytime_focus",
    description: "Light daytime focus capsule with a bright, alert terpene profile.",
  },
];

// Simple static history to power the Letterboxd-style grid.
export const dosingHistory: DosingHistoryEntry[] = [
  {
    id: 30,
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
    id: 29,
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
    id: 28,
    date: "2026-01-31",
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
    id: 27,
    date: "2026-01-30",
    productSku: "CRX-DR-2.5",
    productName: "Deep Rest Micro",
    desiredOutcome: "sleep",
    quickRating: 4,
    thumbs: "up",
    tags: ["helped sleep"],
    timeOfDay: "night",
  },
  {
    id: 26,
    date: "2026-01-29",
    productSku: "CRX-FC-2.5",
    productName: "Focus Crisp",
    desiredOutcome: "focus",
    quickRating: 4,
    thumbs: "up",
    tags: ["great for reading"],
    timeOfDay: "morning",
  },
];
