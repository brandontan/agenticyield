# SRD — Gas-Sponsored First Deposit (Meta-Transaction Relayer)

## Problem Statement
New Base wallets often arrive with USDC but no ETH for gas, which blocks the first vault deposit. We need a sponsored-path relayer that pays gas exactly once per wallet while keeping custody with the user, enforcing risk limits, and failing safely when policy checks are not satisfied.

## Users & Needs
- **Retail depositors (P1):** Want to deposit USDC immediately without hunting for ETH. Expect a trustworthy prompt explaining sponsorship and zero extra fees.
- **Operations & security reviewers (P1):** Need deterministic policy enforcement (limits, blocklists, cooldowns) and inspectable records of every sponsored transaction.
- **Relayer operators (P2):** Require observability, alerts on low ETH, and configuration toggles to pause sponsorship quickly.

## Goals
1. Allow exactly one vault deposit per wallet to execute via a relayer that covers gas while pulling funds from the user wallet.
2. Enforce policy gates (amount cap, risk guardrails, cooldown, blocklists) before sending the transaction.
3. Deliver a clear UX banner and flow on `/earn` that guides non-technical users through the sponsored deposit without revealing private keys.
4. Preserve the existing self-custodial flow as a fallback when sponsorship is unavailable.

## Non-Goals
- Implementing a generalized relayer marketplace or ERC-4337 Paymaster (deferred).
- Sponsoring withdrawals, rebalances, or future deposits beyond the first one.
- Funding or automating the relayer wallet itself; operators will manage ETH balances manually.
- Handling cross-chain deposits or assets other than Base USDC.

## Success Metrics
- **SC-001:** ≥90% of first-time deposit attempts from wallets with < $0.50 in ETH succeed via sponsorship.
- **SC-002:** Policy violations result in zero on-chain transactions (all denied at simulation stage).
- **SC-003:** Relayer ETH balance alert fires before dropping below 0.05 ETH.
- **SC-004:** Fallback (user-paid gas) conversion rate remains unchanged versus pre-feature baseline.

## Constraints & Risks
- The relayer must store private keys server-side only; no leakage to client bundles.
- Each sponsored transaction increases compliance exposure; maintain blocklists and rate limiting.
- Simulation must run against the same RPC as submission to avoid replay divergence.
- Relayer downtime must degrade gracefully to the standard path.
