"use client";

import { useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    role: "assistant",
    text:
      "Hi, I’m the ClarityRx demo assistant. I can explain how capsules differ, how terpenes relate to effects, and when to talk to your doctor — but I can’t give medical advice.",
  }]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    const replyText = buildReply(trimmed);
    const botMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: replyText,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Assistant chat (mock, local only)
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This is a front-end only mock of the ClarityRx assistant. Try questions
            like “Why am I groggy?”, “What&apos;s the difference between myrcene and
            limonene?”, or “Can I take this with blood pressure meds?”.
          </p>
        </header>

        <section className="flex flex-1 flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about sleep, terpenes, or safety..."
              className="flex-1 rounded-full border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-700"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Send
            </button>
          </form>
        </section>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
          In production, this chat would call a hosted AI model with access to your
          profile, dosing history, and an educational content library. The prompts
          would enforce clear safety rules and always defer medical decisions to
          your clinician.
        </p>
      </main>
    </div>
  );
}

function buildReply(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("groggy") || q.includes("grogginess")) {
    return (
      "Many people feel groggy when the THC dose or timing is a bit too strong for their body. " +
      "For example, taking a sleep capsule too late at night or combining THC with sedating " +
        "terpenes like myrcene can carry over into the morning. In the real app we would look at " +
        "your recent dose history and may suggest trying an earlier time or a slightly lower dose. " +
        "If the grogginess is severe or affecting your balance or thinking, please talk to your doctor."
    );
  }

  if (q.includes("blood pressure") || q.includes("meds") || q.includes("medication")) {
    return (
      "I can’t safely check specific drug–drug interactions. Some blood pressure and heart " +
      "medications can interact with cannabis, and the risks depend on your full medical history. " +
      "Please talk to your prescribing doctor or pharmacist before using THC products with your " +
      "medications. If you notice chest pain, severe dizziness, or other worrying symptoms, seek " +
      "urgent medical care."
    );
  }

  if (q.includes("myrcene") || q.includes("limonene")) {
    return (
      "Myrcene is a terpene often linked to relaxation and sedation — it shows up a lot in sleep-" +
      "oriented products. Limonene has a brighter, more uplifting profile and is often used in " +
      "calm or focus capsules. In ClarityRx, myrcene-heavy capsules are aimed at sleep, while " +
      "limonene- and pinene-forward blends are better suited for daytime use."
    );
  }

  if (q.includes("how much") || q.includes("dose")) {
    return (
      "Dosing is highly individual. ClarityRx follows a ‘start low, go slow’ philosophy, especially " +
      "for adults 50–75 or anyone new to THC. The app would suggest conservative starting doses and " +
      "then adjust gradually based on your logged outcomes. For any specific dosing question, please " +
      "discuss it with a clinician who knows your health history."
    );
  }

  return (
    "That’s a great question. In this demo I can only give general education, not personalized " +
    "medical advice. In the full product, I’d combine your profile, recent dose logs, and a " +
      "terpene-focused product catalog to answer more precisely — and I’d still advise checking " +
      "important decisions with your doctor."
  );
}
