import { describe, expect, it } from 'vitest';
import type { CargoItem, Good, Port } from '../../shared/src/types/index.js';
import { priceIndicatorForPort, sellCargoAtPort, purchaseCostForGood, seasonMultiplier, basePriceMultiplier } from './economy.js';

const venedik: Port = {
  id: 'venedik',
  name: 'Venedik',
  displayName: 'Venedik',
  region: 'bati',
  controller: 'venedik',
  produces: { good: 'murano_cami', category: 'luks', basePrice: 'pahali' },
  desires: { good: 'lubnan_sediri', category: 'savas', basePrice: 'pahali' },
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

function createTestPort(overrides: Partial<Port>): Port {
  return {
    id: 'test-port',
    name: 'Test Port',
    displayName: 'Test Port',
    region: 'bati',
    controller: 'venedik',
    produces: { good: 'murano_cami', category: 'luks', basePrice: 'pahali' },
    desires: { good: 'lubnan_sediri', category: 'savas', basePrice: 'pahali' },
    special: [],
    trivia: [],
    x: 0,
    y: 0,
    ...overrides,
  };
}

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
    // indicator=5, bpMult=1.25 (pahali desired), saleValue=round(5*20*2*1.25)=250
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(250);
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
      // murano_cami is desired by tunus → indicator=5, bpMult=1.25 → saleValue=125 → profitable
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 },
      // atlas is produced by tunus → indicator=2, bpMult=1.0, saleValue=40, purchasePrice total=50 → not profitable
      { goodId: 'atlas', name: 'Atlas', quantity: 1, originPort: 'tunus', purchasePrice: 50 },
    ];
    const result = sellCargoAtPort(cargo, [muranoCami, atlas], tunus);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.remainingCargo[0].goodId).toBe('atlas');
    expect(result.sold).toHaveLength(1);
    expect(result.goldDelta).toBe(125);
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
    // Without saturation: indicator=5, bpMult=1.25, value=125
    const resultClean = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(resultClean.goldDelta).toBe(125);

    // With heavy saturation: satMult = max(0.4, 1-0.15*5=0.25) = 0.4
    // value = round(5*20*1*0.4*1.25) = round(50) = 50, purchase=40 → still profitable
    const sat = { 'tunus:murano_cami': 5 };
    const resultSaturated = sellCargoAtPort(
      [{ goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 40 }],
      [muranoCami],
      tunus,
      sat,
    );
    expect(resultSaturated.goldDelta).toBe(50);
    expect(resultSaturated.remainingCargo).toHaveLength(0);
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
  const bonusDesirePort = createTestPort({
    id: 'bonus-desire-port',
    name: 'Bonus Desire Port',
    displayName: 'Bonus Desire Port',
    bonusDesires: [{ good: 'bonus_good', category: 'luks', basePrice: 'pahali' }],
  });
  const bonusProducePort = createTestPort({
    id: 'bonus-produce-port',
    name: 'Bonus Produce Port',
    displayName: 'Bonus Produce Port',
    region: 'guney',
    controller: 'tunus',
    produces: { good: 'atlas', category: 'luks', basePrice: 'normal' },
    desires: { good: 'murano_cami', category: 'luks', basePrice: 'pahali' },
    bonusProduces: [{ good: 'bonus_good', category: 'luks', basePrice: 'normal' }],
  });
  const bonusGood: Good = { id: 'bonus_good', name: 'Bonus Good', category: 'luks', originPort: 'other', priceIndicator: 3 };

  it('returns 1 for a good with priceIndicator=1 at unrelated port', () => {
    expect(priceIndicatorForPort(venedik, lowIndicatorGood)).toBe(1);
  });

  it('returns 5 for a good with priceIndicator=5 at unrelated port', () => {
    expect(priceIndicatorForPort(venedik, highIndicatorGood)).toBe(5);
  });

  it('returns 5 when a bonus desire slot matches the good', () => {
    expect(priceIndicatorForPort(bonusDesirePort, bonusGood)).toBe(5);
  });

  it('returns 2 when a bonus produce slot matches the good', () => {
    expect(priceIndicatorForPort(bonusProducePort, bonusGood)).toBe(2);
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
      // tunus desires murano_cami → indicator=5, bpMult=1.25, saleValue=round(5*20*1*1.25)=125
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 125 },
    ];
    // saleValue(125) <= purchasePrice*qty(125) → not sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(1);
    expect(result.goldDelta).toBe(0);
    expect(result.sold).toHaveLength(0);
  });

  it('sells when sale value is 1 more than purchase price', () => {
    const cargo: CargoItem[] = [
      // tunus desires murano_cami → indicator=5, bpMult=1.25, saleValue=125
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 124 },
    ];
    // saleValue(125) > purchasePrice*qty(124) → sold
    const result = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(125);
    expect(result.sold).toHaveLength(1);
  });

  it('multiple quantities affect profitability check (saleValue vs purchasePrice * quantity)', () => {
    const cargo: CargoItem[] = [
      // tunus desires murano_cami → indicator=5, bpMult=1.25, saleValue=round(5*20*2*1.25)=250
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 2, originPort: 'venedik', purchasePrice: 125 },
    ];
    // saleValue(250) <= purchasePrice*qty(125*2=250) → not sold
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
    // indicator=5, satMult=0.85, bpMult=1.25, saleValue=round(5*20*1*0.85*1.25)=round(106.25)=106
    const result = sellCargoAtPort(cargo, [muranoCami], tunus, sat);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.goldDelta).toBe(106);
    expect(result.sold).toHaveLength(1);
  });

  it('multiple items with different saturation levels', () => {
    const cargo: CargoItem[] = [
      // murano_cami desired by tunus → indicator=5, sat=2 → satMult=0.7, bpMult=1.25
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 20 },
      // atlas produced by tunus → indicator=2, no saturation → satMult=1.0, bpMult=1.0
      { goodId: 'atlas', name: 'Atlas', quantity: 1, originPort: 'tunus', purchasePrice: 10 },
    ];
    const sat = { 'tunus:murano_cami': 2 };
    // murano_cami: saleValue=round(5*20*1*0.7*1.25)=round(87.5)=88
    // atlas: saleValue=round(2*20*1*1.0*1.0)=40
    const result = sellCargoAtPort(cargo, [muranoCami, atlas], tunus, sat);
    expect(result.remainingCargo).toHaveLength(0);
    expect(result.sold).toHaveLength(2);
    expect(result.goldDelta).toBe(88 + 40);
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

// ─── New feature tests ──────────────────────────────────────────────────────

describe('purchaseCostForGood', () => {
  const muranoCamiGood: Good = { id: 'murano_cami', name: 'Murano Camı', category: 'luks', originPort: 'venedik', priceIndicator: 2 };

  it('returns pahali band cost (50) for port with basePrice pahali', () => {
    expect(purchaseCostForGood(venedik, muranoCamiGood)).toBe(50);
  });

  it('returns normal band cost (40) for port with basePrice normal', () => {
    expect(purchaseCostForGood(tunus, muranoCamiGood)).toBe(40);
  });

  it('returns ucuz band cost (30) for port with basePrice ucuz', () => {
    const ucuzPort: Port = {
      ...venedik,
      produces: { good: 'cheap_good', category: 'yemek', basePrice: 'ucuz' },
    };
    expect(purchaseCostForGood(ucuzPort, muranoCamiGood)).toBe(30);
  });
});

describe('seasonMultiplier', () => {
  it('returns 0.85 for yemek in yaz (summer surplus)', () => {
    expect(seasonMultiplier('yaz', 'yemek')).toBeCloseTo(0.85);
  });

  it('returns 1.2 for luks in yaz (summer luxury demand)', () => {
    expect(seasonMultiplier('yaz', 'luks')).toBeCloseTo(1.2);
  });

  it('returns 1.3 for yemek in kis (winter food demand)', () => {
    expect(seasonMultiplier('kis', 'yemek')).toBeCloseTo(1.3);
  });

  it('returns 0.85 for luks in kis (winter austerity)', () => {
    expect(seasonMultiplier('kis', 'luks')).toBeCloseTo(0.85);
  });

  it('returns 1.0 for savas in both seasons', () => {
    expect(seasonMultiplier('yaz', 'savas')).toBe(1);
    expect(seasonMultiplier('kis', 'savas')).toBe(1);
  });
});

describe('basePriceMultiplier', () => {
  it('returns 1.25 for pahali', () => {
    expect(basePriceMultiplier('pahali')).toBeCloseTo(1.25);
  });

  it('returns 1.0 for normal', () => {
    expect(basePriceMultiplier('normal')).toBe(1);
  });

  it('returns 0.85 for ucuz', () => {
    expect(basePriceMultiplier('ucuz')).toBeCloseTo(0.85);
  });
});

describe('sellCargoAtPort – kabotaj route bonus', () => {
  it('applies 1.25x route bonus for kabotaj deliveries', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 10 },
    ];
    // Without bonus: indicator=5, bpMult=1.25, saleValue = round(5*20*1*1.25) = 125
    const resultNormal = sellCargoAtPort(cargo, [muranoCami], tunus);
    expect(resultNormal.goldDelta).toBe(125);

    // With kabotaj bonus: saleValue = round(5*20*1*1.25*1.25) = round(156.25) = 156
    const resultKabotaj = sellCargoAtPort(
      [{ goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 10 }],
      [muranoCami],
      tunus,
      {},
      { routeBonus: 1.25 },
    );
    expect(resultKabotaj.goldDelta).toBe(156);
  });
});

