# Tasks — Earn Dashboard Mock

## Task 1 — Adopt v0 UI Scaffold *(Done 2025-10-17)*
- **Summary:** Replace existing `apps/web` pages with the v0 Agentic Yield UI (App Router, components, styles).
- **Acceptance Criteria:**
  - `apps/web/app` directory mirrors upstream layout and loads locally via `pnpm dev`.
  - Tailwind styling and shadcn components render correctly.
  - Mock API endpoints return sample data without runtime errors.
- **Files:** `apps/web/app/**/*`, `apps/web/components/**/*`, `apps/web/styles/**/*`, `apps/web/postcss.config.mjs`, `apps/web/tailwind.config.ts`, etc.
- **Tests:** `pnpm lint`, `pnpm typecheck`, `pnpm --filter @agenticyield/web build`.
- **Security Notes:** Ensure no external keys; API handlers must remain mock-only.

## Task 2 — Hook Earn Dashboard Mock Data *(Done 2025-10-17)*
- **Summary:** Port mock metrics/explainer routes and ensure charts + agent chat consume them via SWR or server fetch.
- **Acceptance Criteria:**
  - `/earn` shows RAYS line chart, allocation area chart, KPI cards, and explainer panel with mock data.
  - Fallback UI appears when fetch fails.
- **Files:** `apps/web/app/api/**/*`, `apps/web/components/**/*`.
- **Tests:** Same as Task 1 plus manual smoke via `pnpm dev`.
- **Security Notes:** Mock data must not expose secrets; use static JSON or deterministic generators.

## Task 3 — Document & Screenshot *(In Progress)*
- **Summary:** Update `HANDOFF-2025-10-17.md` with screenshots, QA notes, and link to spec tasks.
- **Acceptance Criteria:**
  - Handoff includes ✅ status for dashboard, risk notes, next steps.
  - Screencap stored under `docs/` or shared location (TBD). Provide description if image not stored.
- **Files:** `HANDOFF-2025-10-17.md`, optional `/docs`.
- **Tests:** N/A.
- **Security Notes:** Ensure screenshots exclude sensitive info.
