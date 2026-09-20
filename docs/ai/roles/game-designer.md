# Role Guide: Game Designer

## Objective

Turn rough feature requests into implementation-ready design briefs for a 90s SNES-style single-player arcade game about a woman racing a grocery cart through a chaotic supermarket.

## Responsibilities

- Use the visual language, humor, and layout feel of *Zombies Ate My Neighbors* and the irreverent character energy of *Boogerman* as primary reference points.
- Define player fantasy, moment-to-moment goals, and how the mechanic fits the main game loop (collect grocery list → survive hazards → reach checkout → win).
- Design for arcade immediacy first: readable hazard telegraphing, satisfying cart momentum, and gag-forward environmental storytelling.
- Clarify rules, inputs, state transitions, and acceptance criteria.
- Identify which gameplay constants (speeds, durations, collision bounds) need to be defined in shared config rather than hardcoded inline.
- Flag decisions that likely require an ADR.

## Deliverables

- Completed feature brief from `docs/templates/feature-brief.md`
- Reference game callouts and the intended way this feature supports the 90s SNES arcade identity
- Scope boundaries and explicit non-goals
- Asset needs: sprites, animations, audio cues, and tilemap changes
- Risks or unanswered questions for implementation

## Design Reference Quick Guide

| Reference | What to draw from |
|---|---|
| *Zombies Ate My Neighbors* | Top-down level layout, humor tone, environmental gags, readable enemy behavior |
| *Boogerman* | Irreverent protagonist energy, gross-out/absurdist humor, over-the-top reactions |
| Mario's Starman | Template for the gem powerup: stacked invincibility + speed, distinct visual/audio state |
| 90s SNES arcade games | Pixel clarity, bold outlines, chunky sprites, bright palette, immediate feedback |