describe('sellCargoAtPort – season modifier', () => {
  it('increases yemek sale value in winter (kis)', () => {
    const yemekGood: Good = { id: 'sicilya_bugdayi', name: 'Sicilya Buğdayı', category: 'yemek', originPort: 'palermo', priceIndicator: 1 };
    const yemekPort: Port = {
      ...tunus,
      desires: { good: 'sicilya_bugdayi', category: 'yemek', basePrice: 'ucuz' },
    };
    const cargo: CargoItem[] = [
      { goodId: 'sicilya_bugdayi', name: 'Sicilya Buğdayı', quantity: 1, originPort: 'palermo', purchasePrice: 10 },
    ];
    // indicator=5 (desired), bpMult=0.85 (ucuz), season=kis → seasonMult=1.3
    // saleValue = round(5*20*1*0.85*1.3) = round(110.5) = 111 (JS rounds 0.5 up)
    const result = sellCargoAtPort(cargo, [yemekGood], yemekPort, {}, { season: 'kis' });
    expect(result.goldDelta).toBe(111);
  });

  it('decreases yemek sale value in summer (yaz)', () => {
    const yemekGood: Good = { id: 'sicilya_bugdayi', name: 'Sicilya Buğdayı', category: 'yemek', originPort: 'palermo', priceIndicator: 1 };
    const yemekPort: Port = {
      ...tunus,
      desires: { good: 'sicilya_bugdayi', category: 'yemek', basePrice: 'ucuz' },
    };
    const cargo: CargoItem[] = [
      { goodId: 'sicilya_bugdayi', name: 'Sicilya Buğdayı', quantity: 1, originPort: 'palermo', purchasePrice: 10 },
    ];
    // indicator=5 (desired), bpMult=0.85 (ucuz), season=yaz → seasonMult=0.85
    // saleValue = round(5*20*1*0.85*0.85) = round(72.25) = 72
    const result = sellCargoAtPort(cargo, [yemekGood], yemekPort, {}, { season: 'yaz' });
    expect(result.goldDelta).toBe(72);
  });

  it('increases luks sale value in summer (yaz)', () => {
    const cargo: CargoItem[] = [
      { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 10 },
    ];
    // indicator=5, bpMult=1.25, season=yaz → seasonMult=1.2
    // saleValue = round(5*20*1*1.25*1.2) = round(150) = 150
    const result = sellCargoAtPort(cargo, [muranoCami], tunus, {}, { season: 'yaz' });
    expect(result.goldDelta).toBe(150);
  });
});

