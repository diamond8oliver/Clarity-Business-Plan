# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository layout
- Root (`/Users/oliverdiamond/Documents/Clarity-Business-Plan`): meta Node package for the repo, plus this `AGENTS.md` and a minimal `README.md`.
- App workspace: `clarity-business-plan/` is a Next.js 16 app (App Router) created via `create-next-app`.
  - Entry points and routing live under `clarity-business-plan/app/`.
  - Global config lives in `clarity-business-plan/next.config.ts`, `clarity-business-plan/tsconfig.json`, and `clarity-business-plan/eslint.config.mjs`.

When making application-level changes, you will almost always be working inside `clarity-business-plan/`.

## Commands
All commands below should be run from `clarity-business-plan/` unless otherwise noted.

### Install dependencies
```bash
cd clarity-business-plan
npm install
```

### Development server
```bash
cd clarity-business-plan
npm run dev
```
- Starts the Next.js dev server on port 3000.
- Main entry page is `app/page.tsx`; layout shell is `app/layout.tsx`.

### Build
```bash
cd clarity-business-plan
npm run build
```
- Runs `next build` using `next.config.ts`.

### Start (production server)
```bash
cd clarity-business-plan
npm run start
```
- Serves the app using the build output from `.next/`.

### Lint
```bash
cd clarity-business-plan
npm run lint
```
- Uses `eslint.config.mjs` with `eslint-config-next` presets.
- Ignores typical build artifacts via `globalIgnores` in `eslint.config.mjs`.

### Tests
There are currently no test scripts defined for the Next.js app, and the root `package.json` has a placeholder `npm test` that always fails. Do not rely on `npm test` until a real test runner is added.

If you add a test setup (e.g. Jest, Vitest, or Playwright), make sure to:
- Define appropriate `test` / `test:watch` scripts in `clarity-business-plan/package.json`.
- Update this `AGENTS.md` with how to run the full suite and a single test file.

## High-level architecture
This project is currently very close to the default `create-next-app` App Router template with Tailwind CSS 4 and Geist fonts:

- **App Router / pages** (`clarity-business-plan/app/`)
  - `app/layout.tsx`
    - Declares global `<html>` and `<body>` structure and imports `./globals.css`.
    - Configures Geist Sans and Geist Mono via `next/font/google` and exposes them as CSS variables on the `<body>`.
    - Exports `metadata` (`title` and `description`) used by Next.js for `<head>` management.
  - `app/page.tsx`
    - Default home route (`/`).
    - Renders a centered marketing-style landing section with the Next.js and Vercel logos.
    - Uses Tailwind utility classes for layout, typography, and dark mode styles.
    - Provides links out to Next.js templates and documentation.

- **Configuration**
  - `clarity-business-plan/next.config.ts`
    - Currently only exports an empty `NextConfig` object placeholder (`/* config options here */`).
    - Any future Next.js customizations (image domains, redirects, experimental flags, etc.) should go here.
  - `clarity-business-plan/tsconfig.json`
    - Strict TypeScript configuration targeting ES2017.
    - Uses `moduleResolution: "bundler"` and the `next` TypeScript plugin.
    - Defines a path alias `@/*` -> `./*` for absolute-style imports from the app root.
  - `clarity-business-plan/eslint.config.mjs`
    - Uses `eslint/config` with `eslint-config-next` for core web vitals and TypeScript.
    - Overrides default ignores explicitly via `globalIgnores` to skip `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.

- **Styling & assets**
  - `clarity-business-plan/app/globals.css`
    - Global CSS entry; in the base template this typically wires up Tailwind 4 layers and any global resets.
  - `clarity-business-plan/public/`
    - Static assets such as `/next.svg` and `/vercel.svg`, referenced from `app/page.tsx`.

## Conventions and guidance
- Prefer using the `@/*` path alias for imports when modules move beyond simple relative paths, to keep imports consistent with `tsconfig.json`.
- New routes should be added under `clarity-business-plan/app/` using the App Router conventions (e.g. `app/(group)/page.tsx`, `app/api/.../route.ts`, etc.).
- Keep lints green by running `npm run lint` before proposing substantial changes; eslint is configured around Next.js best practices.

## When updating this file
- If you introduce a new testing framework, non-trivial build steps, or significant architectural patterns (e.g. domain-driven modules, shared UI libraries, API route conventions), update this document so future agents understand how to:
  - Install and run the project.
  - Navigate the major directories and abstractions.
  - Run tests and linters reliably.
