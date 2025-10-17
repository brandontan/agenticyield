# AgenticYield — Yield Manager (MVP)

- **Date:** 2025-10-17
- **Owner:** Brandon
- **Goal:** Self-custodial autopilot that moves USDC on Base among Aave v3 and Curve to maximize net, risk-adjusted yield.
- **Non-Goals (MVP):** No leverage, no cross-chain, no pooled custody, no upgradeable proxies.

---

## 1. Problem & Outcome
- Users manually chase yield across Aave/Curve; it is error-prone, gas-wasteful, and opaque.
- Outcome: “Deposit → turn on Auto-Manage → get plain-English reasons for moves → withdraw anytime,” with verifiable on-chain receipts.

**Success Criteria (MVP)**
1. Deposit/Withdraw works on Base Sepolia & Base mainnet.
2. Auto-Manage moves only when uplift ≥ configured threshold (default 50 bps).
3. Every rebalance produces a reason card and a Proof of Allocation entry.
4. Zero failed withdrawals under normal liquidity.

---

## 2. System Boundaries & Components
- **Contracts:** `AgentVault.sol` (ERC-4626), `Router.sol` (protocol caps, pausable), `AaveV3Adapter.sol`, `CurveAdapter.sol`.
- **Worker:** `apps/agent-runner` (Node/TypeScript) computes RAYS and proposes/executes moves.
- **Web App:** Next.js (Earn tab + right rail “Explainer”).
- **Database:** Supabase for metadata/events, not asset custody.

---

## 3. Core Domain Logic

### 3.1 Risk-Adjusted Yield Score (RAYS)
`RAYS = interest_apy − safety_discount − move_cost`
- `interest_apy`: protocol’s current APY.
- `safety_discount`: weighted penalty (audits, age, TVL trend, utilization, oracle type, incidents).
- `move_cost`: gas + expected slippage (in APY bps over next period).

**Move Rule:** Rebalance if `(RAYS_best − RAYS_current) ≥ threshold_bps` (default 50 bps). Cooldown 6h per vault.

### 3.2 RiskScore v0 (0–1)
Weights (sum = 1.0):
- audits 0.20, age 0.10, tvl_trend_7d 0.20, utilization 0.20, oracle_quality 0.20, incidents 0.10.
- **Hard Gate:** Block actions if `risk_score < 0.60`.

---

## 4. State & Flows

### 4.1 Vault State Machine
`IDLE → DEPOSITED → AUTO_READY → (PROPOSED → EXECUTING → EXECUTED | BLOCKED)`
- `PAUSED` (manual or incident) can occur and resume to the previous state.

### 4.2 User Flows
1. **Deposit:** Connect wallet → call `vault.deposit()` → UI shows allocation 100% “Idle” until first placement.
2. **Enable Auto-Manage:** Toggle ON → stores policy (threshold, caps, cooldown).
3. **Withdraw:** Call `vault.redeem()`; UI displays ETA/gas; always succeed if liquidity available.

### 4.3 Worker Cycle (every 6h per active vault)
1. Pull Aave/Curve yields & risk inputs (Base).
2. Compute `RAYS_current` & `RAYS_best`.
3. If uplift ≥ threshold and cooldown passed ⇒ `PROPOSED`.
4. Simulate route (slippage guard).
5. If OK and risk floor met ⇒ execute via Router (prefer private tx).
6. Emit events; write Proof; push Explainer message.

---

## 5. Public Interfaces (Deterministic Contracts)

### 5.1 AgentVault.sol (ERC-4626)
- `function deposit(uint256 assets, address receiver) external returns (uint256 shares);`
- `function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);`
- Manager hooks (`onlyAdmin`): `function setRouter(address router) external;`
- Views: `function totalAssets() public view returns (uint256);`
- Event: `event RebalanceExecuted(address fromVenue, address toVenue, uint256 amount, string reason, bytes32 proofHash);`

### 5.2 Router.sol
- `function setCap(address venue, uint256 usdcCap) external onlyAdmin;`
- `function setPaused(bool paused) external onlyAdmin;`
- `function rebalance(address fromVenue, address toVenue, uint256 amount, bytes calldata params) external onlyOperator returns (bytes32 proofHash);`
- Errors: `CapExceeded()`, `SlippageExceeded()`, `RiskFloorBreached()`.

