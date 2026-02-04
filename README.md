# Clarity-Business-Plan

ClarityRx is a subscription-based THC micro-dose capsule company with an accompanying app that personalizes dosing based on user feedback. This repo currently contains:

- A Next.js 16 app in `clarity-business-plan/` for the product and marketing experience.
- A Python modeling module `clarity_models.py` at the repo root for financial modeling and personalization simulations.
- `AGENTS.md` with guidance for Warp agents working in this repository.

## Structure

- `clarity-business-plan/`
  - Next.js App Router project (TypeScript, Tailwind, Geist fonts).
- `clarity_models.py`
  - Financial and data models for subscription growth, unit economics, cohorts, market sizing, and a simple personalization example.
- `AGENTS.md`
  - Operational guidance (commands, architecture overview, warp environment notes).

## Running the Next.js app

From the repo root:

```bash
cd clarity-business-plan
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Running the financial models

From the repo root:

```bash
python clarity_models.py
```

This will print summary tables to the console (growth, unit economics, market funnel, cohorts) and open several Matplotlib charts for revenue, LTV, retention, and market sizing. You can also import `clarity_models.py` into a notebook to experiment with assumptions interactively.
