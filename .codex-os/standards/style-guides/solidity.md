# Solidity Style Guide

- `pragma solidity ^0.8.20;` (or latest approved). SPDX identifier required.
- Use OpenZeppelin contracts for ERC-4626, AccessControl, Pausable, ReentrancyGuard.
- Prefer immutable variables for addresses/constants; constructor enforces dependencies.
- Emit events for every state change (Deposit, Withdraw, RebalanceProposed, RebalanceExecuted).
- Use `unchecked` blocks only with proofs and comments.
- Require role-based access using `AccessControl`; keep admin multisig-ready.
- Validate external inputs with caps, slippage bounds, and reentrancy guards.
- Write Forge tests: unit, invariant, fork. Keep tests in `contracts/AgentVault/test`.
- Provide simulation scripts before enabling auto-manage flows.
