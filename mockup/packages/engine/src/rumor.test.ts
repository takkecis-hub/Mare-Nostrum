import { describe, expect, it } from 'vitest';
import type { Route, Rumor } from '../../shared/src/types/index.js';
import { createRumor, spreadRumors } from './rumor.js';

const sampleRoutes: Route[] = [
  { id: 'r1', from: 'venedik', to: 'istanbul', type: 'fortuna', isChokepoint: null, encounterChance: 0.3, turnsRequired: 2 },
  { id: 'r2', from: 'istanbul', to: 'beyrut', type: 'uzun_kabotaj', isChokepoint: null, encounterChance: 0.2, turnsRequired: 2 },
];

describe('createRumor', () => {
  it('creates rumor with olumsuz tone for kara_bayrak action', () => {
    const rumor = createRumor('kara_bayrak', 'venedik');
    expect(rumor.tone).toBe('olumsuz');
  });

  it('creates rumor with notr tone for duman action', () => {
    const rumor = createRumor('duman', 'venedik');
    expect(rumor.tone).toBe('notr');
  });

  it('creates rumor with notr tone for other actions', () => {
    const rumor = createRumor('kervan', 'tunus');
    expect(rumor.tone).toBe('notr');
  });

  it('creates rumor with correct id structure containing action', () => {
    const rumor = createRumor('kara_bayrak', 'venedik');
    expect(rumor.id).toMatch(/^kara_bayrak-\d+$/);
  });

  it('creates rumor with strength=100 and age=0', () => {
    const rumor = createRumor('duman', 'istanbul');
    expect(rumor.strength).toBe(100);
    expect(rumor.age).toBe(0);
  });

  it('sets current port to the provided port', () => {
    const rumor = createRumor('kervan', 'palermo');
    expect(rumor.currentPorts).toContain('palermo');
  });

  it('sets aboutPlayerId to player-1', () => {
    const rumor = createRumor('kervan', 'tunus');
    expect(rumor.aboutPlayerId).toBe('player-1');
  });
});

describe('spreadRumors', () => {
  it('increases age by 1 after spreading', () => {
    const rumor = createRumor('kervan', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].age).toBe(1);
  });

  it('decreases strength by 15 after spreading', () => {
    const rumor = createRumor('kervan', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].strength).toBe(85);
  });

  it('spreads rumor to connected ports', () => {
    const rumor = createRumor('kervan', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].currentPorts).toContain('istanbul');
  });

  it('retains originating port after spread', () => {
    const rumor = createRumor('kervan', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].currentPorts).toContain('venedik');
  });

  it('filters out rumors with strength <= 0 after enough spreads', () => {
    // After 7 spreads: strength = 100 - 7*15 = -5 → filtered
    let rumors = [createRumor('kervan', 'venedik')];
    for (let i = 0; i < 7; i++) {
      rumors = spreadRumors(rumors, sampleRoutes);
    }
    expect(rumors).toHaveLength(0);
  });

  it('returns empty array when given empty rumors', () => {
    const result = spreadRumors([], sampleRoutes);
    expect(result).toHaveLength(0);
  });

  it('spreads from bidirectional routes (to→from direction)', () => {
    const rumor = createRumor('kervan', 'istanbul');
    const result = spreadRumors([rumor], sampleRoutes);
    // istanbul is 'to' in r1 (venedik→istanbul), so venedik should be reachable
    expect(result[0].currentPorts).toContain('venedik');
  });

  it('decays kara_bayrak rumors by 10 per spread (lingers longer)', () => {
    const rumor = createRumor('kara_bayrak', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].strength).toBe(90); // 100 - 10
  });

  it('decays duman rumors by 20 per spread (fades fast)', () => {
    const rumor = createRumor('duman', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].strength).toBe(80); // 100 - 20
  });

  it('uses fallback decay of 15 for unknown sourceAction', () => {
    const rumor = createRumor('unknown_action', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].strength).toBe(85); // 100 - 15
  });
});

