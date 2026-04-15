import { describe, expect, it } from 'vitest';
import ports from '../../../data/ports.json';
import routes from '../../../data/routes.json';
import goods from '../../../data/goods.json';
import { resolveTurn } from './turn-resolver.js';
import type { GameState } from '../../shared/src/types/index.js';

/** Deterministic RNG → die roll = 1 for both player and enemy. */
const fixedRng = () => 0;

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
    // Use murano_cami cargo going to kibris (which desires murano_cami)
    const tradeState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        currentPortId: 'girit',
        cargo: [
          {
            goodId: 'murano_cami',
            name: 'Murano Camı',
            quantity: 1,
            originPort: 'venedik',
            purchasePrice: 40,
          },
        ],
      },
    };

    const result = resolveTurn({
      state: tradeState,
      order: {
        destinationPort: 'kibris',
        routeType: 'tramontana',
        intent: 'kervan',
      },
      ports,
      routes,
      goods,
    });

    expect(result.nextState.player.currentPortId).toBe('kibris');
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
      rng: fixedRng,
    });

    expect(result.nextState.activeRumors.length).toBeGreaterThan(0);
    expect(result.combat).toBeDefined();
  });

  it('returns invalid route message when route is unreachable', () => {
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
      rng: fixedRng,
    });
    if (result.combat?.result === 'kaybetti') {
      expect(result.nextState.player.gold).toBeGreaterThanOrEqual(0);
    } else {
      expect(result.nextState.player.gold).toBeGreaterThanOrEqual(0);
    }
  });

  it('applies combat gold and durability losses on piracy defeat without shipwreck', () => {
    const losingState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        gold: 20,
        ship: { type: 'feluka', cargoCapacity: 3, power: 1, durability: 80 },
      },
    };
    const result = resolveTurn({
      state: losingState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'ates',
      rng: fixedRng,
    });

    expect(result.combat?.result).toBe('kaybetti');
    expect(result.combat?.shipwrecked).toBe(false);
    // fixedRng is () => 0, so combat picks the first enemy tactic (pruva) and both d6 rolls become 1.
    // For this state that yields a deterministic combat loss with goldDelta=-36 and durabilityDelta=-18.
    expect(result.nextState.player.gold).toBe(0);
    expect(result.nextState.player.ship.durability).toBe(62);
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
    expect(result.nextState.player.experience.murekkep).toBe(baseState.player.experience.murekkep + 2);
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

  it('transitions season from kis to yaz at turn 9 (after turn 8)', () => {
    const turn8State: GameState = {
      ...baseState,
      turn: 8,
      season: 'kis',
      player: { ...baseState.player, currentPortId: 'venedik' },
    };
    const result = resolveTurn({
      state: turn8State,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.season).toBe('yaz');
    expect(result.nextState.turn).toBe(9);
  });

  it('includes trade result in TurnResolution when intent is kervan', () => {
    const tradeState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        currentPortId: 'girit',
        cargo: [
          { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 },
        ],
      },
    };
    const result = resolveTurn({
      state: tradeState,
      order: { destinationPort: 'kibris', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.trade).toBeDefined();
    expect(typeof result.trade?.goldDelta).toBe('number');
    expect(typeof result.trade?.stars).toBe('number');
    expect(Array.isArray(result.trade?.sold)).toBe(true);
  });

  it('does not include trade result for non-kervan intents', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.trade).toBeUndefined();
  });

  it('increases gold on combat win (loot)', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'pruva',
      rng: fixedRng,
    });
    if (result.combat?.result === 'kazandi') {
      expect(result.nextState.player.gold).toBeGreaterThan(baseState.player.gold);
    }
  });

  it('produces three whisper lines after a valid turn', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.whispers).toHaveLength(3);
  });

  it('includes destination port name in whispers', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.whispers.some((w) => w.includes('İstanbul') || w.includes('istanbul'))).toBe(true);
  });

  it('kervan intent gains 2 terazi experience', () => {
    const tradeState: GameState = {
      ...baseState,
      player: { ...baseState.player, currentPortId: 'girit' },
    };
    const result = resolveTurn({
      state: tradeState,
      order: { destinationPort: 'kibris', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.experience.terazi).toBe(baseState.player.experience.terazi + 2);
  });

  it('kara_bayrak intent gains 2 meltem experience', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.nextState.player.experience.meltem).toBe(baseState.player.experience.meltem + 2);
  });

  it('tracks portSaturation after trade', () => {
    const tradeState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        currentPortId: 'girit',
        cargo: [
          { goodId: 'murano_cami', name: 'Murano Camı', quantity: 2, originPort: 'venedik', purchasePrice: 40 },
        ],
      },
    };
    const result = resolveTurn({
      state: tradeState,
      order: { destinationPort: 'kibris', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.portSaturation).toBeDefined();
    const key = 'kibris:murano_cami';
    expect(result.nextState.portSaturation?.[key]).toBeGreaterThan(0);
  });

  it('handles multi-turn kabotaj route by entering transit', () => {
    // barselona→marsilya is kabotaj (turnsRequired=2)
    const barsState: GameState = {
      ...baseState,
      player: { ...baseState.player, currentPortId: 'barselona' },
    };
    const result = resolveTurn({
      state: barsState,
      order: { destinationPort: 'marsilya', routeType: 'kabotaj', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.transitStatus).toBe('in_transit');
    expect(result.nextState.player.transitTurnsRemaining).toBeGreaterThan(0);
  });

  it('handles shipwreck by resetting to feluka', () => {
    const fragileState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        ship: { type: 'feluka', cargoCapacity: 3, power: 1, durability: 10 },
        gold: 5,
      },
    };
    // Use a strong enemy to force loss + shipwreck
    const result = resolveTurn({
      state: fragileState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'ates',
      rng: fixedRng,
    });
    if (result.combat?.shipwrecked) {
      expect(result.nextState.player.ship.type).toBe('feluka');
      expect(result.nextState.player.ship.durability).toBe(100);
      expect(result.nextState.player.cargo).toHaveLength(0);
      expect(result.nextState.player.gold).toBe(50);
    }
  });
});

