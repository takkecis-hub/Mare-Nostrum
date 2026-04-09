# 🌊 Mare Nostrum — Master Game Design Document Repository

> *"Akdeniz'de en tehlikeli silah kılıç değil, fısıltıdır. Kılıç bir gemiyi batırır. Fısıltı bir imparatorluğu batırır."*

---

## 📖 Overview

**Mare Nostrum** is a turn-based Mediterranean strategy game set between the 11th and 18th centuries. Players captain a ship across the sea — trading goods, forging alliances, spreading rumours, and surviving encounters with pirates, navies, and rival merchants. The game supports both **singleplayer** (with LLM-driven NPCs) and **multiplayer** (2–8 players), and they share the same core rules.

| Detail | Value |
|---|---|
| **Setting** | Mediterranean basin, 11th–18th century |
| **Players** | 1 (singleplayer + LLM) or 2–8 (multiplayer) |
| **Turn length** | 7–12 minutes |
| **Session** | 20–40 turns (approx. 2–5 hours) |
| **Primary language** | Turkish (game design docs) |

### Design Manifesto

1. A player makes **at most three decisions** per turn.
2. Every decision is a **dilemma** — there is no correct answer.
3. A turn without a surprise is a failed turn.
4. The player who opens a spreadsheet loses — **instinct wins**.
5. Singleplayer and multiplayer are the **same game**, not separate modes.
6. The most dangerous weapon is not a sword, it is a **whisper**.

---

## 📂 Repository Structure

The repository contains both **game design documents** and a **working implementation** (mockup workspace):

```
Mare-Nostrum/
├── mockup/                          # ← Working pnpm monorepo
│   ├── packages/
│   │   ├── shared/                  # Types, constants, formulas, validators
│   │   ├── engine/                  # Pure deterministic game engine (vitest)
│   │   ├── server/                  # Express + Socket.io API, Drizzle ORM
│   │   └── client/                  # Next.js 15 + React 19 + Zustand, SVG map
│   ├── data/                        # Static JSON: ports, routes, goods, whispers, coastlines
│   ├── docker-compose.yml           # PostgreSQL 16 + Redis 7
│   └── package.json                 # Workspace scripts
├── docs/
│   └── wiki/                        # 15-page game wiki (Turkish)
├── mare_nostrum_master_v3.md        # Master design document
├── mare_nostrum_implementation_plan_v2.md  # Technical roadmap
└── (modular design docs)            # Economy, combat, map, quests, etc.
```

### Design Documents

