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
});
