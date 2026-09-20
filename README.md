# Super Cart Dasher

Super Cart Dasher is a single-player arcade game built with PhaserJS. You play as a woman pushing a grocery cart through a chaotic supermarket. Collect every item on your grocery list before time runs out, survive the hazards, and reach checkout to win.

## Gameplay Loop

1. Navigate the store and collect all items on your grocery list.
2. Avoid hazards: spilled water (slippery), slow shoppers (blocking), workers (sudden movement), kids running unpredictably.
3. Collect gem powerups to build a speed boost and temporary invincibility — fully charged triggers a Starman-style effect.
4. Bring your full cart to checkout and pay to complete the stage.

## Art Style

90s SNES pixel art. Visual language and humor draw from *Zombies Ate My Neighbors* (top-down layout, readable characters, environmental gags) and *Boogerman* (irreverent protagonist, absurdist humor).

## Running The Game

```bash
cd client
npm install
npm run dev
```

Then open the Vite URL printed in the terminal (usually `http://localhost:5173`).

## Commands

```bash
npm run lint
npm run test
npm run smoke
```

## Project Structure

- `client/src/scenes/`: Phaser scene classes (thin lifecycle wrappers)
- `client/src/domain/`: Game logic (cart state, grocery list, powerups, hazards)
- `client/src/config/`: Gameplay constants and tuning values
- `client/src/systems/`: Phaser-coupled systems (input, audio, camera)
- `assets/`: Source-of-truth asset storage by discipline
- `docs/`: Architecture, ADRs, AI workflow, requirements, and QA guidance

## AI Agent Workflow

AI agent workflows are defined in [AGENTS.md](AGENTS.md) and the `docs/ai` directory.