| # | File | Status | Contents |
|---|---|---|---|
| 🟢 | [`mare_nostrum_master_v3.md`](mare_nostrum_master_v3.md) | ✅ **Active — single source of truth** | Consolidated game design document (V3). All terms, core loop, economy, combat, experience, reputation, quests, and implementation overview. |
| 1 | [`mare_nostrum_naming_review.md`](mare_nostrum_naming_review.md) | ✅ Tamamlandı | Creative naming tables and V2 review. Disco Elysium–inspired thematic names for every mechanic (Meltem, Terazi, Mürekkep, Simsar, etc.). All naming conventions fully adopted across the codebase. |
| 2 | [`mare_nostrum_experience_system.md`](mare_nostrum_experience_system.md) | ✅ Tamamlandı | Invisible experience system. Four hidden pools, ratio-based progression, threshold gates, renown titles, decay tracking — fully implemented with 57 tests. |
| 3 | [`mare_nostrum_conflict_spectrum.md`](mare_nostrum_conflict_spectrum.md) | ✅ Tamamlandı | Conflict spectrum — Physical (Demir) ✅, Social (Zehir) ✅, Economic (Kuşatma) ✅ all implemented. Rumor defense (debunk, trace, counter-rumor), stock monopoly, price sabotage, route scare, escape mechanic — 38 tests. |
| 4 | [`mare_nostrum_map_design.md`](mare_nostrum_map_design.md) | ✅ Tamamlandı | Map design. 15 ports, 29 routes, 3 chokepoints, 4 regions — all implemented in data files and rendered via Mercator-projected SVG map. |
| 5 | [`mare_nostrum_economy.md`](mare_nostrum_economy.md) | ✅ Tamamlandı | Economy deepening. Core Menşe system, saturation, seasons, kabotaj bonus, bulk discounts, smuggling system, city contracts, price visibility, first arrival bonus — all implemented with 70 tests. Commenda partnership trade remains a design-only feature. |
| 6 | [`mare_nostrum_combat_narrative.md`](mare_nostrum_combat_narrative.md) | ✅ Tamamlandı | Combat tactics (Pruva/Ateş/Manevra) ✅ with 48 tests. Escape mechanic ✅ with ship-speed + Meltem bonus. Tactic-specific loot constants defined. Singleplayer narrative architecture and quest hints implemented. |
| 7 | [`mare_nostrum_quest_chains.md`](mare_nostrum_quest_chains.md) | ✅ Tamamlandı | Four origin quest chains — all 4 quests (Kayıp Hazine, Baba'nın Şerefi, İntikam, Saf Merak) implemented with state machine, trigger system, 5 stages each, condition checks, and tavern whisper hints — 30 tests. |
| 8 | [`mare_nostrum_implementation_plan.md`](mare_nostrum_implementation_plan.md) | 📦 Superseded by [v2](mare_nostrum_implementation_plan_v2.md) | Original technical implementation plan. See v2 for the active roadmap. Phase 0+1 ✅ complete (mockup workspace with 383 tests). |

### Wiki & Mockup

| Resource | Description |
|----------|-------------|
| [`docs/wiki/`](docs/wiki/index.md) | 15-page game wiki in Turkish — synthesized reference from all design docs |
| [`mockup/`](mockup/) | Working TypeScript pnpm monorepo — playable vertical slice with 383 tests |

> **Note:** The master document (`mare_nostrum_master_v3.md`) consolidates all WIP modules into a single reference. For the latest canonical rules, always refer to the master. The individual modules contain expanded details and working notes. The `mockup/` workspace is the running implementation.

---

## 🎮 Core Game Loop

Each turn consists of two phases:

```
┌──────────────────────────────────────┐
│               ONE TURN               │
│                                      │
│  ┌────────────┐    ┌──────────────┐  │
│  │  FONDACO   │ →  │   RÜZGÂR    │  │
│  │  (port)    │    │  (sea)      │  │
│  │ Talk, hear,│    │ Orders      │  │
│  │ trade,     │    │ resolve,    │  │
│  │ prepare    │    │ automatic   │  │
│  │ 5-10 min   │    │             │  │
│  └────────────┘    └──────────────┘  │
└──────────────────────────────────────┘
```

### Fondaco (Port Phase)

While in port, players can (all optional, no fixed order):

- **Coffeehouse** — Hear 3 whispers tailored to your experience profile. Perform social actions: eavesdrop, spread rumours, debunk rumours, investigate sources.
- **Market** — Buy/sell origin-specific goods. Prices shown as a five-dot indicator (●●●○○), no exact numbers.
- **Negotiation** — Chat with other players (multiplayer) or receive LLM NPC messages (singleplayer).
- **Shipyard** — Repair or upgrade your ship.

### Orders: Three Choices

```
WHERE?    [pick a port on the map]
HOW?      Tramontana (normal) / Kabotaj (coastal, slow, safe) / Fortuna (open sea, fast, risky)
INTENT?   Kervan (trade) / Kara Bayrak (hunt) / Pusula (explore) / Duman (silent passage)
```

**4 intents × 3 routes = 12 strategic combinations.**

---

## ⚔️ Conflict Spectrum

Conflict in Mare Nostrum operates across three dimensions:

| Type | Name | Arena | Speed | Risk |
|---|---|---|---|---|
| **Physical** | Demir (Iron) | At sea | Instant | High |
| **Social** | Zehir (Poison) | In port / coffeehouse | Slow (2–3 turns) | Low |
| **Economic** | Kuşatma (Siege) | In the market | Medium | Medium |

The most devastating strategies **combine all three**: a whispered rumour weakens the target's reputation, a stock buyout starves them of goods, and only then — if needed — a sword is drawn.

### Combat Tactics (Rock-Paper-Scissors)

When battle occurs, both sides secretly choose a tactic:

- **⚔️ Pruva (Boarding)** — Close in and board. Capture the ship whole, but risk your own.
- **🔥 Ateş (Ranged Fire)** — Keep distance, rain arrows and fire. Safe but loot is reduced.
- **💨 Manevra (Evasion)** — Use the wind, outmanoeuvre the enemy. Escape or set a trap.

**Pruva beats Ateş, Ateş beats Manevra, Manevra beats Pruva.**

---

## 🧠 Invisible Experience System

There are no visible skill points, XP bars, or level-ups. Instead, four hidden pools track what the player has done:

| Pool | Thematic Name | Domain |
|---|---|---|
| **Meltem** (Sea breeze) | Sea | Storms, battles, seamanship, escape |
| **Terazi** (Scales) | Market | Trade, pricing, bargaining, stock sense |
| **Mürekkep** (Ink) | Divan | Negotiation, diplomacy, rumour management |
| **Simsar** (Broker) | Shadow | Smuggling, espionage, intelligence, deception |

Players **feel** the effects but can never **measure** them:
- A high-Meltem captain survives storms more easily and hears nautical intelligence at the coffeehouse.
- A high-Terazi merchant reads price trends more clearly and resists market manipulation.
- A high-Mürekkep diplomat gets warmer receptions from city governors and debunks rumours easily.
- A high-Simsar operative smuggles without getting caught and detects who spread a rumour.

> *"The best skill system is the one the player is never aware of."*

---

## 🗺️ Map & World

The Mediterranean is divided into **15 ports** across 4 regions, connected by **29 routes** with **3 strategic chokepoints**:

- **Western Mediterranean** — Barselona, Marsilya, Cenova, Cezayir
- **Central Mediterranean** — Tunus, Palermo, Ragusa
- **Eastern Mediterranean** — Venedik, İstanbul, Girit, Kıbrıs
- **Levant & North Africa** — Beyrut, İskenderiye, Trablus

**Chokepoints** (guaranteed encounters):
1. **Sicily Strait** (Palermo ↔ Tunus)
2. **Aegean Gate** (Girit ↔ İstanbul)
3. **Otranto** (Ragusa ↔ Venedik)

Each port has a unique personality: home faction, specialty goods it produces cheaply, goods it craves at high prices, and special features (shipyard discounts, smuggling ease, military patrols, etc.).

---

## 💰 Economy — Origin System

Goods are not generic. Every item carries an **origin** (Menşe) that determines its value at each port:

| Category | Example Origins |
|---|---|
| **Food (Yemek)** | Sicilya Buğdayı, Provence Şarabı, Girit Zeytinyağı, Kıbrıs Tuzu, Tunus Zeytinyağı, Ragusa Tuzu |
| **Luxury (Lüks)** | Mısır Baharatları, Murano Camı, Doğu İpeği, Ligurya Mercanı, Sahra Altını, Halep Sabunu |
| **War (Savaş)** | Katalan Demiri, Malta Çeliği, Osmanlı Silahı, Lübnan Sediri |

**Key principle:** If everyone takes the same route, the destination market saturates and prices crash. This naturally diversifies trade routes and creates information asymmetry — knowing *where* prices are good becomes as valuable as the cargo itself.

---

## 🏆 Reputation & Titles

Players earn visible **titles** (Ünler) based on a hidden combination of experience depth + public rumours:

| Title | Thematic Name | Meaning |
|---|---|---|
| Master Trader | **Altın Parmak** (Golden Finger) | Everything they touch turns to gold |
| Warrior | **Demir Pruva** (Iron Prow) | Unbreakable ship's bow |
| Diplomat | **İpek Dil** (Silk Tongue) | Can talk a snake out of its hole |
| Shadow Operator | **Hayalet Pala** (Ghost Cutlass) | Invisible but everywhere |
| Trustworthy | **Mühürlü Söz** (Sealed Word) | Their face is their bond |
| Traitor | **Akrep** (Scorpion) | Silent and lethal |
| Generous | **Açık El** (Open Hand) | Gives freely to all |
| Daredevil | **Deli Rüzgâr** (Wild Wind) | Fearless in the face of danger |

**Victory condition:** Become an **Efsane** (Legend) — the most talked-about name in the Mediterranean.

---

## 📜 Singleplayer Quest Chains

Four origin stories, each with 5 stages and ~25–30 turns to complete:

1. **Kayıp Hazine** (Lost Treasure) — *"The Legacy Beneath the Sea"* — Chase fragments of a treasure map across the Mediterranean. Inspired by real shipwrecks like Uluburun and Antikythera.
2. **Baba'nın Şerefi** (Father's Honour) — Restore a disgraced family name through trade, diplomacy, or force.
3. **İntikam** (Revenge) — Hunt down the pirate who destroyed your life. But when you find them, the truth is more complicated.
4. **Saf Merak** (Pure Curiosity) — A scholar's journey to map the unknown edges of the Mediterranean.

