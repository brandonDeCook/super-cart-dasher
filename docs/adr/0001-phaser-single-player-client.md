# ADR 0001: Phaser Single-Player Client Architecture

## Status

Accepted

## Decision

Super Cart Dasher is a single-player browser game built entirely on PhaserJS (v3) with Vite as the build tool. There is no authoritative game server. All simulation — cart physics, hazard behavior, grocery list state, powerup tracking, timer, and win/lose conditions — runs in the browser client.

## Rationale

- The game is single-player with no networked multiplayer requirement.
- PhaserJS provides the physics, input, scene management, asset loading, and rendering pipeline needed for the arcade top-down gameplay loop.
- Vite provides fast dev iteration and a clean production build.
- Keeping the game client-only eliminates server operational overhead for a self-contained arcade experience.

## Module Boundaries

- `client/src/scenes/`: Phaser scene classes (thin, delegate to domain modules).
- `client/src/domain/`: Game logic classes (`CartState`, `GroceryList`, `PowerupTracker`, `HazardController`, etc.).
- `client/src/config/`: Gameplay constants (speeds, timings, collision bounds, tile dimensions). Single source of truth for all tunable values.
- `client/src/systems/`: Reusable Phaser-coupled systems (input handler, camera controller, audio manager).

## Consequences

- Domain modules must be kept free of direct Phaser dependencies so they can be unit-tested without a running Phaser instance.
- Gameplay constants must not be inlined in scene or domain files; they must be imported from `client/src/config/`.
- If multiplayer or a leaderboard is added in the future, an ADR update is required before architectural changes are made.
