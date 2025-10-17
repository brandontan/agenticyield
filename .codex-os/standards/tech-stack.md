# Tech Stack Standards

- **Package Manager:** pnpm (workspace managed via `pnpm-workspace.yaml`).
- **Frontend:** Next.js 14 (Pages Router) with TypeScript, Recharts, TailwindCSS.
- **Backend Runner:** Node.js 20+, TypeScript, BullMQ, Supabase client.
- **Smart Contracts:** Solidity 0.8.x, Foundry (forge/anvil/cast), OpenZeppelin libraries.
- **Database:** Supabase/Postgres with schema tracked at `infra/supabase/schema.sql`.
- **Tooling:** Turbo repo orchestration, ESLint (`next/core-web-vitals`), Prettier TBD, Vitest, Playwright.
- **Security Toolchain:** Auditor, Slither, Semgrep, Echidna, Forge invariants, pip-audit for Python utilities if added.
- **CI/CD:** GitHub Actions (lint, typecheck, tests, Forge, Auditor, deploy).
