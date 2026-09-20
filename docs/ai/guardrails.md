# AI Guardrails

## Coding Rules

- Keep Phaser scenes thin: scenes own lifecycle, input wiring, and rendering setup. Game rules live in domain modules.
- Do not duplicate gameplay constants across files. Define collision bounds, movement speeds, powerup durations, and cart physics values once and import them where needed.
- Preserve structure-first intent until a feature brief explicitly requires gameplay implementation.
- Keep new modules small and purpose-specific.
- Follow PhaserJS best practices: isolate framework glue from domain logic, keep side effects near the boundary, and prefer deterministic services for simulation logic.
- Use strong domain-driven design. Classes should own long-lived state, lifecycle behavior, and explicit collaborators. Keep helpers pure and avoid catch-all managers.
- Add comments only when code intent is not obvious.

## Design Rules

- Every feature must be traceable to the design pillars: 90s SNES arcade, *Zombies Ate My Neighbors* layout and humor, *Boogerman* irreverence.
- Hazard behavior must be telegraphed visually before it becomes dangerous — no invisible gotchas.
- Cart momentum and feel are core to the player fantasy. Do not add friction, snap, or inertia changes without a feature brief explicitly approving the physics tuning.
- Powerup design must feel earned and satisfying. The gem-stack Starman equivalent should be visually and aurally distinct.
- Humor is part of the design language: NPC reactions, signage, sound effects, and environment details should reinforce the gag-forward 90s tone.

## Decision Rules

- Check `docs/adr` before changing architecture, build tooling, or asset pipeline.
- Create a new ADR when a governed decision changes.
- Do not silently bypass an ADR because implementation appears faster.

## Quality Rules

- Add tests for any new pure logic module.
- Update or create tests for every implemented feature or behavior change. A feature is not complete if its tests were left behind.
- Extend smoke coverage when adding a new public entry point or scene bootstrap surface.
- Do not hand work to QA without executed `lint`, `test`, and `smoke` results unless the environment blocked execution.

## Collaboration Rules

- Summarize assumptions instead of hiding them.
- Stop and request clarification when a requirement conflict affects cart physics, hazard rules, or the grocery list win condition.
- Record deferred work explicitly in the handoff note.
- Follow the guided pipeline explicitly: Game Designer output informs Software Developer work, and QA validates implementation against that output.
- If a task changes the expected designer -> developer -> QA flow, update the workflow docs in the same change.

## Asset Rules

- Store imported source files in `assets/raw`.
- Store game-ready exports in the discipline-specific asset folders (`assets/sprites`, `assets/audio`, `assets/tilemaps`, etc.).
- Sprite sheets must document frame dimensions and animation names in a companion `.json` or in the asset README.
- Do not commit generated build output into `client/src` or `client/public` unless it is a legitimate runtime asset.
