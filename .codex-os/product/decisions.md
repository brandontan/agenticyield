# Decisions

## 2025-10-17 · SDLC Guardrails (Status: Accepted)
- Adopt Spec Kit for planning and execution; every initiative requires spec + tasks before code.
- Clone and reference `github/spec-kit` under `.codex-os/tools/spec-kit` for templates and checklists.
- Enforce Auditor-first security checks: Slither, Semgrep, Forge invariants, simulation proofs, four-eyes review for Solidity.

## 2025-10-17 · Frontend Stack (Status: Accepted)
- Use Next.js 14 Pages Router with Recharts for MVP visuals.
- Mock data lives in `/api/mock` until Supabase integrations are ready; replace via spec-approved tasks.

Future decisions must include date, context, status (Proposed/Accepted/Deprecated), and links to supporting specs or incidents.