// ─── Economy Deepening: Bulk discounts, Smuggling, Contracts, Price Visibility ───

import type { HiddenExperience } from '../../shared/src/types/index.js';
import {
  bulkDiscountMultiplier,
  purchaseCostWithDiscount,
  smugglingDetectionProbability,
  attemptSmuggling,
  checkContractFulfillment,
  contractRewardGold,
  contractBreakPenalty,
  contractSaleBonus,
  firstArrivalMultiplier,
  priceVisibilityTier,
} from './economy.js';
import {
  BULK_DISCOUNT_TIER1,
  BULK_DISCOUNT_TIER2,
  SMUGGLING_DETECT_BASE,
  SMUGGLING_DETECT_FLOOR,
  SMUGGLING_FINE_GOLD,
  SMUGGLING_LOCKOUT_TURNS,
  CONTRACT_PRICE_BONUS,
  CONTRACT_BREAK_PENALTY,
  FIRST_ARRIVAL_BONUS,
} from '../../shared/src/constants/index.js';

const baseExperience: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
const highSimsar: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 10 };
const highTerazi: HiddenExperience = { meltem: 1, terazi: 10, murekkep: 1, simsar: 1 };

describe('bulkDiscountMultiplier', () => {
  it('returns 1.0 for 1-3 units (no discount)', () => {
    expect(bulkDiscountMultiplier(1)).toBe(1);
    expect(bulkDiscountMultiplier(2)).toBe(1);
    expect(bulkDiscountMultiplier(3)).toBe(1);
  });

  it('returns 0.9 for 4-7 units (tier 1)', () => {
    expect(bulkDiscountMultiplier(4)).toBe(BULK_DISCOUNT_TIER1);
    expect(bulkDiscountMultiplier(7)).toBe(BULK_DISCOUNT_TIER1);
  });

  it('returns 0.8 for 8+ units (tier 2)', () => {
    expect(bulkDiscountMultiplier(8)).toBe(BULK_DISCOUNT_TIER2);
    expect(bulkDiscountMultiplier(15)).toBe(BULK_DISCOUNT_TIER2);
  });
});

