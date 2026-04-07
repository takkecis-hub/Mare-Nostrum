import { describe, expect, it } from 'vitest';
import { resolveTurn } from '../packages/engine/src/turn-resolver.js';
import ports from '../data/ports.json';
import routes from '../data/routes.json';
import goods from '../data/goods.json';
import type { GameState } from '../packages/shared/src/types/index.js';

const baseState: GameState = {
  turn: 1,
  season: 'yaz',
  lastWhispers: [],
  activeRumors: [],
  player: {
    id: 'player-1',
    name: 'Kaptan Leyla',
    gold: 200,
    currentPortId: 'venedik',
    renown: [],
    cargo: [
      {
        goodId: 'murano_cami',
        name: 'Murano Camı',
        quantity: 1,
        originPort: 'venedik',
        purchasePrice: 40,
      },
    ],
    ship: {
      type: 'karaka',
      cargoCapacity: 5,
      power: 2,
      durability: 100,
    },
    experience: {
      meltem: 1,
      terazi: 2,
      murekkep: 1,
      simsar: 0,
    },
  },
};

describe('resolveTurn', () => {
  it('moves player and sells profitable cargo on a trade turn', () => {
    const result = resolveTurn({
      state: baseState,
      order: {
        destinationPort: 'tunus',
        routeType: 'fortuna',
        intent: 'kervan',
      },
      ports,
      routes,
      goods,
    });

    expect(result.nextState.player.currentPortId).toBe('tunus');
    expect(result.nextState.player.gold).toBeGreaterThan(200);
  });

  it('creates rumors after a piracy turn', () => {
    const result = resolveTurn({
      state: baseState,
      order: {
        destinationPort: 'istanbul',
        routeType: 'fortuna',
        intent: 'kara_bayrak',
      },
      ports,
      routes,
      goods,
      tactic: 'pruva',
    });

    expect(result.nextState.activeRumors.length).toBeGreaterThan(0);
    expect(result.combat).toBeDefined();
  });
});
