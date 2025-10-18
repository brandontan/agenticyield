# Tech Spec — Gas-Sponsored First Deposit (Meta-Transaction Relayer)

## Overview
We introduce a sponsored deposit path that lets first-time Base wallets deposit USDC without ETH. The client collects a typed EIP-712 intent and sends it to a Node.js relayer service. The relayer verifies policy gates, simulates `permit2 + deposit`, and, if successful, broadcasts the transaction from a funded gas account. Sponsorship is limited to one deposit per wallet with configurable caps and safety checks.

## Components

### Client (Next.js `/earn`)
- **Sponsorship Detector Hook:** Reads ETH and USDC balances, toggles banner when ETH < $0.50 and USDC ≥ configured minimum.
- **Relayer API client:** Interfaces with `POST /relayer/quote` and `POST /relayer/submit`.
- **EIP-712 Intent Signer:** Uses `signTypedData` via wagmi for `DepositIntent`.
- **UI Elements:** Banner, CTA buttons, confirmation dialog, and toasts with prescribed copy.

### Relayer Service (New `apps/relayer` or `apps/api/relayer`)
- **Framework:** Node.js 20 TypeScript (Fastify or Express) deployed as a standalone service (initially manual run).
- **Persistence:** Supabase table `sponsored_deposits` or local Postgres connection within monorepo (schema defined under `infra/supabase`).
- **Rate Limiter:** Middleware using Redis or in-memory token bucket (production must migrate to Redis).
- **Policy Engine:** Validates sponsorship eligibility, enforces caps, queries risk guard service (existing runner endpoints) for metrics (risk score, venue caps, slippage).
- **Simulation Module:** Utilizes `viem` + `eth_call` on Base RPC to simulate permit/deposit path prior to `sendTransaction`.
- **Transaction Builder:** Constructs batched transaction (Permit2 signature or allowance plus router deposit). For MVP assume `permit2` available; else preapprove via permit typed data.
- **Logging & Metrics:** Emit structured logs, update Prometheus counters (or StatsD) via existing monitoring pipeline.

### Shared Libraries
- **Intent Type Definitions:** Create shared TypeScript `@agenticyield/shared/intents` module reused by client and relayer to avoid divergence.
- **Config Loader:** Centralizes environment variables, with schema validation (zod).

## Data Model
- `sponsored_deposits` table:
  - `wallet` (pk, address)
  - `amount_usdc` (numeric 78,6)
  - `tx_hash` (text)
  - `relayed_at` (timestamp)
  - `status` (`success` | `denied`)
  - `reason` (nullable text)
  - `created_at` default now

## APIs
- `POST /relayer/quote`
  - Request: `{ wallet: Address, amountUSDC: string }`
  - Response success: `{ ok: true, sponsored: boolean, estGasUSD?: string }`
  - Response failure: `{ ok: false, reason: string }`
- `POST /relayer/submit`
  - Request: `{ wallet, amountUSDC, intentSig, nonce, deadline }`
  - Response success: `{ ok: true, txHash }`
  - Response failure: `{ ok: false, reason }`

## EIP-712 Intent
- Domain:
  - `name: "AgenticYield"`
  - `version: "1"`
  - `chainId: 8453`
  - `verifyingContract: VAULT_ADDRESS`
- Types:
  ```sol
  struct DepositIntent {
      address wallet;
      uint256 amountUSDC;
      uint256 nonce;
      uint256 deadline;
  }
  ```
- Nonce stored server-side (per wallet) or derived from `sponsored_deposits` row count.

## Control Flow
1. Client detects sponsorship eligibility and hits `/relayer/quote`.
2. Relayer validates policy gates (base chain, not used before, amount <= cap, risk metrics).
3. Client prompts for EIP-712 signature with derived nonce and 10-minute deadline.
4. Client posts signature to `/relayer/submit`.
5. Relayer verifies signature, re-runs policy & simulation, submits transaction using relayer key, and records status.
6. Client receives `txHash`, displays success toast, and triggers balance refresh.

## Safety Checks
- Blocklist: maintain static JSON or Supabase table of sanctioned wallets.
- Risk Data: call runner endpoint (or stub) to fetch `risk_floor`, `venue_cap_pct`, `slippage_estimate`.
- Simulation: `eth_call` via Tenderly or Base RPC; require success.
- Cooldown: ensures 6h since last sponsored attempt per wallet (should be moot once consumed, but protects repeated hits).
- Rate Limiting: per IP + per wallet token bucket (10/hour default).

## Configuration
All values supplied via environment variables documented in README and `.env.example` (relayer section).

## Deployment Plan
- Add `apps/relayer` workspace with scripts (`dev`, `start`, `lint`, `test`).
- Provide Dockerfile / Procfile for later containerization.
- For MVP run manually on a managed VM; integrate with CI once stable.

## Testing Strategy
- Unit tests for policy engine, signature verification, rate limiter.
- Integration tests mocking Base RPC using viem `createPublicClient({ transport: http })` with `mode: "anvil"` in CI.
- End-to-end test stub using Playwright + mocked relayer responses for client UX.
- Manual QA with funded relayer key and Base wallet lacking ETH.