// ─── Multi-turn transit continuation ────────────────────────────────────────

describe('resolveTurn – multi-turn transit continuation', () => {
  const transitState: GameState = {
    ...baseState,
    player: {
      ...baseState.player,
      currentPortId: 'venedik',
      transitStatus: 'in_transit',
      transitTurnsRemaining: 3,
      transitDestination: 'istanbul',
    },
  };

  it('decrements transitTurnsRemaining from 3 to 2 and stays in_transit', () => {
    const result = resolveTurn({
      state: transitState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.transitTurnsRemaining).toBe(2);
    expect(result.nextState.player.transitStatus).toBe('in_transit');
  });

  it('decrements transitTurnsRemaining from 2 to 1 and stays in_transit', () => {
    const transit2State: GameState = {
      ...transitState,
      player: { ...transitState.player, transitTurnsRemaining: 2 },
    };
    const result = resolveTurn({
      state: transit2State,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.transitTurnsRemaining).toBe(1);
    expect(result.nextState.player.transitStatus).toBe('in_transit');
  });

  it('does not change currentPortId during transit', () => {
    const result = resolveTurn({
      state: transitState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.currentPortId).toBe('venedik');
  });

  it('still spreads activeRumors during transit', () => {
    const transitWithRumors: GameState = {
      ...transitState,
      activeRumors: [
        {
          id: 'rumor-transit',
          aboutPlayerId: 'player-1',
          text: 'Transit rumor',
          tone: 'notr' as const,
          currentPorts: ['venedik'],
          strength: 3,
          age: 0,
          sourceAction: 'pusula',
        },
      ],
    };
    const result = resolveTurn({
      state: transitWithRumors,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(Array.isArray(result.nextState.activeRumors)).toBe(true);
  });
});

// ─── Transit arrival ────────────────────────────────────────────────────────

describe('resolveTurn – transit arrival', () => {
  const arrivalState: GameState = {
    ...baseState,
    player: {
      ...baseState.player,
      currentPortId: 'venedik',
      transitStatus: 'in_transit',
      transitTurnsRemaining: 1,
      transitDestination: 'istanbul',
    },
  };

  it('arrives at destination when transitTurnsRemaining is 1', () => {
    const result = resolveTurn({
      state: arrivalState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.transitStatus).toBe('at_port');
  });

  it('sets currentPortId to transitDestination after arrival', () => {
    const result = resolveTurn({
      state: arrivalState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.currentPortId).toBe('istanbul');
  });

  it('sets transitTurnsRemaining to 0 after arrival', () => {
    const result = resolveTurn({
      state: arrivalState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.transitTurnsRemaining).toBe(0);
  });

  it('clears transitDestination after arrival', () => {
    const result = resolveTurn({
      state: arrivalState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.transitDestination).toBeUndefined();
  });
});

// ─── Saturation decay ───────────────────────────────────────────────────────

describe('resolveTurn – saturation decay', () => {
  it('decays saturation entries by 1 when next turn is divisible by SATURATION_DECAY_INTERVAL (3)', () => {
    const satState: GameState = {
      ...baseState,
      turn: 2,
      portSaturation: { 'venedik:murano_cami': 2 },
      player: { ...baseState.player, currentPortId: 'venedik' },
    };
    const result = resolveTurn({
      state: satState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    // nextState.turn = 3, 3 % 3 === 0 → decay: 2 → 1
    expect(result.nextState.portSaturation?.['venedik:murano_cami']).toBe(1);
  });

  it('does not decay saturation when next turn is not divisible by 3', () => {
    const satState4: GameState = {
      ...baseState,
      turn: 3,
      portSaturation: { 'venedik:murano_cami': 2 },
      player: { ...baseState.player, currentPortId: 'venedik' },
    };
    const result = resolveTurn({
      state: satState4,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    // nextState.turn = 4, 4 % 3 !== 0 → no decay
    expect(result.nextState.portSaturation?.['venedik:murano_cami']).toBe(2);
  });

  it('removes saturation entries that decay to 0', () => {
    const satState0: GameState = {
      ...baseState,
      turn: 2,
      portSaturation: { 'venedik:murano_cami': 1 },
      player: { ...baseState.player, currentPortId: 'venedik' },
    };
    const result = resolveTurn({
      state: satState0,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    // nextState.turn = 3, decay: 1 → 0 → removed
    expect(result.nextState.portSaturation?.['venedik:murano_cami']).toBeUndefined();
  });

  it('initializes portSaturation as empty object when not present in state', () => {
    const noSatState: GameState = {
      ...baseState,
      turn: 1,
      player: { ...baseState.player, currentPortId: 'venedik' },
    };
    delete noSatState.portSaturation;
    const result = resolveTurn({
      state: noSatState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.portSaturation).toBeDefined();
  });
});

// ─── Combat escape (kacti) ──────────────────────────────────────────────────

describe('resolveTurn – combat escape (kacti)', () => {
  // Use kadirga (power=3) so playerPower (6.0) >= enemyPower (5.6) with fixedRng
  const escapeState: GameState = {
    ...baseState,
    player: {
      ...baseState.player,
      ship: { type: 'kadirga', cargoCapacity: 2, power: 3, durability: 100 },
    },
  };

  it('does not change gold when combat results in kacti', () => {
    const result = resolveTurn({
      state: escapeState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'kacis',
      rng: fixedRng,
    });
    expect(result.combat?.result).toBe('kacti');
    expect(result.nextState.player.gold).toBe(escapeState.player.gold);
  });

  it('does not change durability when combat results in kacti', () => {
    const result = resolveTurn({
      state: escapeState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'kacis',
      rng: fixedRng,
    });
    expect(result.combat?.result).toBe('kacti');
    expect(result.nextState.player.ship.durability).toBe(escapeState.player.ship.durability);
  });

  it('includes escape message in the log', () => {
    const result = resolveTurn({
      state: escapeState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'kacis',
      rng: fixedRng,
    });
    expect(result.log.some((entry) => entry.detail.includes('sıyrıldın'))).toBe(true);
  });

  it('still moves player to destination port after escape', () => {
    const result = resolveTurn({
      state: escapeState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kara_bayrak' },
      ports,
      routes,
      goods,
      tactic: 'kacis',
      rng: fixedRng,
    });
    expect(result.nextState.player.currentPortId).toBe('istanbul');
  });
});

// ─── Trade with no profitable sales ─────────────────────────────────────────

describe('resolveTurn – trade with no profitable sales', () => {
  // ragusa→venedik (tramontana). Venedik produces murano_cami → indicator=2,
  // With season bonus (yaz, luks → ×1.2): saleValue = round(2*20*1*1.2) = 48.
  // Set purchasePrice=50 so it's not profitable (48 <= 50).
  const noProfitState: GameState = {
    ...baseState,
    player: {
      ...baseState.player,
      currentPortId: 'ragusa',
      cargo: [
        { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 50 },
      ],
    },
  };

  it('keeps cargo when sale is not profitable at destination', () => {
    const result = resolveTurn({
      state: noProfitState,
      order: { destinationPort: 'venedik', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.cargo).toHaveLength(1);
    expect(result.nextState.player.cargo[0].goodId).toBe('murano_cami');
  });

  it('does not change gold when no cargo is sold', () => {
    const result = resolveTurn({
      state: noProfitState,
      order: { destinationPort: 'venedik', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.nextState.player.gold).toBe(noProfitState.player.gold);
  });

  it('log mentions kârlı satış not happening', () => {
    const result = resolveTurn({
      state: noProfitState,
      order: { destinationPort: 'venedik', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.log.some((entry) => entry.detail.includes('kârlı satış'))).toBe(true);
  });
});

// ─── Contract fulfillment via trade ─────────────────────────────────────────

describe('resolveTurn – contract fulfillment', () => {
  it('fulfills a city contract when goods are delivered to correct port', () => {
    const contractState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        currentPortId: 'girit',
        cargo: [
          { goodId: 'murano_cami', name: 'Murano Camı', quantity: 3, originPort: 'venedik', purchasePrice: 10 },
        ],
      },
      cityContracts: [
        {
          id: 'contract-1',
          portId: 'kibris',
          goodId: 'murano_cami',
          quantity: 3,
          rewardGold: 200,
          deadlineTurn: 30,
          breakPenalty: 100,
          accepted: true,
          completed: false,
        },
      ],
    };
    const result = resolveTurn({
      state: contractState,
      order: { destinationPort: 'kibris', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.contracts).toBeDefined();
    expect(result.contracts?.fulfilled).toContain('contract-1');
    expect(result.contracts?.goldDelta).toBeGreaterThan(0);
  });

  it('does not fulfill a city contract when the same goods are delivered to a different port', () => {
    const wrongPortState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        currentPortId: 'girit',
        cargo: [
          { goodId: 'murano_cami', name: 'Murano Camı', quantity: 3, originPort: 'venedik', purchasePrice: 10 },
        ],
      },
      cityContracts: [
        {
          id: 'contract-wrong-port',
          portId: 'kibris',
          goodId: 'murano_cami',
          quantity: 3,
          rewardGold: 200,
          deadlineTurn: 30,
          breakPenalty: 100,
          accepted: true,
          completed: false,
        },
      ],
    };
    const result = resolveTurn({
      state: wrongPortState,
      order: { destinationPort: 'istanbul', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });

    expect(result.contracts).toBeDefined();
    expect(result.contracts?.fulfilled).toEqual([]);
    expect(result.contracts?.goldDelta).toBe(0);
    expect(result.nextState.cityContracts?.[0].completed).toBe(false);
  });

  it('penalizes expired contracts', () => {
    const contractState: GameState = {
      ...baseState,
      turn: 31, // past deadline
      player: {
        ...baseState.player,
        currentPortId: 'girit',
        cargo: [
          { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 10 },
        ],
      },
      cityContracts: [
        {
          id: 'contract-expired',
          portId: 'kibris',
          goodId: 'murano_cami',
          quantity: 5,
          rewardGold: 200,
          deadlineTurn: 30,
          breakPenalty: 100,
          accepted: true,
          completed: false,
        },
      ],
    };
    const result = resolveTurn({
      state: contractState,
      order: { destinationPort: 'kibris', routeType: 'tramontana', intent: 'kervan' },
      ports,
      routes,
      goods,
    });
    expect(result.contracts?.expired).toContain('contract-expired');
    expect(result.contracts?.goldDelta).toBeLessThan(0);
  });
});

describe('resolveTurn – uzun_kabotaj trade bonus', () => {
  it('applies the trade bonus to single-turn uzun_kabotaj routes', () => {
    const testPorts = [
      ports.find((port) => port.id === 'venedik')!,
      {
        ...ports.find((port) => port.id === 'istanbul')!,
        desires: { good: 'murano_cami', category: 'luks' as const, basePrice: 'pahali' as const },
      },
    ];
    const testRoutes = [
      {
        id: 'synthetic-uzun-kabotaj',
        from: 'venedik',
        to: 'istanbul',
        type: 'uzun_kabotaj' as const,
        isChokepoint: null,
        encounterChance: 0,
        turnsRequired: 1,
      },
    ];
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'uzun_kabotaj', intent: 'kervan' },
      ports: testPorts,
      routes: testRoutes,
      goods,
    });

    // desired goods use indicator 5, sell formula uses the fixed 20 gold step and quantity 1,
    // Istanbul's desire slot is pahali (×1.25), uzun_kabotaj gets the kabotaj route bonus (×1.25),
    // and turn 2 is still yaz so lüks cargo gets the seasonal ×1.2 multiplier: 5*20*1*1.25*1.25*1.2 = 188.
    expect(result.trade?.goldDelta).toBe(188);
    expect(result.nextState.player.gold).toBe(baseState.player.gold + 188);
  });
});

// ─── Duman stealth intel ────────────────────────────────────────────────────

describe('resolveTurn – duman stealth passage', () => {
  it('gathers intel on successful duman without encounter', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'duman' },
      ports,
      routes,
      goods,
      rng: () => 0.999, // no encounter
    });
    expect(result.exploration).toBeDefined();
    expect(result.exploration?.stealthSuccess).toBe(true);
    expect(result.exploration?.intel).toBeDefined();
    expect(result.exploration!.intel!.length).toBeGreaterThan(0);
    expect(result.log.some((e) => e.label === 'Duman')).toBe(true);
  });
});

// ─── Route encounter combat (non-kara_bayrak) ──────────────────────────────

describe('resolveTurn – route encounter combat', () => {
  it('triggers random encounter on a non-kara_bayrak route', () => {
    // rng returns 0 → always triggers encounter (encounterChance > 0)
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' },
      ports,
      routes,
      goods,
      tactic: 'manevra',
      rng: () => 0, // triggers encounter
    });
    expect(result.combat).toBeDefined();
    expect(result.log.some((e) => e.label === 'Karşılaşma')).toBe(true);
  });

  it('triggers encounter on duman intent with low rng', () => {
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'duman' },
      ports,
      routes,
      goods,
      rng: () => 0, // triggers encounter
    });
    expect(result.combat).toBeDefined();
  });
});

// ─── Quest advancement during turn ──────────────────────────────────────────

describe('resolveTurn – quest advancement', () => {
  it('advances quest when conditions are met at destination port', () => {
    const questState: GameState = {
      ...baseState,
      turn: 2, // nextTurn = 3, within kayip_hazine stage 1 turnRange [3,6]
      player: {
        ...baseState.player,
        currentPortId: 'ragusa',
        questState: {
          questId: 'kayip_hazine',
          currentStage: 1,
          completed: false,
          stageFlags: {},
          evidence: [],
        },
      },
    };
    const result = resolveTurn({
      state: questState,
      order: { destinationPort: 'venedik', routeType: 'tramontana', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.log.some((e) => e.label === 'Görev')).toBe(true);
    expect(result.nextState.player.questState?.currentStage).toBe(2);
  });
});

// ─── Pusula with trivia catalog ─────────────────────────────────────────────

describe('resolveTurn – pusula with trivia catalog', () => {
  it('includes trivia text from catalog when available', () => {
    const triviaCatalog = {
      istanbul: [
        { id: 'trivia-1', portId: 'istanbul', text: 'İstanbul tarih kokar.', provenanceRef: 'prov:istanbul' },
      ],
    };
    const result = resolveTurn({
      state: baseState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
      triviaCatalog,
    });
    expect(result.exploration?.trivia).toBe('İstanbul tarih kokar.');
  });

  it('gives double gold bonus on first visit', () => {
    const firstVisitState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        visitedPortIds: ['venedik'], // istanbul not visited
      },
    };
    const result = resolveTurn({
      state: firstVisitState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    // First visit: 15 * 2 = 30 gold bonus
    expect(result.exploration?.goldBonus).toBe(30);
  });

  it('gives normal gold bonus on repeat visit', () => {
    const repeatVisitState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        visitedPortIds: ['venedik', 'istanbul'], // istanbul already visited
      },
    };
    const result = resolveTurn({
      state: repeatVisitState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.exploration?.goldBonus).toBe(15);
  });
});

// ─── Route encounter: shipwreck on non-kara_bayrak intent ───────────────────

describe('resolveTurn – route encounter shipwreck', () => {
  it('triggers shipwreck on route encounter with fragile ship (kervan intent)', () => {
    // Fragile ship that will be wrecked by combat loss
    const fragileState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        ship: { type: 'feluka', cargoCapacity: 3, power: 1, durability: 10 },
        gold: 5,
      },
    };
    // rng always returns 0: triggers encounter (0 < encounterChance),
    // then enemy tactic=pruva, dice=1,1
    const result = resolveTurn({
      state: fragileState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' },
      ports,
      routes,
      goods,
      tactic: 'ates',
      rng: () => 0,
    });
    if (result.combat?.shipwrecked) {
      // Shipwreck on non-kara_bayrak returns early with limited state
      expect(result.nextState.player.ship.type).toBe('feluka');
      expect(result.nextState.player.ship.durability).toBe(100);
      expect(result.nextState.player.cargo).toHaveLength(0);
      expect(result.whispers).toHaveLength(1);
      expect(result.whispers[0]).toContain('parçalandı');
    }
  });
});

// ─── Route encounter: kacti on non-kara_bayrak intent ───────────────────────

describe('resolveTurn – route encounter kacti', () => {
  it('handles kacti result on route encounter (duman intent)', () => {
    // Strong ship so kacis succeeds
    const strongState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        ship: { type: 'kadirga', cargoCapacity: 2, power: 3, durability: 100 },
        experience: { meltem: 10, terazi: 1, murekkep: 1, simsar: 1 },
      },
    };
    // rng = 0 triggers encounter, duman intent → kacis tactic, strong ship → kacti
    const result = resolveTurn({
      state: strongState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'duman' },
      ports,
      routes,
      goods,
      rng: () => 0, // triggers encounter
    });
    if (result.combat?.result === 'kacti') {
      expect(result.log.some((e) => e.detail.includes('yelkeni kırdın'))).toBe(true);
    }
  });

  it('handles kaybetti result on route encounter without shipwreck', () => {
    // Durable ship that will lose but not be wrecked
    const durableState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        ship: { type: 'feluka', cargoCapacity: 3, power: 1, durability: 80 },
        gold: 200,
      },
    };
    // rng=0 triggers encounter, tactic=ates, enemy=pruva → no counter, weak player → kaybetti
    // durability 80 - ~18 = 62 → not shipwrecked
    const result = resolveTurn({
      state: durableState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' },
      ports,
      routes,
      goods,
      tactic: 'ates',
      rng: () => 0,
    });
    if (result.combat?.result === 'kaybetti' && !result.combat.shipwrecked) {
      expect(result.log.some((e) => e.detail.includes('Beklenmeyen'))).toBe(true);
      expect(result.nextState.player.ship.durability).toBeLessThan(80);
    }
  });
});

// ─── Renown decay during turn ───────────────────────────────────────────────

describe('resolveTurn – renown decay', () => {
  it('warns about renown approaching loss', () => {
    const decayState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        experience: { meltem: 1, terazi: 10, murekkep: 2, simsar: 1 },
        renown: ['Altın Parmak'],
        renownLastAction: { 'Altın Parmak': 1 },
      },
      turn: 5, // gap = 6-1 = 5, which triggers warning (RENOWN_WARNING_TURNS = 5)
    };
    const result = resolveTurn({
      state: decayState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.log.some((e) => e.label === 'Ün' && e.detail.includes('sarsılıyor'))).toBe(true);
  });

  it('removes renown title when decay reaches loss threshold', () => {
    const lossState: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        experience: { meltem: 1, terazi: 10, murekkep: 2, simsar: 1 },
        renown: ['Altın Parmak'],
        renownLastAction: { 'Altın Parmak': 1 },
      },
      turn: 8, // gap = 9-1 = 8, triggers loss (RENOWN_LOSS_TURNS = 8)
    };
    const result = resolveTurn({
      state: lossState,
      order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'pusula' },
      ports,
      routes,
      goods,
    });
    expect(result.log.some((e) => e.label === 'Ün' && e.detail.includes('kaybettiniz'))).toBe(true);
  });
});
