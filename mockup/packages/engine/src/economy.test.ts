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

describe('saturationMultiplier – additional coverage', () => {
  it('returns 0.85 for a single delivery (count=1)', () => {
    const sat = { 'venedik:murano_cami': 1 };
    expect(saturationMultiplier('venedik', 'murano_cami', sat)).toBeCloseTo(0.85);
  });

  it('returns exactly 0.4 at floor boundary (count=4)', () => {
    const sat = { 'venedik:murano_cami': 4 };
    // 1 - 0.15 * 4 = 0.4, exactly the floor
    expect(saturationMultiplier('venedik', 'murano_cami', sat)).toBeCloseTo(0.4);
  });

  it('different port/good keys do not interfere', () => {
    const sat = { 'tunus:atlas': 5 };
    // querying a completely different key should return 1.0
    expect(saturationMultiplier('venedik', 'murano_cami', sat)).toBe(1);
  });

  it('returns 1.0 when key is for a different good than the saturated one', () => {
    const sat = { 'venedik:atlas': 3 };
    // same port, different good → no saturation
    expect(saturationMultiplier('venedik', 'murano_cami', sat)).toBe(1);
  });
});

describe('priceIndicatorForPort – additional coverage', () => {
  const lowIndicatorGood: Good = { id: 'cheap_good', name: 'Cheap Good', category: 'luks', originPort: 'other', priceIndicator: 1 };
  const highIndicatorGood: Good = { id: 'pricey_good', name: 'Pricey Good', category: 'luks', originPort: 'other', priceIndicator: 5 };

  it('returns 1 for a good with priceIndicator=1 at unrelated port', () => {
    expect(priceIndicatorForPort(venedik, lowIndicatorGood)).toBe(1);
  });

  it('returns 5 for a good with priceIndicator=5 at unrelated port', () => {
    expect(priceIndicatorForPort(venedik, highIndicatorGood)).toBe(5);
  });
});

describe('sellCargoAtPort – stars calculation', () => {
  it('stars = 4 when good is desired (indicator=5)', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 10 },
    ];
    // tunus desires murano_cami → indicator=5, stars = min(4, 5-1) = 4
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.stars).toBe(4);
  });

  it('stars = 2 for unrelated good (indicator=3)', () => {
    const cargo: CargoItem[] = [
      { goodId: 'atlas', name: 'Atlas', quantity: 1, originPort: 'tunus', purchasePrice: 10 },
    ];
    // venedik neither produces nor desires atlas → indicator=3, stars = min(4, 3-1) = 2
    const result = sellCargoAtPort(cargo, [atlas], venedik);
    expect(result.stars).toBe(2);
  });

  it('stars remains 1 when no items are sold', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 200 },
    ];
    // indicator=5 at tunus, saleValue=100, purchasePrice=200 → not profitable → not sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.sold).toHaveLength(0);
    expect(result.stars).toBe(1);
  });

  it('stars uses the highest indicator among all sold items', () => {
    const lubnanSediri: Good = { id: 'lubnan_sediri', name: 'Lübnan Sediri', category: 'luks', originPort: 'beyrut', priceIndicator: 3 };
    const cargo: CargoItem[] = [
      // venedik desires lubnan_sediri → indicator=5, stars contribution = min(4,4) = 4
      { goodId: 'lubnan_sediri', name: 'Lübnan Sediri', quantity: 1, originPort: 'beyrut', purchasePrice: 10 },
      // venedik has atlas as unrelated → indicator=3, stars contribution = min(4,2) = 2
      { goodId: 'atlas', name: 'Atlas', quantity: 1, originPort: 'tunus', purchasePrice: 10 },
    ];
    const result = sellCargoAtPort(cargo, [lubnanSediri, atlas], venedik);
    expect(result.sold).toHaveLength(2);
    expect(result.stars).toBe(4);
  });
});

describe('sellCargoAtPort – exact boundary conditions', () => {
  it('does not sell when sale value exactly equals purchase price', () => {
    const cargo: CargoItem[] = [
      // tunus desires murano_cami → indicator=5, saleValue=5*20*1=100
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 100 },
    ];
    // saleValue(100) <= purchasePrice*qty(100) → not sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.goldDelta).toBe(0);
    expect(result.sold).toHaveLength(0);
  });

  it('sells when sale value is 1 more than purchase price', () => {
    const cargo: CargoItem[] = [
      // tunus desires murano_cami → indicator=5, saleValue=5*20*1=100
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 99 },
    ];
    // saleValue(100) > purchasePrice*qty(99) → sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(100);
    expect(result.sold).toHaveLength(1);
  });

  it('multiple quantities affect profitability check (saleValue vs purchasePrice * quantity)', () => {
    const cargo: CargoItem[] = [
      // tunus desires murano_cami → indicator=5, saleValue=5*20*2=200
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 2, originPort: 'venedik', purchasePrice: 100 },
    ];
    // saleValue(200) <= purchasePrice*qty(100*2=200) → not sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.goldDelta).toBe(0);
    expect(result.sold).toHaveLength(0);
  });
});

describe('sellCargoAtPort – saturation interaction', () => {
  it('saturation reduces sale value but item is still profitable at light saturation', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 },
    ];
    const sat = { 'tunus:murano_cami': 1 };
    // indicator=5, multiplier=0.85, saleValue=round(5*20*1*0.85)=85, purchasePrice=40 → sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus, sat);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(85);
    expect(result.sold).toHaveLength(1);
  });

  it('multiple items with different saturation levels', () => {
    const cargo: CargoItem[] = [
      // murano_cami desired by tunus → indicator=5, sat=2 → multiplier=0.7
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 20 },
      // atlas produced by tunus → indicator=2, no saturation → multiplier=1.0
      { goodId: 'atlas', name: 'Atlas', quantity: 1, originPort: 'tunus', purchasePrice: 10 },
    ];
    const sat = { 'tunus:murano_cami': 2 };
    // murano_cami: saleValue=round(5*20*1*0.7)=70, purchasePrice=20 → sold
    // atlas: saleValue=round(2*20*1*1.0)=40, purchasePrice=10 → sold
    const result = sellCargoAtPort(cargo, [muranoCami, atlas], tunus, sat);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.sold).toHaveLength(2);
    expect(result.goldDelta).toBe(70 + 40);
  });

  it('saturation updates accumulate across multiple cargo items of the same good', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 10 },
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 3, originPort: 'venedik', purchasePrice: 10 },
    ];
    // Both sold at tunus (indicator=5), no existing saturation
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.sold).toHaveLength(2);
    expect(result.saturationUpdates['tunus:murano_cami']).toBe(4);
  });
});
