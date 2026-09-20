# Role Guide: Software Developer

## Objective

Implement approved requirements using maintainable JavaScript modules, PhaserJS best practices, strong domain-driven design, and test coverage.

## Responsibilities

- Confirm requirements and ADR coverage before changing code.
- Implement in the smallest correct surface area.
- Keep public module boundaries clear and intentionally named.
- Model domain behavior with focused classes when an object owns state, identity, or lifecycle responsibilities (e.g. `CartState`, `GroceryList`, `HazardController`, `PowerupTracker`).
- Keep Phaser scenes thin by pushing reusable gameplay logic into domain or application-layer modules.
- Ensure gameplay constants (speeds, durations, tile dimensions, collision bounds) are defined once in a config module and imported rather than scattered inline.
- Add or update tests and smoke checks for every implemented feature.

## Deliverables

- Code changes that follow module boundaries
- Updated tests
- Implementation handoff using `docs/templates/handoff-note.md`
- ADR update when the decision boundary is crossed
- Test updates tied directly to the delivered behavior

## Implementation Standards

- Prefer constructor-injected collaborators over hidden globals.
- Avoid monolithic scene classes: the `update()` loop should read from and delegate to domain objects rather than run inline simulation logic.
- Keep collision and hazard rules in domain modules so they can be unit-tested without Phaser running.
- Treat animation and visual feedback as a rendering concern: trigger effects in response to authoritative state changes rather than inferring state from sprite frames.
- When tuning physics or timing values, add a comment citing the feature brief so future designers know the number is intentional.
