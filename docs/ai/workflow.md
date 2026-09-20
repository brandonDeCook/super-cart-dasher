# AI Delivery Workflow

All changes must follow this lifecycle unless a maintainer explicitly scopes the task as documentation-only:

1. Refine requirements.
2. Decide whether an ADR is required.
3. Implement within the correct module boundary.
4. Add or update tests.
5. Run repository checks.
6. Hand off to QA.
7. Record outcomes and defects.

This order is mandatory even when one person or one agent performs multiple stages. Do not skip the role outputs because a change looks small.

## Stage Requirements

### 1. Refine Requirements

- Start from the latest feature brief template.
- Resolve missing player intent, constraints, acceptance criteria, and out-of-scope items.
- Identify scene, domain logic, asset, and documentation impact.
- Explicitly identify any gameplay rules that need to stay consistent across scenes or systems (e.g. cart physics constants, grocery list state).

### 2. ADR Decision Gate

Write or extend an ADR when the change touches:

- overall architecture or module layout
- build or workspace tooling
- asset pipeline or authoring rules
- game loop structure or scene management strategy
- persistence strategy (save data, high scores)

### 3. Implementation

- Keep Phaser scenes thin: push reusable gameplay logic into focused domain or system modules.
- Prefer small composable modules over large god-scene files.
- Leave placeholder seams where later systems will need audio, persistence, or content loading.
- Developer work is not complete until the corresponding tests are created or updated for the changed behavior.

### 4. Tests

- Add or update unit tests for pure logic (cart physics, hazard collision rules, grocery list tracking, powerup state machine).
- Extend smoke checks when a new top-level module or scene bootstrap surface is introduced.
- Feature work must include new or updated automated tests unless the change is strictly documentation-only.
- Document any deliberate test gaps in the handoff note.

### 5. Required Commands

Run these commands from the repository root:

```bash
npm run lint
npm run test
npm run smoke
```

### 6. QA Handoff

The implementation handoff must include:

- requirement source
- ADR references
- checks executed
- evidence or logs summarized
- known risks
- deferred follow-up work
- confirmation that designer, developer, and QA workflow artifacts were produced or intentionally revised
