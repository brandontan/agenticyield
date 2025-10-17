# TypeScript Style Guide

- Enable strict mode (`tsconfig.json`) and keep `skipLibCheck` true for speed, but add types for any new modules.
- Prefer `type` aliases for data shapes; use `interface` when extending.
- Avoid `any`; use `unknown` + runtime guards if necessary.
- Use `enum` sparingly; prefer union literals.
- Keep React components pure and side-effect free; use SWR/React Query for data fetching.
- Group imports: framework, third-party, internal modules.
- Use named exports; default exports only for Next.js pages/components.
- Document complex hooks with JSDoc including params/returns.
