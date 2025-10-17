# Spec: Earn Dashboard Mock

## Summary
Provide a visually accurate, demo-ready Earn dashboard that illustrates how AgenticYield allocates USDC across protocols before live integrations are ready.

## Users & Pain Points
- **Vault owners** need confidence in how funds would move before trusting automation.
- **Product stakeholders** require a click-through demo to align on UX copy and metrics.
- **Security reviewers** want early visibility into planned disclosures (proofs, explainers).

## Goals
1. Display mock RAYS trends for Aave, Curve, and Base with clear uplift deltas.
2. Render allocation distribution (current + history) using visually distinct charts.
3. Surface the latest explainer note that justifies an allocation move.
4. Keep the page self-contained with mock APIs so it runs offline for demos.

## Non-Goals
- Connect to live Aave/Curve data sources.
- Execute transactions or mutate on-chain state.
- Implement authentication or multi-vault switching.

## Success Metrics
- Dashboard loads under 2s on local hardware using mock data.
- Charts and explainer panel reflect updates when mocks change.
- Demo feedback: stakeholders can understand why the agent rebalanced in ≤2 sentences.

## Constraints & Security Notes
- No secrets; mock APIs serve static data stored in repo.
- Follow Spec Kit + Auditor standards: spec-driven workflow, security-first messaging.
- Use consistent color palette matching protocol styles for future theming.
