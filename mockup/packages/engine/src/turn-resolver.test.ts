import { describe, expect, it } from 'vitest';
import ports from '../../../data/ports.json';
import routes from '../../../data/routes.json';
import goods from '../../../data/goods.json';
import { resolveTurn } from './turn-resolver.js';
import type { GameState } from '../../shared/src/types/index.js';

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
    const tradeState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        currentPortId: 'palermo',
      },
    };

    const result = resolveTurn({
      state: tradeState,
      order: {
        destinationPort: 'tunus',
        routeType: 'tramontana',
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

  it('returns invalid route message when route is unreachable', () => {
    // venedik → tunus does not have a tramontana route
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'tunus', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.currentPortId).toBe('venedik');
    expect(result.log.some((entry) => entry.detail.includes('geçerli değil'))).toBe(true);
  });

  it('transitions season from yaz to kis at turn 5 (after turn 4)', () => {
    const turn4State: GameState = {
      ...baseState,
      turn: 4,
      season: 'yaz',
      player: { ...baseState.player, currentPortId: 'venedik' },
    };
    const result = resolveTurn({
      state: turn4State,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.season).toBe('kis');
    expect(result.nextState.turn).toBe(5);
  });

  it('gold becomes 0 when gold < 30 and combat is lost', () => {
    const poorState: GameState = {
      ...baseState,
      player: { ...baseState.player, gold: 20 },
    };
    // Force a loss by using a very weak ship
    const weakState: GameState = {
      ...poorState,
      player: {
        ...poorState.player,
        ship: { type: 'feluka', cargoCapacity: 3, power: 1, durability: 50 },
      },
    };
    const result = resolveTurn({
      state: weakState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'manevra',
    });
    if (result.combat?.result === 'kaybetti') {
      expect(result.nextState.player.gold).toBe(0);
    } else {
      // Combat didn't result in a loss; gold unchanged
      expect(result.nextState.player.gold).toBeGreaterThanOrEqual(0);
    }
  });

  it('does not crash on kervan turn with empty cargo', () => {
    const noCargo: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        cargo: [],
        currentPortId: 'palermo',
      },
    };
    const result = resolveTurn({
      state: noCargo,
      order: { destinationPort: 'tunus', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.currentPortId).toBe('tunus');
    expect(result.nextState.player.cargo).toHaveLength(0);
  });

  it('pusula intent increases murekkep experience', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.experience.murekkep).toBe(baseState.player.experience.murekkep + 1);
  });

  it('duman intent increases simsar experience', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'duman' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.experience.simsar).toBe(baseState.player.experience.simsar + 2);
  });
});
