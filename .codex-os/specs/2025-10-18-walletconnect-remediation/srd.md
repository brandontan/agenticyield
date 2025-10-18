# SRD — WalletConnect Remediation

## Problem Statement

WalletConnect sessions on the AgenticYield dashboard fail with `Unauthorized: invalid key` because the shipped build still embeds an expired WalletConnect Cloud project ID. Without a valid project ID the QR flow and deep links never resolve, blocking mobile users from authorizing the vault.

## Users & Needs

- **Yield runners (P1):** Need to connect custodial wallets from mobile devices through WalletConnect to monitor balances and approve vault actions.
- **Security reviewers (P2):** Require confidence that no WalletConnect credentials ship in the bundle and that environment validation prevents accidental leaks.

## Goals

1. Ensure the dashboard only boots when a valid WalletConnect project ID is provided at build time.
2. Ship metadata and allowlists that match production domains so WalletConnect Cloud treats the project as authorized.
3. Document configuration steps so operators can rotate keys without touching source code.

## Non-Goals

- Rotating or provisioning WalletConnect Cloud credentials on behalf of operators.
- Adding new wallet connectors beyond the existing RainbowKit set.
- Implementing server-side wallet actions or wallet connection persistence.

## Success Metrics

- **SC-001:** WalletConnect QR pairing succeeds against WalletConnect Cloud using the configured project ID.
- **SC-002:** Build pipeline fails if `NEXT_PUBLIC_WALLETCONNECT_ID` is missing, blank, or malformed (non-hex / wrong length).
- **SC-003:** Repository contains zero hard-coded WalletConnect project IDs; secrets live only in environment configuration.

## Constraints & Risks

- WalletConnect Cloud only trusts project IDs created in their dashboard and may enforce origin allowlists; metadata must match deployment domains.
- Keeping project IDs out of version control is mandatory; `.env` samples must use placeholders.
- Production uses Vercel; configuration changes must be documented for that environment alongside local dev instructions.
