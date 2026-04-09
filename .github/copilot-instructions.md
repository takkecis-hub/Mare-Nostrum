# Mare Nostrum — Copilot Instructions

## Project Overview

Mare Nostrum is a turn-based Mediterranean trading/diplomacy strategy game (11th–18th century). It is built as a TypeScript pnpm monorepo under the `mockup/` directory.

## Repository Layout

```
mockup/
├── packages/
│   ├── shared/    — Types, constants, formulas, validators (no runtime deps)
│   ├── engine/    — Pure, deterministic game logic (combat, economy, experience, rumor, scoring, shipyard, turn-resolver)
│   ├── server/    — Express + Socket.io API, Drizzle ORM (PostgreSQL), LLM integration
│   └── client/    — Next.js 15 + React 19 + Zustand stores, SVG map, game UI
├── data/          — Static JSON: ports.json, routes.json, goods.json, whispers.json, coastlines.json
├── package.json   — Root workspace scripts
└── pnpm-workspace.yaml
```

## Build & Test Commands

All commands run from the `mockup/` directory:

- `pnpm install` — install all dependencies
- `pnpm test` — run vitest across all packages
- `pnpm typecheck` — run TypeScript type-checking across all packages
- `pnpm build` — build all packages (including Next.js client)
- `pnpm dev` — start server + client concurrently for local development

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Client | Next.js 15, React 19, Zustand, Socket.io-client, SVG map |
| Server | Express 4, Socket.io 4, Drizzle ORM, PostgreSQL 16, Redis 7 |
| Engine | Pure TypeScript, vitest, deterministic functions |
| Shared | TypeScript types, constants, formulas, validators |
| LLM | Claude API (mock whispers for now) |

## Game Terminology (Turkish)

| Term | English | Domain |
|------|---------|--------|
| Fondaco | Port phase | Core loop |
| Rüzgâr | Sea/resolution phase | Core loop |
| Emir | Orders | Core loop |
| Kervan | Trade intent | Intent |
| Kara Bayrak | Hunt/pirate intent | Intent |
| Pusula | Explore intent | Intent |
| Duman | Silent passage intent | Intent |
| Tramontana | Normal route (1 turn) | Route |
| Kabotaj | Coastal route (2 turns, safe) | Route |
| Fortuna | Open sea route (1 turn, risky) | Route |
| Feluka | Small ship | Ship |
| Karaka | Merchant ship | Ship |
| Kadırga | War galley | Ship |
| Meltem | Sea experience | Experience |
| Terazi | Market experience | Experience |
| Mürekkep | Diplomacy experience | Experience |
| Simsar | Shadow experience | Experience |
| Efsane | Legend (victory condition) | Scoring |

## Key Design Principles

1. Maximum 3 decisions per turn — no analysis paralysis
2. Every decision is a dilemma — no "correct" answer
3. Hidden experience system — players feel growth but cannot measure it
4. Singleplayer and multiplayer share the same engine
5. The most dangerous weapon is a whisper, not a sword

## Code Conventions

- All game engine functions are **pure and deterministic** (injectable RNG)
- Constants are centralized in `shared/src/constants/index.ts` — no magic numbers
- Types are in `shared/src/types/index.ts` — single source of truth
- Test files are co-located with source (e.g., `combat.ts` / `combat.test.ts`)
- Design documents are written in Turkish
- All packages use ESM (`"type": "module"`)
- Package versions follow semver and are currently at `0.0.1`

## Data Integrity Rules

- Every port-produced good must have at least 1 port that desires it
- Route `from`/`to` must reference valid port IDs
- Goods must reference valid `originPort` IDs
- Chokepoint routes must have elevated `encounterChance`
