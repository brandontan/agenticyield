# Plan Product Workflow

This workflow adapts the Spec Kit "plan" ritual for AgenticYield. Use it when shaping new initiatives or revisiting roadmap priorities.

1. **Collect Signals**
   - Review `.codex-os/product/mission.md`, `roadmap.md`, `decisions.md`, and `stack.md`.
   - Gather recent specs from `.codex-os/specs/` and note their status.
   - Audit the memory backlog (`.codex-os/tools/spec-kit/memory/`) for prior research.

2. **Define Intent (Spec Kit · clarify)**
   - Summarize the problem, the affected users, and desired outcomes in a short brief.
   - List assumptions, open questions, and security constraints (crypto-first).

3. **Model the Work (Spec Kit · plan)**
   - Break the initiative into milestone slices; map them to Owner, Inputs, Definition of Done, and Risk notes.
   - Update `.codex-os/product/roadmap.md` with the milestone ladder and target dates.
   - Capture any architecture or policy shifts in `.codex-os/product/decisions.md` (ADR-style, with date and status).

4. **Check Safety Gates**
   - Run a threat sketch: identify protocols that can be impacted, list invariants, and record mitigations in `decisions.md`.
   - Confirm compliance with Auditor/Spec Kit guardrails already defined in `standards/best-practices.md`.

5. **Publish & Handoff**
   - Record updated mission/roadmap/decisions/stack documents.
   - Announce new workstreams by creating or updating spec folders under `.codex-os/specs/`.
   - Queue follow-up commands (`/co-plan`, `/co-create-spec`, `/co-exec-tasks`) as appropriate.

Always link evidence: charts, simulations, or external audits should be referenced inline.
