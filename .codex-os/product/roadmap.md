# Roadmap

## 2025 Q4 (MVP)

1. **Earn Dashboard Mock (Spec TBA)** — Complete (2025-10-17)
   - Deliver mock RAYS chart, allocation chart, explainer panel backed by API fixtures.
   - Evidence: `apps/web/pages/earn.tsx`, `/api/mock` endpoints.

2. **RAYS Engine & Runner (Planned)**
   - Implement score calculation, Supabase persistence, and auto-manage toggles.
   - Dependencies: Spec pending; requires live data integrations (Aave v3, Curve) and simulation harness.

3. **AgentVault Contracts (Planned)**
  - Build ERC-4626 vault with router + adapters; add Forge invariants and Auditor scans.
  - Deliver kill switch, allocation caps, and proof of allocation events.

4. **Security Hardening & Monitoring**
  - Integrate Auditor pipeline, OTel metrics, and incident ingestion into the runner.
  - Ensure CI runs Slither, Semgrep, Echidna (target coverage ≥90%).

5. **WalletConnect Remediation (Spec 2025-10-18-walletconnect-remediation)**
  - Remove revoked project IDs, validate env configuration, and document rotation steps.
  - Evidence: `.codex-os/specs/2025-10-18-walletconnect-remediation/*`, updated `Web3Providers`.

Roadmap entries are updated via `.codex-os/instructions/core/plan-product.md` whenever we plan new milestones.
