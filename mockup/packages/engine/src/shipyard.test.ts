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
