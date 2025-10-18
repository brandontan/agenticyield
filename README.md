# AgenticYield

## CODEx Brief — Project Bootstrap

### What This Is
- AI-assisted yield manager for USDC on Base that allocates across Aave and Curve using a Risk-Adjusted Yield Score (RAYS). The system remains self-custodial, explainable, and minimal.

### Goals (MVP)
- ERC-4626 user vault (self-custody).
- RAYS engine with `score = interest − safety_discount − move_cost`.
- Auto-manage (off by default) that rebalances only when uplift exceeds the configured basis-point threshold.
- Explainable moves: every rebalance logs a two-sentence reason plus the transaction link.
- Proofs: Proof of Allocation and activity log.
- Panel UI featuring an Earn tab with a right-side Agent Chat for explainers only.

### Non-Goals (v1)
- No leverage, exotic pools, or cross-chain bridges.
- No pooled custody and no upgradeable proxies unless strictly required.
- The LLM never signs or moves funds; it only explains and drafts policy JSON.

### Tech Stack
- Solidity 0.8.x with Foundry and OpenZeppelin (ERC-4626, AccessControl, Pausable).
- Base network (testnet and mainnet).
- Node/TypeScript worker (BullMQ) for RAYS computation and proposal drafts.
- Next.js 14 frontend with TypeScript, Wagmi, RainbowKit, Tailwind, and Recharts.
- Supabase/Postgres for persistence (users, vaults, allocations, proofs, events).
- GitHub Actions for lint, type check, and Foundry test automation.
- Security tooling: Slither, Echidna, Forge invariants, Semgrep.

### Repository Layout (Monorepo)
```
agenticyield/
  apps/
    web/            # Next.js app
    agent-runner/   # RAYS worker and schedulers
  contracts/
    AgentVault/     # ERC-4626 vault, router, adapters
  packages/
    sdk/            # shared types and client utilities
    ui/             # shared UI components
  infra/
    supabase/       # schema.sql and seeds
    ci/             # workflows
  .env.example
  README.md
  turbo.json
  package.json
```

### Environment Variables (`.env.example`)
```
# Chain / RPC
NEXT_PUBLIC_CHAIN=base
ALCHEMY_KEY=
USDC_ADDRESS_BASE=
VAULT_ADDRESS_BASE=
NEXT_PUBLIC_WALLETCONNECT_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=

# Redis / Queue
REDIS_URL=

# Features
RAYS_THRESHOLD_BPS=50
AUTO_MANAGE_DEFAULT=false
```

- `NEXT_PUBLIC_WALLETCONNECT_ID` is your WalletConnect Cloud project ID (32 hexadecimal characters). Generate it in the WalletConnect dashboard, add the production/staging domains to the allowlist, then set it via `cp .env.example .env.local` locally and `vercel env pull` / `vercel env add NEXT_PUBLIC_WALLETCONNECT_ID` for deployments. Never commit the value to git.

### Supabase Data Model
- `users(id, email, created_at)`
- `wallets(id, user_id, chain, address, primary bool)`
- `vaults(id, user_id, chain, address, auto_manage bool, created_at)`
- `allocations(id, vault_id, protocol, amount_usdc, apy, risk_score, updated_at)`
- `proposals(id, vault_id, from_protocol, to_protocol, delta_usdc, rays_gap_bps, reason, created_at, status)`
- `executions(id, proposal_id, tx_hash, gas_used, slippage_bps, net_delta_usdc, created_at)`
- `proofs(id, vault_id, ipfs_uri, created_at)`
- `incidents(id, protocol, severity, title, url, occurred_at)` for the risk UI.

### RAYS Overview
- Interest: current APY of a pool.
- Safety discount: based on audits, age, TVL trend, utilization, oracle quality, and incidents.
- Move cost: gas plus expected slippage.
- Rule: only move if the new score minus current score meets the threshold while honoring per-protocol caps.

### Contracts Checklist
- ERC-4626 deposits and withdrawals.
- Router with protocol adapters (`AaveV3Adapter`, `CurveAdapter`).
- `AccessControl` roles (`DEFAULT_ADMIN_ROLE`, `OPERATOR_ROLE`) and `Pausable` safeguards.
- No upgradeable proxies in v1; immutable deployment preferred.
- Emit events for all state changes and wrap external calls with `ReentrancyGuard`.
- Enforce slippage limits from backend/UI inputs and simulate routes before execution.
- Prefer Permit2 or minimal approvals; revoke when unused and use private transaction channels where possible.

