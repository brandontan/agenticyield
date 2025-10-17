# Analyze Product Workflow

Run this to produce or refresh `.codex-os/product/analysis.md` with architecture, hotspots, and risk insights.

1. **Gather Inputs**
   - Review mission, roadmap, stack, and recent specs/tasks.
   - Collect metrics, incidents, and audit findings (Auditor, Slither, Forge invariants, etc.).

2. **Map Architecture**
   - Describe current components (frontend, contracts, runner, Supabase) and integration boundaries.
   - Highlight data flows, custody assumptions, and trust zones.

3. **Identify Hotspots**
   - Note modules with frequent changes, security findings, or performance bottlenecks.
   - Document outstanding migrations or debt with impact and proposed actions.

4. **Assess Risk Posture**
   - Evaluate adherence to security guardrails (kill switches, simulations, monitoring).
   - Include dependency risk (protocol upgrades, upstream API changes).

5. **Recommend Actions**
   - List prioritized remediations or experiments (with owner, timeline, and acceptance test).
   - Update roadmap/decisions accordingly.

Ensure the final analysis references evidence and links to specs or incidents for traceability.