Quest clues appear as **⚓ whispers** in the coffeehouse. Players can follow or ignore them — the game never forces a quest.

---

## 🛠️ Technical Implementation

The game is implemented as a **pnpm monorepo** under `mockup/`:

| Layer | Technology |
|---|---|
| **Client** | Next.js 15, React 19, Zustand stores, Socket.io-client, interactive SVG map |
| **Server** | Express 4, Socket.io 4, Drizzle ORM (PostgreSQL 16), Redis 7 |
| **Engine** | Pure TypeScript, deterministic functions, injectable RNG, vitest (383 tests) |
| **Shared** | TypeScript types, constants, formulas, validators (no runtime deps) |
| **LLM** | Claude API (mock whispers with static fallback pool for now) |
| **Infrastructure** | Docker Compose (PostgreSQL + Redis), pnpm workspaces, ESM modules |

### Quick Start

```bash
cd mockup/
pnpm install          # Install all dependencies
pnpm dev              # Start server (localhost:4000) + client (localhost:3000)
pnpm test             # Run vitest — 383 tests across 10 test files (engine)
pnpm typecheck        # TypeScript compiler checks (4 packages)
pnpm build            # Production build (all packages)
```

### Engine Modules

| Module | Description |
|--------|-------------|
| `combat.ts` | Rock-paper-scissors tactics (Pruva/Ateş/Manevra), d6 dice, Meltem bonus, ship synergies |
| `economy.ts` | Origin-based pricing, port saturation with decay, automatic cargo selling |
| `experience.ts` | Hidden experience gains per intent, ratio-based renown, decay/contradiction tracking |
| `rumor.ts` | Automatic rumor generation, graph-based spread across routes, strength decay |
| `scoring.ts` | Victory score = rumor spread × 2 + renown titles × 15, Efsane threshold = 100 |
| `shipyard.ts` | Repair cost calculation, tersane discount (25%), partial repair support |
| `turn-resolver.ts` | Full turn cycle: movement, combat, trade, rumor spread, experience, renown decay |

