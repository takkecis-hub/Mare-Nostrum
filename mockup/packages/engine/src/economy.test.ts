import { describe, expect, it } from 'vitest';
import type { CargoItem, Good, Port } from '../../shared/src/types/index.js';
import { priceIndicatorForPort, sellCargoAtPort } from './economy.js';

const venedik: Port = {
  id: 'venedik',
  name: 'Venedik',
  displayName: 'Venedik',
  region: 'bati',
  controller: 'venedik',
  produces: { good: 'murano_cami', category: 'luks', basePrice: 'pahali' },
  desires: { good: 'lubnan_sediri', category: 'luks', basePrice: 'pahali' },
  special: [],
  trivia: [],
  x: 0,
  y: 0,
};

const tunus: Port = {
  id: 'tunus',
  name: 'Tunus',
  displayName: 'Tunus',
  region: 'guney',
  controller: 'tunus',
  produces: { good: 'atlas', category: 'luks', basePrice: 'normal' },
  desires: { good: 'murano_cami', category: 'luks', basePrice: 'pahali' },
  special: [],
  trivia: [],
  x: 0,
  y: 0,
};

const muranoCami: Good = { id: 'murano_cami', name: 'Murano Camı', category: 'luks', originPort: 'venedik', priceIndicator: 3 };
const atlas: Good = { id: 'atlas', name: 'Atlas', category: 'luks', originPort: 'tunus', priceIndicator: 3 };

describe('priceIndicatorForPort', () => {
  it('returns 2 when port produces the good', () => {
    expect(priceIndicatorForPort(venedik, muranoCami)).toBe(2);
  });

  it('returns 5 when port desires the good', () => {
    expect(priceIndicatorForPort(tunus, muranoCami)).toBe(5);
  });

  it('returns good.priceIndicator for unrelated goods', () => {
    expect(priceIndicatorForPort(venedik, atlas)).toBe(3);
  });
});

describe('sellCargoAtPort', () => {
  it('sells cargo when port desires the good (profitable)', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 2, originPort: 'venedik', purchasePrice: 40 },
    ];
    // indicator=5, saleValue=5*20*2=200, purchasePrice total=80 → profitable
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(200);
    expect(result.sold).toHaveLength(1);
    expect(result.stars).toBeGreaterThan(1);
  });

  it('keeps cargo when sale value does not exceed purchase price', () => {
    const cargo: CargoItem[] = [
      // purchasePrice=100 per unit, saleValue=2*20*1=40 (port produces it → indicator=2)
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 100 },
    ];
    const result = sellCargoAtPort(cargo, [muranoCami], venedik);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.goldDelta).toBe(0);
    expect(result.sold).toHaveLength(0);
  });

  it('returns empty result for empty cargo', () => {
    const result = sellCargoAtPort([], [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(0);
    expect(result.sold).toHaveLength(0);
    expect(result.stars).toBe(1);
  });

  it('sells profitable items and keeps unprofitable ones', () => {
    const cargo: CargoItem[] = [
      // murano_cami is desired by tunus → profitable
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 },
      // atlas is produced by tunus → indicator=2, saleValue=40, purchasePrice total=50 → not profitable
      { goodId: 'atlas', name: 'Atlas', quantity: 1, originPort: 'tunus', purchasePrice: 50 },
    ];
    const result = sellCargoAtPort(cargo, [muranoCami, atlas], tunus);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.remainingCargo[0].goodId).toBe('atlas');
    expect(result.sold).toHaveLength(1);
    expect(result.goldDelta).toBe(100);
  });

  it('keeps cargo when good is not in goods list', () => {
    const cargo: CargoItem[] = [
      { goodId: 'unknown_good', name: 'Bilinmeyen', quantity: 1, originPort: 'venedik', purchasePrice: 10 },
    ];
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.goldDelta).toBe(0);
  });
});

import { saturationMultiplier } from './economy.js';

describe('saturationMultiplier', () => {
  it('returns 1.0 when no prior deliveries', () => {
    expect(saturationMultiplier('venedik', 'murano_cami', {})).toBe(1);
  });

  it('reduces price by 0.15 per delivery', () => {
    const sat = { 'venedik:murano_cami': 2 };
    // 1 - 0.15 * 2 = 0.7
    expect(saturationMultiplier('venedik', 'murano_cami', sat)).toBeCloseTo(0.7);
  });

  it('floors at 0.4 (SATURATION_PRICE_FLOOR)', () => {
    const sat = { 'venedik:murano_cami': 10 };
    // 1 - 0.15 * 10 = -0.5 → clamped to 0.4
    expect(saturationMultiplier('venedik', 'murano_cami', sat)).toBe(0.4);
  });
});

describe('sellCargoAtPort with saturation', () => {
  it('reduces sale value when port is saturated', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 },
    ];
    // Without saturation: indicator=5, value=100
    const resultClean = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(resultClean.goldDelta).toBe(100);

    // With heavy saturation: multiplier = 0.4 → value = round(100 * 0.4) = 40, not profitable (<=40)
    const sat = { 'tunus:murano_cami': 5 };
    const resultSaturated = sellCargoAtPort(
      [{ goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 }],
      [muranoCami],
      tunus,
      sat,
    );
    // 1 - 0.15*5 = 0.25 → clamped to 0.4, value = round(100*0.4) = 40, purchase=40, not profitable
    expect(resultSaturated.goldDelta).toBe(0);
    expect(resultSaturated.remainingCargo).toHaveLength(1);
  });

  it('returns saturationUpdates tracking sold quantities', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 2, originPort: 'venedik', purchasePrice: 40 },
    ];
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.saturationUpdates['tunus:murano_cami']).toBe(2);
  });
});