### Frontend Notes
- Enforce Base network with a switch prompt and display top-level cards (Net APY, Risk Score, Allocation donut, Gas/Slippage saved).
- Charts: RAYS 7/30-day history, allocation history, Net APY versus baseline.
- Right-rail “Agent Chat” shows explainer-only messages in MVP.
- Primary actions: Deposit, Withdraw, Rebalance now, Auto-Manage toggle, and “Why this move?” with uplift basis points.

### Agent Runner (Worker)
- Every six hours per vault: pull yields, compute RAYS, compare to threshold.
- Build proposals `{from, to, sizePct, reason, rays_gap_bps}` and log to the database.
- If Auto-Manage is on, simulate and execute the route; otherwise notify the UI.
- Record proposals, executions, and Proof of Allocation artifacts.

### Security & Compliance
- Self-custodial vault per user with sanctioned-address blocklists at UI and execution layers.
- Kill switch to pause the router on critical incidents.
- Keep keys out of source control; rely on `.env.local` for local development.
- Run Slither, Semgrep, Forge coverage (≥90% for core), and other static scans in CI.
- Add pre-commit checks for secret patterns.

### Testing Strategy
- Foundry unit tests for vault math, caps, slippage guards, and pause flows.
- Invariants: TVL stays non-negative, caps respected, withdrawals succeed when liquid.
- Fork tests on Base to simulate end-to-end flows.
- Echidna property tests for slippage edges and reentrancy resilience.
- Frontend testing with Vitest for RAYS math plus API handlers and Playwright smoke paths.

### Core Development Commands
```
# install
pnpm i

# contracts
cd contracts && forge install && forge build && cd ..
forge test -vv

# database
psql $SUPABASE_URL < infra/supabase/schema.sql

# dev (web + worker)
pnpm dev

# lint/typecheck/tests
pnpm lint && pnpm typecheck && pnpm test
```

### Deployment Flow (Staging to Production)
- Deploy contracts to Base Sepolia with Foundry scripts, then record addresses in `packages/sdk/addresses.ts`.
- Configure the web `.env` for staging RPC and Supabase endpoints.
- Run smoke flows (deposit, simulate, rebalance, withdraw) before tagging a release and deploying to Base mainnet.
- Generate the first Proofs of Allocation and publish a short report.

### Observability
- Structured logs (`pino`) with `vaultId`, `userId`, and `txHash`.
- Metrics (Prometheus / OpenTelemetry): rebalance count, uplift basis points, failure rate, gas usage.
- Alerts via Slack webhook on pause events, failed executions, or incident imports.

### LLM Usage (Optional)
- Explainer agent only: returns two-sentence Markdown justifications; it never signs transactions.
- Planner agent may later convert intent into schema-validated policy JSON.
- Engine enforces thresholds and caps; the LLM remains advisory.

### Definition of Done (MVP)
- Deposit and withdraw on Base succeed.
- RAYS chart and allocation history render from live data.
- Manual “Rebalance now” emits an explainer note.
- Auto-Manage only executes when the uplift exceeds the threshold.
- Proof of Allocation shows protocol splits with transaction links.
- CI passes lint, type check, and Foundry tests.

### Day-1 Tasks
- Scaffold the monorepo layout above and create `.env.example`.
- Contracts: `AgentVault.sol` (ERC-4626), `Router.sol` (caps and pausable), and skeleton adapters (`AaveV3Adapter.sol`, `CurveAdapter.sol`).
- Web: `/earn` page with top cards, mock RAYS line chart, mock allocation area chart, and explainer panel.
- Worker: job skeleton computing RAYS from mock inputs and writing proposals.
- Supabase: apply `infra/supabase/schema.sql`.

### Guardrails
- Security first; never commit keys or secrets.
- Keep the implementation minimal and type-safe.
- Simulate before execution and prefer private transactions.
- Provide clear receipts explaining every move.
- Ship small increments and iterate.
