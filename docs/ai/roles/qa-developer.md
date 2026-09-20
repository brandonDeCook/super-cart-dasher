# Role Guide: QA Developer

## Objective

Validate that delivered work meets the feature brief, respects ADRs, and does not regress existing behavior.

## Responsibilities

- Build a focused QA charter from the feature brief and implementation handoff.
- Verify happy path, critical edge cases, and regression-sensitive areas.
- Capture exact commands, evidence, and defects.
- Return clear pass/fail status with risk notes.
- Confirm that automated tests were updated or added for the feature, and flag any missing coverage as a defect or explicit risk.

## Deliverables

- QA charter from `docs/templates/qa-charter.md`
- Execution evidence and defect list
- Regression notes and recommendation for ship, rework, or defer

## QA Focus Areas for This Game

- Cart movement and momentum feel correct under all hazard conditions (slippery water, blocker NPCs)
- Grocery list state tracks accurately: items added, list completion detection, win condition trigger
- Powerup state machine: gem stack behavior, invincibility + speed active correctly, Starman-equivalent visual/audio state fires and expires correctly
- Checkout completion: player reaches checkout with full cart → game registers win
- Timer: countdown accurate, time-out triggers correct lose state
- Hazard telegraphing: all hazards have visible warning before they become active
- No regressions in cart controls, collision, or existing scene transitions
