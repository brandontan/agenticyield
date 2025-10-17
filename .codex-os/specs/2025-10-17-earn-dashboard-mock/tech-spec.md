# Tech Spec — Earn Dashboard Mock

## Architecture
- **Frontend:** Next.js App Router deployed within `apps/web` workspace. Uses TailwindCSS-based UI components from the v0 Agentic Yield design kit.
- **Mock APIs:** Route handlers under `app/api/metrics` and `app/api/explainer` serve deterministic JSON, refreshed per request.
- **Charts:** Recharts visualizations configured as client components that consume the mock endpoints via fetch hooks.
- **State Management:** SWR for polling, server components for initial data fetches.

## Integration Notes
- Adopt the upstream UI from `brandontan/v0-agentic-yield-ui`, migrating structure (app router, components, hooks) into the monorepo workspace.
- Ensure environment-agnostic fetches by using `next.config.mjs` rewrite for relative API paths when necessary.
- Align colors/typography with Tailwind tokens defined via `components.json` (shadcn preset).
- Provide type definitions for API responses in `app/api/.../route.ts` for reuse by client components.
- Guarantee tests run headlessly; charts should degrade gracefully if data is unavailable.

## Security & Performance
- No secrets or network calls; only local data.
- Wrap fetch calls with error handling and fallback states.
- Keep bundle size manageable; tree-shake unused shadcn components.
- Document all API schemas for future replacement with live data.
