# Tasks — Gas-Sponsored First Deposit

## Task 1 — Scaffold Relayer Service *(Open)*
- **Summary:** Create a new `apps/relayer` service with env validation, basic Fastify server, and stub endpoints.
- **Acceptance Criteria:**
  - `apps/relayer` workspace registered in `pnpm-workspace.yaml` with `package.json` scripts (`dev`, `start`, `lint`, `test`).
  - `.env.example` gains relayer variables with placeholder values.
  - `POST /relayer/quote` and `POST /relayer/submit` respond with `501` (not implemented) plus validation of request body.
  - CI updates (`pnpm lint`, `pnpm test`) include relayer package.
- **Files:** `apps/relayer/**/*`, `pnpm-workspace.yaml`, `.env.example`, `README.md`.
- **Tests:** Unit tests for request schema validation (Vitest).
- **Security Notes:** No private keys committed; document requirement to load `RELAYER_PRIVATE_KEY` from environment.

## Task 2 — Implement Policy, Persistence, and Simulation *(Open)*
- **Summary:** Flesh out relayer logic—policy enforcement, Supabase persistence, Base RPC simulation, and transaction submission skeleton.
- **Acceptance Criteria:**
  - `POST /relayer/quote` enforces policy gates (amount cap, single-use, cooldown, blocklist, rate limit) and returns `estGasUSD`.
  - `POST /relayer/submit` verifies EIP-712 signature, re-runs checks, hits `eth_call` simulation, and persists result in `sponsored_deposits`.
  - Supabase migration adds `sponsored_deposits` table with indexes on `wallet` and `relayed_at`.
  - Logging + metrics scaffolding in place (`sponsored_*` counters).
  - Failing policy returns descriptive reason strings matching UX copy.
- **Files:** `apps/relayer/src/**/*`, `infra/supabase/migrations`, shared intent types, monitoring setup.
- **Tests:** Vitest unit tests covering policy outcomes, signature verification, simulation success/failure (mock RPC).
- **Security Notes:** Ensure relayer never accepts sponsors when `SPONSOR_ON=false`; blocklist enforced before any external call.

## Task 3 — Client UX and Intent Flow *(Open)*
- **Summary:** Add sponsored deposit UI on `/earn`, integrate with relayer endpoints, and handle EIP-712 signing.
- **Acceptance Criteria:**
  - Banner and CTA copy match spec; visible when ETH < $0.50 and USDC ≥ minimum.
  - Quote → intent signing → submit flow implemented; fallback “I’ll pay my own gas” path retained.
  - Handling of denial reasons with in-UI messaging.
  - Balance refresh and success toast with BaseScan link on completion.
- **Files:** `apps/web/components/**/*`, `apps/web/hooks/**/*`, `apps/web/lib/api/relayer.ts`, translation/copy constants.
- **Tests:** Vitest unit tests for eligibility logic; Playwright or React Testing Library tests for banner/flow states.
- **Security Notes:** Client never stores relayer private key; ensure env gating hides banner when `SPONSOR_ON=false`.

## Task 4 — Ops Hardening & Documentation *(Open)*
- **Summary:** Document relayer operations, add observability hooks, and ensure fallback works.
- **Acceptance Criteria:**
  - README section detailing sponsorship feature, env vars, and relayer deployment steps.
  - Handoff note updated with instructions for monitoring and ETH top-ups.
  - Alerting pipeline or placeholder script for low relayer ETH.
  - Auditor checklist updated to include relayer policy verification.
- **Files:** `README.md`, `HANDOFF-*.md`, `.codex-os/product/decisions.md` (if new policy), monitoring configs.
- **Tests:** N/A (manual verification).
- **Security Notes:** Document blocklist management and rate limiting strategy; ensure logs avoid PII beyond wallet addresses.
