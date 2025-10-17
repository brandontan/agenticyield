# Stack

| Layer        | Choice                                         | Notes |
|--------------|------------------------------------------------|-------|
| Frontend     | Next.js 14 (TypeScript), Recharts, Tailwind    | Dashboard + Earn UI. |
| Backend      | Node/TypeScript worker (BullMQ)                | RAYS calculation, proposals, notifications. |
| Contracts    | Solidity 0.8.x, Foundry, OpenZeppelin ERC-4626 | Agent vault, router, adapters. |
| Database     | Supabase/Postgres                              | Users, wallets, allocations, proofs, incidents. |
| Messaging    | Redis                                          | Job queue for agent runner. |
| Tooling      | pnpm monorepo, Turbo, ESLint, Vitest, Playwright | JS/TS toolchain. |
| Security     | Auditor, Slither, Echidna, Semgrep, Forge invariants | Mandatory scans before merge. |
| Observability| Pino structured logs, OTel metrics, Slack alerts | Monitor rebalances and incidents. |
