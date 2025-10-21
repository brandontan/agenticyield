# Repository Guidelines

## Start Here
- Read `HANDOFF-2025-10-21.md` for today.
- Memory pointer: `mcp://memory/namespace/item-or-note-id`.
- Follow `.codex-os/` workflows and specs.

## Project Structure & Module Organization
Work inside the monorepo. Frontend lives in `apps/web` (Next.js pages router) and pulls shared UI primitives from `packages/ui` (stub for now). Background jobs will live in `apps/agent-runner`. Solidity lives under `contracts/AgentVault` (Foundry). Infra assets such as Supabase schema and CI workflows belong in `infra/*`. Keep mocks and API fixtures in `apps/web/pages/api/mock/` so dashboards can run offline. When adding new workspaces, list them in `pnpm-workspace.yaml`.

## Build, Test, and Development Commands
Install everything with `pnpm install`. Run the dashboard locally via `pnpm dev` (aliases to `pnpm --filter @agenticyield/web dev`). Use `pnpm --filter @agenticyield/web build` before shipping UI changes. Once contract code lands, compile with `forge build` and run tests using `forge test -vv`. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` so CI mirrors local state.

## Coding Style & Naming Conventions
TypeScript follows strict mode with 2-space indentation and camelCase for variables/functions. React components use PascalCase and belong under `apps/web/components` or `apps/web/sections`. Keep files under ~200 lines; extract hooks into `apps/web/lib` when logic grows. Prefer functional React components with explicit return types. Solidity should follow the OpenZeppelin style: 4-space indentation, `CapsWords` contracts, and descriptive custom errors. Never leave TODOs without issue links.

## Testing Guidelines
Frontend charts rely on mock APIs—add regression tests with Vitest for data transforms and Playwright for flows once the runner is wired. For Solidity, target ≥90% Forge coverage and add invariants for caps, TVL floor, and pause logic. Every rebalance strategy tweak needs a simulation proof captured in `/simulations`. Run `pnpm --filter @agenticyield/web test` plus `forge test` before pushing.

## Commit & Pull Request Guidelines
Use `feat|fix|chore(scope): summary` messages (e.g., `feat(ui): mock earn dashboard`). PRs must link the relevant spec/task ID, attach screenshots or terminal output (lint/typecheck/tests), and list security considerations. Require at least one reviewer for Solidity or queue logic. Update `product/decisions.md` when guardrails change.

## Security-First SDLC Workflow
Follow spec-first planning via Spec Kit: commit specs to `.codex-os/specs/` and block implementation until risks are enumerated. Run Auditor, `slither`, `semgrep --config=auto`, and `forge test --ffi` in CI and locally before merging. Secrets stay out of git—load from `.env.local` and document defaults in `.env.example`. Enforce four-eyes review on contract changes and record simulations or `cast call` outputs as PR evidence. Maintain incident watchlists in Supabase and wire the router kill switch to trip on severity ≥ high. Postmortems for any vulnerability land in `product/decisions.md` with mitigation steps.
