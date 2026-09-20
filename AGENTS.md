# Agent Operating Guide

This repository is designed for a full-cycle AI workflow. Every agent must follow the documents below before changing code or requirements:

1. Read [workflow.md](/home/brand/code/repos/super-cart-dasher/docs/ai/workflow.md).
2. Read [guardrails.md](/home/brand/code/repos/super-cart-dasher/docs/ai/guardrails.md).
3. Read the role guide that matches the task in `docs/ai/roles`.
4. Check [ADR index](/home/brand/code/repos/super-cart-dasher/docs/adr/README.md) for decisions that apply to the task.

## Required Delivery Order

1. Refine or extend requirements using the templates in `docs/templates`.
2. Write or update an ADR when the change affects architecture, build tooling, or the asset pipeline.
3. Implement code in the correct module boundary.
4. Add or extend tests before handoff.
5. Run `npm run lint`, `npm run test`, and `npm run smoke`.
6. Hand work to QA with executed evidence and known risks.

This sequence is mandatory. Even when one person or one agent performs multiple stages, it must still produce the same design, implementation, and QA artifacts in order.

## Boundary Rules

- Game logic (physics, hazards, powerups, cart state, scoring, grocery list) must live in focused domain modules under `client/src/`.
- Phaser scenes must remain thin: delegate gameplay logic to domain modules rather than accumulating rules inside scene update loops.
- Display and presentation logic must consume authoritative game state from domain modules rather than re-deriving it locally.
- Developer agents should favor strong domain-driven design with clear ownership boundaries. Classes should own stateful responsibilities and lifecycle behavior instead of accumulating procedural god modules.
- Assets must be stored under `assets` using the discipline-specific folders (`sprites`, `audio`, `tilemaps`, etc.).

## Design Pillars

- The game is a single-player arcade experience: a woman pushes a grocery cart through a store to collect her full grocery list before time runs out, then reaches checkout to win.
- Art style and feel must target 90s SNES pixel art, drawing from *Zombies Ate My Neighbors* for layout, humor, and visual language, and *Boogerman* for irreverent character and gag-heavy environmental design.
- Hazards include: spilled water (slippery), slow shoppers (blocking), workers (sudden movement), small kids running unpredictably.
- Powerups include: gem collectibles that stack a speed boost and temporary invincibility — fully charged behaves like Mario's Starman.
- Features should reinforce arcade immediacy, readable hazard telegraphing, and satisfying cart momentum.

## Minimum Handoff Content

- Requirement or feature brief reference
- ADR reference when applicable
- Files changed and why
- New tests or updated tests tied to the implemented behavior
- Checks executed
- Known gaps, deferred work, and risks