### 5.3 Adapters
- `function deposit(uint256 amount) external returns (uint256 received);`
- `function withdraw(uint256 amount) external returns (uint256 returned);`
- `function previewApr() external view returns (uint256 aprBps);`
- `function tvl() external view returns (uint256 usdcAmount);`

---

## 6. Backend APIs (Next.js Route Handlers)

### 6.1 Policy
- `GET /api/policy` → current policy JSON.
- `POST /api/policy` (auth) → `{threshold_bps, max_pct_per_protocol, cooldown_hours}` (zod schema).

### 6.2 Metrics
- `GET /api/metrics/rays?window=7d` → time series: `{t, apy_bps, safety_bps, move_cost_bps, rays_bps, venue}`.
- `GET /api/metrics/allocation?window=30d` → `{t, aave_pct, curve_pct, idle_pct}`.
- `GET /api/metrics/net-apy?window=30d` → baseline vs actual.

### 6.3 Actions
- `POST /api/rebalance/propose` → `{from, to, sizePct, rays_gap_bps, reason}` (no tx).
- `POST /api/rebalance/execute` → server initiated; returns `{txHash, proofUri}`.

### 6.4 Proofs
- `GET /api/proofs/:vaultId` → `{t, from, to, amount, tx, proof_uri}`.

All endpoints must use TypeScript types + zod validation.

---

## 7. Data Contracts (DB Schemas)
SQL schema snippet (Supabase/Postgres):
```sql
create table users (
  id uuid primary key,
  email text,
  created_at timestamptz default now()
);

create table vaults (
  id uuid primary key,
  user_id uuid references users(id),
  chain text,
  address text,
  auto_manage bool default false,
  threshold_bps int default 50,
  cooldown_hours int default 6,
  max_pct_per_protocol int default 50,
  created_at timestamptz default now()
);

create table allocations (
  id uuid primary key,
  vault_id uuid references vaults(id),
  protocol text check (protocol in ('AAVE','CURVE','IDLE')),
  amount_usdc numeric,
  apy_bps int,
  risk_score numeric,
  updated_at timestamptz default now()
);

create table proposals (
  id uuid primary key,
  vault_id uuid references vaults(id),
  from_protocol text,
  to_protocol text,
  delta_usdc numeric,
  rays_gap_bps int,
  reason text,
  status text check (status in ('PROPOSED','EXECUTING','EXECUTED','BLOCKED')),
  created_at timestamptz default now()
);

create table executions (
  id uuid primary key,
  proposal_id uuid references proposals(id),
  tx_hash text,
  gas_used numeric,
  slippage_bps int,
  net_delta_usdc numeric,
  created_at timestamptz default now()
);

create table proofs (
  id uuid primary key,
  vault_id uuid references vaults(id),
  proof_uri text,
  created_at timestamptz default now()
);

create table incidents (
  id uuid primary key,
  protocol text,
  severity text,
  title text,
  url text,
  occurred_at timestamptz
);
```

---

## 8. UI Spec (Earn Tab + Chat)
- **Top Cards:** Net APY (after fees), Risk Score, Allocation donut (Aave/Curve/Idle), Gas + Slippage saved (month).
- **Charts:**
  - RAYS (7/30d): 3 lines (Aave, Curve, Current). Tooltip shows interest, safety discount, move cost, RAYS.
  - Allocation history (30d): stacked area (Aave/Curve/Idle).
  - Net APY vs Baseline: line (Your net vs “Aave-only”).
- **Right Rail:** Explainer (last move) → 2 sentences + tx link + uplift bps.
- **Controls:** Auto-Manage toggle, Threshold slider (30–120 bps), “Rebalance now” (manual trigger).

---

## 9. Security Requirements
- Self-custody per user vault; no pooling.
- Guards: per-protocol cap, `Pausable`, `ReentrancyGuard`, slippage limit param.
- Risk floor: block if `risk_score < 0.60`.
- MEV-aware: prefer private tx / RFQ; fallback to public with tight slippage.
- Secrets: No keys in repo; CI secret scan; allowlisted RPCs.
- Sanctions: Address screening on UI and server before execution.

