# Tech Spec — WalletConnect Remediation

## Overview

RainbowKit currently instantiates `walletConnectWallet` with a baked-in fallback project ID. The fallback is revoked, causing WalletConnect Cloud to reject pairing requests. We will centralize environment loading, enforce validation, and pipe approved metadata into RainbowKit so only operator-provided IDs reach the bundle.

## Components

- **Env Loader (`apps/web/lib/env.ts` new file):** Uses `zod` to validate public env vars (`NEXT_PUBLIC_WALLETCONNECT_ID`, deployment URL hints). Exports a readonly config consumed by providers. Validation runs during module init and throws when the ID is missing or malformed, failing builds early.
- **Web3Providers (`apps/web/components/Web3Providers.tsx` updated):** Imports the env config, removes fallback secrets, and relies on the validated ID. Metadata (name, description, URLs) remains consistent across SSR and CSR.
- **Environment Samples (`.env.example`, `apps/web/README.md`):** Document required env key and rotation guidance. Provide placeholder (e.g., `wc_project_id_goes_here`) without real secrets.
- **CI Guard (optional script):** Rely on TypeScript import to throw during build when validation fails; integration tests cover missing env scenarios.

## Data Flow

1. Next.js loads `apps/web/lib/env.ts` during build/server render.
2. Env loader reads `process.env.NEXT_PUBLIC_WALLETCONNECT_ID`, trims whitespace, validates length (32 hex chars), and returns `walletConnect.projectId`.
3. `Web3Providers` receives the validated ID. Because validation throws on failure, the connector always receives a trusted value and build/runtime halts otherwise.
4. RainbowKit uses the provided ID and metadata to initialize connectors; WalletConnect Cloud verifies the project ID + domain allowlist and opens sessions.

## Security Considerations

- No project IDs remain in the repository; placeholder text replaces previous fallback.
- Validation prevents accidental whitespace or copy/paste artifacts leaking into the bundle; missing IDs block the build.
- Warn operators about aligning WalletConnect Cloud origin allowlists with production URL (`NEXT_PUBLIC_APP_URL`).
- Auditor run post-deploy should confirm no secrets in bundle (hash diff).

## Testing Strategy

- **Automated:** `pnpm --filter @agenticyield/web lint`, `pnpm --filter @agenticyield/web typecheck`, and `pnpm --filter @agenticyield/web test` after changes.
- **Manual:** Run `pnpm dev` with a real project ID (out-of-repo) to scan QR plus mobile wallet handshake. Also verify missing ID logs warning and hides WalletConnect option.
