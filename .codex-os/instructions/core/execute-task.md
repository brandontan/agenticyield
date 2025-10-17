# Execute Single Task Workflow

Use this for `/co-exec-task <ID>` or when tackling a single task from `tasks.md`.

1. **Read the Task**
   - Confirm context, acceptance criteria, security notes, and required tests.
   - Check related sections in `tech-spec.md` and product decisions.

2. **Implement**
   - Work in a dedicated branch or commit.
   - Respect coding standards and security guardrails (Spec Kit + Auditor requirements).
   - Keep the change minimal; avoid opportunistic refactors unless the task requires them.

3. **Validate**
   - Run the exact tests listed plus baseline checks (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `forge test`, etc.).
   - Capture outputs/screenshots for the handoff note or PR body.

4. **Document**
   - Update the task entry with status, test evidence, and any deviations.
   - Log new risks or decisions in `product/decisions.md` if needed.

5. **Commit & Handoff**
   - Commit using `<type>(scope): summary (spec <id> / task <n>)` format.
   - Ensure repo is clean and the handoff file references the completed task.

If uncertainty remains, escalate back to spec authors before merging.