describe('createRumor with custom playerId', () => {
  it('uses the provided playerId instead of the default', () => {
    const rumor = createRumor('kervan', 'venedik', 'player-42');
    expect(rumor.aboutPlayerId).toBe('player-42');
  });

  it('falls back to default player id when none is provided', () => {
    const rumor = createRumor('kervan', 'venedik');
    expect(rumor.aboutPlayerId).toBe('player-1');
  });
});

describe('createRumor – text content', () => {
  it('pusula action creates rumor with text containing haritalar or pusula', () => {
    const rumor = createRumor('pusula', 'venedik');
    const hasKeyword = /haritalar|pusula/i.test(rumor.text);
    expect(hasKeyword).toBe(true);
  });

  it('kara_bayrak text contains relevant combat-related content', () => {
    const rumor = createRumor('kara_bayrak', 'venedik');
    const hasCombat = /kılıç|deniz|tüccar/i.test(rumor.text);
    expect(hasCombat).toBe(true);
  });

  it('unknown action uses default text', () => {
    const rumor = createRumor('nonexistent_action', 'venedik');
    expect(rumor.text).toContain('fısıltılar');
  });
});

describe('spreadRumors – multi-rumor and limit', () => {
  it('multiple simultaneous rumors all age and decay independently', () => {
    const rumorA = createRumor('kara_bayrak', 'venedik');
    const rumorB = createRumor('duman', 'istanbul');
    const result = spreadRumors([rumorA, rumorB], sampleRoutes);

    expect(result).toHaveLength(2);
    expect(result[0].age).toBe(1);
    expect(result[1].age).toBe(1);
    // kara_bayrak decays by 10, duman decays by 20
    expect(result[0].strength).toBe(90);
    expect(result[1].strength).toBe(80);
  });

  it('hub port with 3+ connections: MAX_RUMOR_SPREAD_PORTS=2 limits spread to 2 new ports per existing port', () => {
    const hubRoutes: Route[] = [
      { id: 'h1', from: 'istanbul', to: 'venedik', type: 'fortuna', isChokepoint: null, encounterChance: 0.3, turnsRequired: 1 },
      { id: 'h2', from: 'istanbul', to: 'beyrut', type: 'fortuna', isChokepoint: null, encounterChance: 0.2, turnsRequired: 1 },
      { id: 'h3', from: 'istanbul', to: 'girit', type: 'fortuna', isChokepoint: null, encounterChance: 0.1, turnsRequired: 1 },
    ];
    const rumor = createRumor('kervan', 'istanbul');
    const result = spreadRumors([rumor], hubRoutes);
    // istanbul + 2 spread ports (slice limits to 2 routes)
    expect(result[0].currentPorts).toContain('istanbul');
    expect(result[0].currentPorts).toHaveLength(3); // istanbul + 2 new ports
    // girit is route h3 (3rd), should be excluded by slice(0, 2)
    expect(result[0].currentPorts).not.toContain('girit');
  });

  it('strength never goes negative (clamped to 0)', () => {
    const weakRumor: Rumor = {
      id: 'weak-1',
      aboutPlayerId: 'player-1',
      text: 'Weak rumor',
      tone: 'notr',
      currentPorts: ['venedik'],
      strength: 5,
      age: 3,
      sourceAction: 'kara_bayrak', // decay = 10
    };
    // 5 - 10 = -5 → clamped to 0 → filtered out
    const result = spreadRumors([weakRumor], sampleRoutes);
    expect(result).toHaveLength(0);
  });

  it('spreading preserves all rumor metadata (id, aboutPlayerId, text, tone, sourceAction)', () => {
    const rumor = createRumor('kervan', 'venedik', 'player-7');
    const result = spreadRumors([rumor], sampleRoutes);

    expect(result[0].id).toBe(rumor.id);
    expect(result[0].aboutPlayerId).toBe('player-7');
    expect(result[0].text).toBe(rumor.text);
    expect(result[0].tone).toBe(rumor.tone);
    expect(result[0].sourceAction).toBe('kervan');
  });
});

describe('spreadRumors – pusula decay', () => {
  it('pusula rumor decays by 15 (same as kervan)', () => {
    const rumor = createRumor('pusula', 'venedik');
    const result = spreadRumors([rumor], sampleRoutes);
    expect(result[0].strength).toBe(85); // 100 - 15
  });
});