### Data Files

| File | Contents |
|------|----------|
| `ports.json` | 15 ports with coordinates, produces/desires, specials, trivia |
| `routes.json` | 29 routes (9 tramontana, 7 kabotaj, 12 fortuna, 1 uzun_kabotaj) |
| `goods.json` | 17 origin goods (7 yemek, 6 lüks, 4 savaş) |
| `whispers.json` | Static fallback whisper pool per port |
| `coastlines.json` | SVG coastline paths for map rendering |
| `port-geo.json` | Real lat/lon coordinates for Mercator projection |

Development is planned in multiple phases, starting with a **playable singleplayer demo** and expanding toward multiplayer alpha.

---

## 🤝 How to Navigate This Repository

1. **Start with** [`mare_nostrum_master_v3.md`](mare_nostrum_master_v3.md) — the single source of truth for the entire game design.
2. **Browse the wiki** at [`docs/wiki/`](docs/wiki/index.md) — 15-page Turkish reference synthesized from all design docs.
3. **Explore the mockup** at [`mockup/`](mockup/) — the working TypeScript implementation.
4. **Dive into modules** for expanded details on specific systems (economy, combat, map, quests, etc.).
5. **WIP modules** may contain working notes and ideas not yet consolidated into the master document.
6. **All design documents are written in Turkish.** The master document includes a full glossary of all game terms.

---

## 📝 Glossary (Quick Reference)

| Term | Meaning |
|---|---|
| **Fondaco** | Port phase — talk, trade, prepare |
| **Rüzgâr** | Sea phase — orders resolve |
| **Kervan** | Trade intent |
| **Kara Bayrak** | Hunt intent (piracy) |
| **Pusula** | Explore intent |
| **Duman** | Silent passage intent |
| **Tramontana** | Normal route (1 turn) |
| **Kabotaj** | Coastal route (2 turns, safe) |
| **Fortuna** | Open sea route (1 turn, risky) |
| **Feluka** | Small ship — fast, low cargo, power 2 |
| **Karaka** | Merchant ship — medium, high cargo, power 2 |
| **Kadırga** | War galley — slow, low cargo, power 3 |
| **Meltem** | Sea experience pool |
| **Terazi** | Market experience pool |
| **Mürekkep** | Diplomacy experience pool |
| **Simsar** | Shadow experience pool |
| **Tanıdık Yüz** | Positive city relationship |
| **Yabancı** | Neutral city relationship |
| **Kem Göz** | Negative city relationship |
| **Efsane** | Victory condition — become the most storied name |

---

## 📄 License

This repository contains game design documents for Mare Nostrum. Please refer to the repository owner for licensing information.