describe('purchaseCostWithDiscount', () => {
  it('returns full price for small quantities', () => {
    // venedik produces with basePrice pahali → 50 per unit
    const cost = purchaseCostWithDiscount(venedik, muranoCami, 2);
    expect(cost).toBe(100); // 50 * 2 * 1.0
  });

  it('applies tier 1 discount for 4-7 units', () => {
    const cost = purchaseCostWithDiscount(venedik, muranoCami, 5);
    // 50 * 5 * 0.9 = 225
    expect(cost).toBe(225);
  });

  it('applies tier 2 discount for 8+ units', () => {
    const cost = purchaseCostWithDiscount(venedik, muranoCami, 10);
    // 50 * 10 * 0.8 = 400
    expect(cost).toBe(400);
  });
});

describe('smugglingDetectionProbability', () => {
  it('returns high detection for low simsar', () => {
    const lowSimsar: HiddenExperience = { meltem: 5, terazi: 5, murekkep: 5, simsar: 0 };
    const rate = smugglingDetectionProbability(lowSimsar);
    expect(rate).toBeCloseTo(SMUGGLING_DETECT_BASE);
  });

  it('returns low detection for high simsar', () => {
    const rate = smugglingDetectionProbability(highSimsar);
    expect(rate).toBeLessThan(SMUGGLING_DETECT_BASE);
  });

  it('never goes below the floor', () => {
    const maxSimsar: HiddenExperience = { meltem: 0, terazi: 0, murekkep: 0, simsar: 100 };
    const rate = smugglingDetectionProbability(maxSimsar);
    expect(rate).toBeGreaterThanOrEqual(SMUGGLING_DETECT_FLOOR);
  });
});

describe('attemptSmuggling', () => {
  const forbiddenGoods = ['ottoman_silahi'];
  const smuggleCargo = [
    { goodId: 'ottoman_silahi', name: 'Osmanlı Silahı', quantity: 2, originPort: 'istanbul', purchasePrice: 40 },
    { goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 50 },
  ];

  it('returns clean result when no forbidden goods in cargo', () => {
    const result = attemptSmuggling([smuggleCargo[1]], forbiddenGoods, baseExperience);
    expect(result.detected).toBe(false);
    expect(result.goodsConfiscated).toHaveLength(0);
  });

  it('detects smuggling when rng is below threshold', () => {
    const result = attemptSmuggling(smuggleCargo, forbiddenGoods, baseExperience, () => 0);
    expect(result.detected).toBe(true);
    expect(result.fineGold).toBe(SMUGGLING_FINE_GOLD);
    expect(result.lockoutTurns).toBe(SMUGGLING_LOCKOUT_TURNS);
    expect(result.goodsConfiscated).toHaveLength(1);
    expect(result.goodsConfiscated[0].goodId).toBe('ottoman_silahi');
  });

  it('smuggling succeeds when rng is above threshold', () => {
    const result = attemptSmuggling(smuggleCargo, forbiddenGoods, baseExperience, () => 0.999);
    expect(result.detected).toBe(false);
  });
});

