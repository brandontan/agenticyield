# Create Spec Workflow

Follow this when turning a product brief into a Spec Kit package (`srd.md`, `tech-spec.md`, `tasks.md`).

1. **Kickoff Checklist**
   - Read the parent plan or mission entry to confirm scope.
   - Open `.codex-os/tools/spec-kit/templates/spec-template.md` and copy the scaffold into the new spec folder.
   - Name the spec folder as `YYYY-MM-DD-kebab-title/` under `.codex-os/specs/`.

2. **SRD (Spec Kit · specify)**
   - Document problem statement, users, goals, non-goals, success metrics, and constraints.
   - Capture crypto-specific safety requirements (custody, protocol limits, kill switches).

3. **Tech Spec**
   - Describe architecture boundaries (frontend, runner, contracts, Supabase) and data flows.
   - Detail security defenses: invariants, simulation requirements, audit tools (Slither, Echidna, Auditor).
   - Note dependencies and integration surfaces (Aave, Curve, Base RPC, Supabase).

4. **Tasks Matrix (Spec Kit · tasks)**
   - Break work into atomic, demo-able tasks. For each include summary, acceptance criteria, changed files, tests, and security notes.
   - Reference risk mitigations and coverage expectations.

5. **Review & Publish**
   - Run `/co-plan` or `/co-create-spec` checklist items as needed.
   - Add links to relevant specs in `roadmap.md`.
   - Announce completion in the handoff note.

Never begin implementation until the spec is approved and security review items are acknowledged.
