# Tasks — WalletConnect Remediation

## Task 1 — Enforce Valid WalletConnect Configuration *(Open)*
- **Summary:** Introduce a typed env loader, remove hard-coded project IDs, and wire the validated value into `Web3Providers`.
- **Acceptance Criteria:**
  - `apps/web/lib/env.ts` exports a validated `walletConnectProjectId` string (32 hex chars) and throws during import when the env value is missing or malformed.
  - `Web3Providers` consumes the loader and no longer references the revoked fallback ID.
  - Console error clearly instructs operators to supply `NEXT_PUBLIC_WALLETCONNECT_ID` before boot.
- **Files:** `apps/web/lib/env.ts` (new), `apps/web/components/Web3Providers.tsx`, `.env.example`, `apps/web/README.md` (if present) or root `README.md` section on env vars.
- **Tests:** `pnpm lint`, `pnpm typecheck`, `pnpm --filter @agenticyield/web test`.
- **Security Notes:** Ensure no real project IDs in git; validation prevents whitespace leakage.

## Task 2 — Document & Verify Deployment Steps *(Open)*
- **Summary:** Update ops docs and handoff with WalletConnect rotation instructions; capture manual QA evidence.
- **Acceptance Criteria:**
  - README (root or web) lists how to set `NEXT_PUBLIC_WALLETCONNECT_ID` locally and on Vercel.
  - `HANDOFF-2025-10-18.md` (or current handoff) notes the change, pending Auditor scan, and manual QR pairing result (value redacted).
- **Files:** `README.md`, `HANDOFF-2025-10-18.md`.
- **Tests:** N/A (docs only) + attach manual verification evidence in handoff.
- **Security Notes:** Document that secrets stay in environment platforms; no keys in repo or screenshots.
