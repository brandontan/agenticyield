# Code Style Standards

- **TypeScript**
  - Strict mode enabled; no implicit any or unsafe casts.
  - 2-space indentation, semicolons enforced by formatter.
  - Prefer explicit return types on exported functions/components.
  - React components in PascalCase; hooks in camelCase prefixed with `use`.

- **Solidity**
  - 4-space indentation, SPDX + pragma at top.
  - Use custom errors over `require` strings; explicit `uint256`/`int256`.
  - Group state vars, events, modifiers, functions. Order: constructor, external, public, internal, private.

- **Markdown**
  - Wrap lines at ~100 chars when possible, use fenced code blocks with language tags.
  - Reference files with relative paths; link specs/tasks directly.

- **General**
  - No TODOs without linked issue/spec.
  - Document non-obvious logic with concise comments.
  - Keep modules focused (<400 lines); extract utilities when needed.
