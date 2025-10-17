# Execute Tasks Workflow

Use this after a spec is approved to deliver all tasks listed in `tasks.md`.

1. **Prep**
   - Confirm repo is clean and the relevant spec folder is up to date.
   - Review each task’s acceptance criteria, tests, and security gates.

2. **Work in Small Slices (Spec Kit · implement)**
   - Implement tasks one at a time. Keep diffs small, commit after each logical unit.
   - For Solidity changes, run `forge build`, `forge test`, invariants, and Auditor/Slither scans.
   - For frontend/runner changes, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and any mocks/simulations.

3. **Document While Working**
   - Update spec notes or `product/decisions.md` if scope shifts or new risks emerge.
   - Record new incidents, metrics, or runbooks in the handoff file.

4. **Verification**
   - Ensure all acceptance criteria pass and attach proof (screenshots, logs, coverage).
   - Add Playwright or Forge fork tests when behavior spans multiple modules.

5. **Completion**
   - Update `tasks.md` with status (Done/Blocked) and evidence links.
   - Prepare a summary for `HANDOFF-YYYY-MM-DD.md`.

If any task becomes ambiguous, pause and run `/co-plan` or `/co-create-spec` to revisit scope.