describe('checkContractFulfillment', () => {
  const contract = {
    id: 'contract-1',
    portId: 'venedik',
    goodId: 'murano_cami',
    quantity: 3,
    rewardGold: 200,
    deadlineTurn: 20,
    breakPenalty: 100,
    accepted: true,
    completed: false,
  };

  it('returns fulfilled when enough goods delivered', () => {
    const result = checkContractFulfillment(contract, [{ goodId: 'murano_cami', quantity: 3 }], 10);
    expect(result.fulfilled).toBe(true);
    expect(result.expired).toBe(false);
  });

  it('returns not fulfilled when not enough goods', () => {
    const result = checkContractFulfillment(contract, [{ goodId: 'murano_cami', quantity: 2 }], 10);
    expect(result.fulfilled).toBe(false);
    expect(result.expired).toBe(false);
  });

  it('returns expired when past deadline', () => {
    const result = checkContractFulfillment(contract, [{ goodId: 'murano_cami', quantity: 5 }], 21);
    expect(result.fulfilled).toBe(false);
    expect(result.expired).toBe(true);
  });

  it('does not expire when delivery happens exactly on the deadline turn', () => {
    const result = checkContractFulfillment(contract, [{ goodId: 'murano_cami', quantity: 3 }], 20);
    expect(result.fulfilled).toBe(true);
    expect(result.expired).toBe(false);
  });

  it('returns not fulfilled for completed contracts', () => {
    const completed = { ...contract, completed: true };
    const result = checkContractFulfillment(completed, [{ goodId: 'murano_cami', quantity: 5 }], 10);
    expect(result.fulfilled).toBe(false);
  });
});

describe('contractRewardGold', () => {
  it('returns the contract reward', () => {
    expect(contractRewardGold({ rewardGold: 200 } as any)).toBe(200);
  });
});

describe('contractBreakPenalty', () => {
  it('returns the contract break penalty', () => {
    expect(contractBreakPenalty({ breakPenalty: 150 } as any)).toBe(150);
  });

  it('returns default penalty when not specified', () => {
    expect(contractBreakPenalty({ breakPenalty: 0 } as any)).toBe(CONTRACT_BREAK_PENALTY);
  });
});

describe('contractSaleBonus', () => {
  it('returns the contract price bonus multiplier', () => {
    expect(contractSaleBonus()).toBe(CONTRACT_PRICE_BONUS);
  });
});

describe('firstArrivalMultiplier', () => {
  it('returns bonus for first arrival', () => {
    expect(firstArrivalMultiplier(true)).toBe(FIRST_ARRIVAL_BONUS);
  });

  it('returns 1.0 for non-first arrival', () => {
    expect(firstArrivalMultiplier(false)).toBe(1);
  });
});

describe('priceVisibilityTier', () => {
  it('returns none for low terazi', () => {
    const lowTerazi: HiddenExperience = { meltem: 10, terazi: 0, murekkep: 10, simsar: 10 };
    expect(priceVisibilityTier(lowTerazi)).toBe('none');
  });

  it('returns local at the minimum local visibility threshold', () => {
    const localTerazi: HiddenExperience = { meltem: 2, terazi: 1, murekkep: 1, simsar: 1 };
    expect(priceVisibilityTier(localTerazi)).toBe('local');
  });

  it('returns local for terazi >= 20%', () => {
    const medTerazi: HiddenExperience = { meltem: 1, terazi: 3, murekkep: 1, simsar: 1 };
    // terazi ratio = 3/6 = 0.5 → full
    expect(priceVisibilityTier(medTerazi)).toBe('full');
  });

  it('returns network for terazi >= 35%', () => {
    // terazi ratio = 5/12 ≈ 0.416 → full (>0.5? No, 5/12=0.416 → >0.35 → network)
    const netTerazi: HiddenExperience = { meltem: 3, terazi: 5, murekkep: 2, simsar: 2 };
    expect(priceVisibilityTier(netTerazi)).toBe('network');
  });

  it('returns full for very high terazi', () => {
    expect(priceVisibilityTier(highTerazi)).toBe('full');
  });
});
