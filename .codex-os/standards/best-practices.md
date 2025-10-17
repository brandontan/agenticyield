# Best Practices

1. **Spec-Driven Delivery**
   - No feature work without approved spec + tasks. Reference spec IDs in commits and PRs.
   - Update tasks with status, evidence, and security notes.

2. **Security First**
   - Secrets stay out of git; provide defaults in `.env.example` only.
   - Run Auditor, Slither, Semgrep, Forge tests before merge. Capture simulation outputs.
   - Enforce kill-switch and cap checks for any contract/risk-sensitive change.

3. **Testing Discipline**
   - Tests required for new logic: Vitest/unit, Playwright smoke, Forge unit/invariant, Echidna properties.
   - Maintain ≥90% coverage on core contracts; track coverage deltas in PRs.

4. **Observability**
   - Log everything with structured fields (vaultId, userId, txHash). Add metrics for rebalances, failures.
   - Surface incidents quickly; integrate Slack/webhook alerts.

5. **Handoff & Documentation**
   - Update `HANDOFF-YYYY-MM-DD.md` daily with changes, risks, next steps.
   - Record decisions and security learnings in `.codex-os/product/decisions.md`.

6. **Dependency Hygiene**
   - Review upgrades weekly; run `pnpm audit`, `pip-audit` (if Python), `forge update` for submodules.
   - Pin versions in specs when required by audits or compliance.