---

## 10. Observability
- Events: `RebalanceProposed`, `RebalanceExecuted`, `Paused`, `CapChanged`.
- Logs: `pino` JSON (vaultId, userId, proposalId, txHash).
- Metrics: `rebalances_count`, `median_rays_gap`, `failed_exec_rate`, `gas_per_exec`.
- Alerts: Slack webhook on `Paused`, `RiskFloorBreached`, `exec_failed`.

---

## 11. Testing Strategy
- **Foundry Unit:** ERC-4626 math, cap checks, pause, slippage guard, event emission.
- **Invariants:** `totalAssets ≥ sum(adapter balances)`; caps never exceeded.
- **Fork (Base):** deposit → place Aave → simulate Curve better → rebalance → withdraw.
- **Echidna:** reentrancy & boundary conditions.
- **Frontend (Vitest/Playwright):** RAYS rendering, policy slider, Explainer panel, API schemas.

**Acceptance Tests (Must Pass)**
1. Deposit 1,000 USDC → `totalAssets ≈ 1,000`.
2. With Aave 4.0%, Curve 5.0%, threshold 50 bps → no move until gap ≥ 0.5%.
3. After Curve rises to 5.6% (gap 1.6%) → rebalance executed; Explainer shows uplift; Proof created.
4. Withdraw 1,000 USDC − fees succeeds; events emitted.

---

## 12. Deployment Plan
- **Stage 1 (Base Sepolia):** Deploy contracts; set small caps; run worker against mock then live feeds; execute manual smoke tests.
- **Stage 2 (Mainnet Base):** Conservative caps; Auto-Manage OFF by default; enable per user gradually.
- **Feature Flags:** `AUTO_MANAGE_DEFAULT`, `RAYS_THRESHOLD_BPS`, `USE_PRIVATE_TX`.
- **Rollback:** Pause Router; disable Auto-Manage; display alert banner.

---

## 13. Risks & Mitigations
- Oracle/TVL anomalies → incident feed auto-pause; require manual resume.
- Gas spikes → move cost model includes 95th percentile gas; dynamic threshold adjustments.
- Adapter bugs → keep adapters small; run fork tests; roll out new Router address if needed (no proxy).

---

## 14. API & Type Schemas (zod)
```ts
// /api/policy POST
const PolicySchema = z.object({
  threshold_bps: z.number().int().min(10).max(200).default(50),
  max_pct_per_protocol: z.number().int().min(30).max(80).default(50),
  cooldown_hours: z.number().int().min(1).max(24).default(6)
});

type Policy = z.infer<typeof PolicySchema>;

// /api/metrics/rays GET
const RaysPoint = z.object({
  t: z.string(),
  apy_bps: z.number(),
  safety_bps: z.number(),
  move_cost_bps: z.number(),
  rays_bps: z.number(),
  venue: z.enum(['AAVE', 'CURVE'])
});
```

---

## 15. Definition of Done (DoD)
1. Contracts deployed (Sepolia); addresses documented.
2. Web renders live RAYS + Allocation from worker-written rows.
3. Manual and Auto-Manage rebalances succeed with proofs + explainers.
4. CI green (lint, types, Foundry tests ≥ 90% coverage on core).
5. Security checklist signed (caps set, pause tested, no secrets in git).

---

## 16. Work Breakdown
- Scaffold monorepo; generate stubs for contracts, worker, web, schema.
- Implement ERC-4626 vault + minimal Router + mock adapters.
- Wire worker with mock feeds, then Aave/Curve (Base).
- Build Earn UI: cards, RAYS chart, Allocation chart, Explainer panel.
- Add policy API + zod schemas; persist policy to vaults.
- Implement Proofs table + event ingestion.
- Write Foundry tests + fork smoke.
- Add CI workflows and secret scan.
- Stage deploy (Sepolia); capture addresses in `packages/sdk/addresses.ts`.

---

**Use this spec as the single source of truth. Commit in small PRs, each tied to sections above with clear acceptance evidence.**
