import { describe, expect, it } from 'vitest';
import type { Ship } from '../../shared/src/types/index.js';
import { effectiveCostPerPoint, repairCost, repairShip } from './shipyard.js';

const damagedKaraka: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 60 };
const fullKaraka: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 100 };

describe('repairCost', () => {
  it('calculates cost for damaged ship without discount', () => {
    // 40 points * 4 gold/point = 160
    expect(repairCost(damagedKaraka, [])).toBe(160);
  });

  it('applies tersane discount', () => {
    // 40 points * ceil(4 * 0.75) = 40 * 3 = 120
    expect(repairCost(damagedKaraka, ['tersane'])).toBe(120);
  });

  it('returns 0 for fully repaired ship', () => {
    expect(repairCost(fullKaraka, [])).toBe(0);
  });

  it('returns 0 when durability is exactly 100', () => {
    expect(repairCost(fullKaraka, ['tersane'])).toBe(0);
  });
});

describe('repairShip', () => {
  it('fully repairs when player has enough gold', () => {
    const result = repairShip(damagedKaraka, 200, []);
    expect(result.repairedShip.durability).toBe(100);
    expect(result.goldSpent).toBe(160);
    expect(result.durabilityRestored).toBe(40);
  });

  it('partially repairs when gold is limited', () => {
    // 30 gold / 4 per point = 7 points affordable (floor), goldSpent = 28
    const result = repairShip(damagedKaraka, 30, []);
    expect(result.repairedShip.durability).toBe(67);
    expect(result.goldSpent).toBe(28);
    expect(result.durabilityRestored).toBe(7);
  });

  it('applies tersane discount during repair', () => {
    // With tersane: ceil(4 * 0.75) = 3 per point
    // 9 gold / 3 per point = 3 points
    const result = repairShip(damagedKaraka, 9, ['tersane']);
    expect(result.repairedShip.durability).toBe(63);
    expect(result.goldSpent).toBe(9);
    expect(result.durabilityRestored).toBe(3);
  });

  it('does nothing for a fully repaired ship', () => {
    const result = repairShip(fullKaraka, 200, []);
    expect(result.repairedShip.durability).toBe(100);
    expect(result.goldSpent).toBe(0);
    expect(result.durabilityRestored).toBe(0);
  });

  it('does nothing when gold is 0', () => {
    const result = repairShip(damagedKaraka, 0, []);
    expect(result.repairedShip.durability).toBe(60);
    expect(result.goldSpent).toBe(0);
    expect(result.durabilityRestored).toBe(0);
  });

  it('does not mutate the original ship', () => {
    const original: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 60 };
    repairShip(original, 200, []);
    expect(original.durability).toBe(60);
  });
});

describe('effectiveCostPerPoint', () => {
  it('returns base cost when no tersane special', () => {
    expect(effectiveCostPerPoint([])).toBe(4);
  });

  it('returns discounted cost when tersane is present', () => {
    // ceil(4 * 0.75) = ceil(3) = 3
    expect(effectiveCostPerPoint(['tersane'])).toBe(3);
  });

  it('returns base cost with unrelated specials', () => {
    expect(effectiveCostPerPoint(['depo', 'kahve'])).toBe(4);
  });

  it('returns discounted cost even with additional specials alongside tersane', () => {
    expect(effectiveCostPerPoint(['depo', 'tersane'])).toBe(3);
  });
});

describe('repairShip – edge cases', () => {
  it('durability=0: needs 100 points, full repair costs 400', () => {
    const wrecked: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 0 };
    const result = repairShip(wrecked, 500, []);
    expect(result.repairedShip.durability).toBe(100);
    expect(result.goldSpent).toBe(400);
    expect(result.durabilityRestored).toBe(100);
  });

  it('durability=1: needs 99 points, costs 99*4=396', () => {
    const almostWrecked: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 1 };
    const result = repairShip(almostWrecked, 500, []);
    expect(result.repairedShip.durability).toBe(100);
    expect(result.goldSpent).toBe(396);
    expect(result.durabilityRestored).toBe(99);
  });

  it('durability=99: needs 1 point, costs 4', () => {
    const almostFull: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 99 };
    const result = repairShip(almostFull, 100, []);
    expect(result.repairedShip.durability).toBe(100);
    expect(result.goldSpent).toBe(4);
    expect(result.durabilityRestored).toBe(1);
  });

  it('exactly enough gold to fully repair (no remainder)', () => {
    // damagedKaraka: durability=60, needs 40 points, costs 40*4=160
    const result = repairShip(damagedKaraka, 160, []);
    expect(result.repairedShip.durability).toBe(100);
    expect(result.goldSpent).toBe(160);
    expect(result.durabilityRestored).toBe(40);
  });

  it('gold=1 with cost_per_point=4: cannot afford any points → no repair', () => {
    const result = repairShip(damagedKaraka, 1, []);
    expect(result.repairedShip.durability).toBe(60);
    expect(result.goldSpent).toBe(0);
    expect(result.durabilityRestored).toBe(0);
  });

  it('does not mutate portSpecials array', () => {
    const specials = ['tersane', 'depo'];
    const originalSpecials = [...specials];
    repairShip(damagedKaraka, 200, specials);
    expect(specials).toEqual(originalSpecials);
  });
});

describe('repairCost – edge cases', () => {
  it('durability above 100 returns 0 since pointsNeeded <= 0', () => {
    const overRepaired: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 110 };
    expect(repairCost(overRepaired, [])).toBe(0);
  });

  it('durability=50 costs 50 * 4 = 200', () => {
    const halfDamaged: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 50 };
    expect(repairCost(halfDamaged, [])).toBe(200);
  });

  it('durability=50 with tersane costs 50 * 3 = 150', () => {
    const halfDamaged: Ship = { type: 'karaka', cargoCapacity: 5, power: 2, durability: 50 };
    expect(repairCost(halfDamaged, ['tersane'])).toBe(150);
  });
});
