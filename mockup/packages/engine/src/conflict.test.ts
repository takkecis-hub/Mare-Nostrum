import { describe, expect, it } from 'vitest';
import type { HiddenExperience, Rumor, Route, Ship } from '../../shared/src/types/index.js';
import {
  DEBUNK_BASE_SUCCESS,
  DEBUNK_MAX_SUCCESS,
  TRACE_BASE_SUCCESS,
  TRACE_MAX_SUCCESS,
  COUNTER_RUMOR_BACKFIRE,
  KUSATMA_STOCK_SATURATION,
  KUSATMA_PRICE_SABOTAGE,
  KUSATMA_ROUTE_SCARE_BONUS,
  KUSATMA_ROUTE_SCARE_TURNS,
  ESCAPE_BASE_SUCCESS,
  ESCAPE_FELUKA_BONUS,
  ESCAPE_KADIRGA_PENALTY,
  ESCAPE_FAIL_ATTACKER_BONUS,
} from '../../shared/src/constants/index.js';
import {
  debunkSuccessRate,
  traceSuccessRate,
  counterRumorBackfireRate,
  executeRumorDefense,
  applyRumorDefenseEffect,
  executeKusatma,
  applyStockMonopoly,
  applyRouteScare,
  escapeSuccessRate,
  attemptEscape,
} from './conflict.js';

const baseExperience: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
const highMurekkep: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 10, simsar: 1 };
const highSimsar: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 10 };
const highMeltem: HiddenExperience = { meltem: 10, terazi: 1, murekkep: 1, simsar: 1 };

const sampleRumor: Rumor = {
  id: 'test-rumor-1',
  aboutPlayerId: 'player-1',
  text: 'Test rumor',
  tone: 'olumsuz',
  currentPorts: ['venedik'],
  strength: 100,
  age: 1,
  sourceAction: 'kara_bayrak',
};

const feluka: Ship = { type: 'feluka', cargoCapacity: 3, power: 2, durability: 80 };
const karaka: Ship = { type: 'karaka', cargoCapacity: 4, power: 3, durability: 100 };
const kadirga: Ship = { type: 'kadirga', cargoCapacity: 2, power: 3, durability: 100 };

const fixedRng = () => 0;
const alwaysSucceedRng = () => 0;
const alwaysFailRng = () => 0.999;

// ─────────────────────────────────────────────────────────────
// Rumor Defense
// ─────────────────────────────────────────────────────────────

describe('debunkSuccessRate', () => {
  it('returns base rate for balanced experience', () => {
    const rate = debunkSuccessRate(baseExperience);
    expect(rate).toBeGreaterThanOrEqual(DEBUNK_BASE_SUCCESS);
  });

  it('returns higher rate for high murekkep', () => {
    const rate = debunkSuccessRate(highMurekkep);
    expect(rate).toBeGreaterThan(debunkSuccessRate(baseExperience));
  });

  it('never exceeds max success rate', () => {
    const rate = debunkSuccessRate(highMurekkep);
    expect(rate).toBeLessThanOrEqual(DEBUNK_MAX_SUCCESS);
  });
});

describe('traceSuccessRate', () => {
  it('returns base rate for balanced experience', () => {
    const rate = traceSuccessRate(baseExperience);
    expect(rate).toBeGreaterThanOrEqual(TRACE_BASE_SUCCESS);
  });

  it('returns higher rate for high simsar', () => {
    const rate = traceSuccessRate(highSimsar);
    expect(rate).toBeGreaterThan(traceSuccessRate(baseExperience));
  });

  it('never exceeds max success rate', () => {
    const rate = traceSuccessRate(highSimsar);
    expect(rate).toBeLessThanOrEqual(TRACE_MAX_SUCCESS);
  });
});

describe('counterRumorBackfireRate', () => {
  it('returns positive rate for low murekkep', () => {
    const lowMurekkep: HiddenExperience = { meltem: 5, terazi: 5, murekkep: 0, simsar: 5 };
    const rate = counterRumorBackfireRate(lowMurekkep);
    expect(rate).toBeGreaterThan(0);
  });

  it('returns zero rate for high murekkep', () => {
    const rate = counterRumorBackfireRate(highMurekkep);
    expect(rate).toBe(0);
  });
});

describe('executeRumorDefense', () => {
  it('debunk succeeds with rng below success rate', () => {
    const result = executeRumorDefense('atese_su', sampleRumor, highMurekkep, alwaysSucceedRng);
    expect(result.action).toBe('atese_su');
    expect(result.success).toBe(true);
    expect(result.targetRumorId).toBe('test-rumor-1');
  });

  it('debunk fails with rng above success rate', () => {
    const result = executeRumorDefense('atese_su', sampleRumor, baseExperience, alwaysFailRng);
    expect(result.success).toBe(false);
  });

  it('trace reveals player id on success', () => {
    const result = executeRumorDefense('izi_surmek', sampleRumor, highSimsar, alwaysSucceedRng);
    expect(result.success).toBe(true);
    expect(result.tracedPlayerId).toBe('player-1');
  });

  it('trace does not reveal player id on failure', () => {
    const result = executeRumorDefense('izi_surmek', sampleRumor, baseExperience, alwaysFailRng);
    expect(result.success).toBe(false);
    expect(result.tracedPlayerId).toBeUndefined();
  });

  it('counter-rumor succeeds when no backfire', () => {
    const result = executeRumorDefense('karsi_soylenti', sampleRumor, highMurekkep, alwaysFailRng);
    expect(result.success).toBe(true);
    expect(result.backfired).toBe(false);
  });

  it('counter-rumor can backfire with low murekkep', () => {
    const lowMurekkep: HiddenExperience = { meltem: 5, terazi: 5, murekkep: 0, simsar: 5 };
    const result = executeRumorDefense('karsi_soylenti', sampleRumor, lowMurekkep, alwaysSucceedRng);
    expect(result.backfired).toBe(true);
    expect(result.success).toBe(false);
  });
});

describe('applyRumorDefenseEffect', () => {
  it('debunk success kills the rumor', () => {
    const defenseResult = { action: 'atese_su' as const, success: true, targetRumorId: sampleRumor.id };
    const result = applyRumorDefenseEffect([sampleRumor], defenseResult);
    expect(result).toHaveLength(0); // rumor strength set to 0, then filtered
  });

  it('debunk failure leaves rumor unchanged', () => {
    const defenseResult = { action: 'atese_su' as const, success: false, targetRumorId: sampleRumor.id };
    const result = applyRumorDefenseEffect([sampleRumor], defenseResult);
    expect(result).toHaveLength(1);
    expect(result[0].strength).toBe(100);
  });

  it('counter-rumor success reduces strength by 50', () => {
    const defenseResult = { action: 'karsi_soylenti' as const, success: true, targetRumorId: sampleRumor.id, backfired: false };
    const result = applyRumorDefenseEffect([sampleRumor], defenseResult);
    expect(result).toHaveLength(1);
    expect(result[0].strength).toBe(50);
  });

  it('counter-rumor backfire increases strength by 30', () => {
    const defenseResult = { action: 'karsi_soylenti' as const, success: false, targetRumorId: sampleRumor.id, backfired: true };
    const result = applyRumorDefenseEffect([{ ...sampleRumor, strength: 60 }], defenseResult);
    expect(result).toHaveLength(1);
    expect(result[0].strength).toBe(90);
  });

  it('counter-rumor backfire caps strength at 100', () => {
    const defenseResult = { action: 'karsi_soylenti' as const, success: false, targetRumorId: sampleRumor.id, backfired: true };
    const result = applyRumorDefenseEffect([sampleRumor], defenseResult);
    expect(result[0].strength).toBe(100);
  });

  it('trace success does not modify the rumor', () => {
    const defenseResult = { action: 'izi_surmek' as const, success: true, targetRumorId: sampleRumor.id, tracedPlayerId: 'player-1' };
    const result = applyRumorDefenseEffect([sampleRumor], defenseResult);
    expect(result).toHaveLength(1);
    expect(result[0].strength).toBe(100);
  });

  it('does not affect other rumors', () => {
    const otherRumor: Rumor = { ...sampleRumor, id: 'other-rumor', strength: 80 };
    const defenseResult = { action: 'atese_su' as const, success: true, targetRumorId: sampleRumor.id };
    const result = applyRumorDefenseEffect([sampleRumor, otherRumor], defenseResult);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('other-rumor');
    expect(result[0].strength).toBe(80);
  });
});

// ─────────────────────────────────────────────────────────────
// Economic Warfare (Kuşatma)
// ─────────────────────────────────────────────────────────────

describe('executeKusatma', () => {
  it('stok_ablukasi returns saturation delta', () => {
    const result = executeKusatma('stok_ablukasi', 'venedik');
    expect(result.action).toBe('stok_ablukasi');
    expect(result.targetPortId).toBe('venedik');
    expect(result.saturationDelta).toBe(KUSATMA_STOCK_SATURATION);
  });

  it('fiyat_sabotaji returns price multiplier', () => {
    const result = executeKusatma('fiyat_sabotaji', 'tunus');
    expect(result.action).toBe('fiyat_sabotaji');
    expect(result.priceMultiplier).toBe(KUSATMA_PRICE_SABOTAGE);
  });

  it('rota_korkutmasi returns scare turns', () => {
    const result = executeKusatma('rota_korkutmasi', 'palermo');
    expect(result.action).toBe('rota_korkutmasi');
    expect(result.scareTurns).toBe(KUSATMA_ROUTE_SCARE_TURNS);
  });

  it('bilgi_blokaji returns blocked flag', () => {
    const result = executeKusatma('bilgi_blokaji', 'istanbul');
    expect(result.action).toBe('bilgi_blokaji');
    expect(result.blocked).toBe(true);
  });
});

describe('applyStockMonopoly', () => {
  it('increases saturation by the stock saturation amount', () => {
    const saturation = { 'venedik:murano_cami': 1 };
    const result = applyStockMonopoly(saturation, 'venedik', 'murano_cami');
    expect(result['venedik:murano_cami']).toBe(1 + KUSATMA_STOCK_SATURATION);
  });

  it('creates saturation entry for new port+good combination', () => {
    const result = applyStockMonopoly({}, 'tunus', 'atlas');
    expect(result['tunus:atlas']).toBe(KUSATMA_STOCK_SATURATION);
  });

  it('does not modify other saturation entries', () => {
    const saturation = { 'tunus:atlas': 2, 'venedik:murano_cami': 1 };
    const result = applyStockMonopoly(saturation, 'tunus', 'atlas');
    expect(result['venedik:murano_cami']).toBe(1);
  });
});

describe('applyRouteScare', () => {
  const routes: Route[] = [
    { id: 'r1', from: 'venedik', to: 'ragusa', type: 'tramontana', isChokepoint: null, encounterChance: 0.1, turnsRequired: 1 },
    { id: 'r2', from: 'tunus', to: 'palermo', type: 'tramontana', isChokepoint: 'sicilya', encounterChance: 0.5, turnsRequired: 1 },
  ];

  it('increases encounter chance for routes from/to target port', () => {
    const result = applyRouteScare(routes, 'venedik');
    expect(result[0].encounterChance).toBe(0.1 + KUSATMA_ROUTE_SCARE_BONUS);
    expect(result[1].encounterChance).toBe(0.5); // unchanged
  });

  it('caps encounter chance at 1.0', () => {
    const highEncounterRoutes: Route[] = [
      { id: 'r1', from: 'venedik', to: 'ragusa', type: 'tramontana', isChokepoint: null, encounterChance: 0.9, turnsRequired: 1 },
    ];
    const result = applyRouteScare(highEncounterRoutes, 'venedik');
    expect(result[0].encounterChance).toBeLessThanOrEqual(1);
  });

  it('does not modify routes not connected to target port', () => {
    const result = applyRouteScare(routes, 'istanbul');
    expect(result[0].encounterChance).toBe(0.1);
    expect(result[1].encounterChance).toBe(0.5);
  });
});

// ─────────────────────────────────────────────────────────────
// Escape Mechanic
// ─────────────────────────────────────────────────────────────

describe('escapeSuccessRate', () => {
  it('returns base rate for karaka with balanced experience', () => {
    const rate = escapeSuccessRate(karaka, baseExperience);
    expect(rate).toBeCloseTo(ESCAPE_BASE_SUCCESS + baseExperience.meltem / 4 * 0.4, 1);
  });

  it('feluka gets escape bonus', () => {
    const felukaRate = escapeSuccessRate(feluka, baseExperience);
    const karakaRate = escapeSuccessRate(karaka, baseExperience);
    expect(felukaRate).toBeGreaterThan(karakaRate);
  });

  it('kadirga gets escape penalty', () => {
    const kadirgaRate = escapeSuccessRate(kadirga, baseExperience);
    const karakaRate = escapeSuccessRate(karaka, baseExperience);
    expect(kadirgaRate).toBeLessThan(karakaRate);
  });

  it('high meltem increases escape rate', () => {
    const rate = escapeSuccessRate(karaka, highMeltem);
    expect(rate).toBeGreaterThan(escapeSuccessRate(karaka, baseExperience));
  });

  it('rate is clamped between 0 and 1', () => {
    const rate = escapeSuccessRate(feluka, highMeltem);
    expect(rate).toBeLessThanOrEqual(1);
    expect(rate).toBeGreaterThanOrEqual(0);
  });
});

describe('attemptEscape', () => {
  it('succeeds when rng is below success rate', () => {
    const result = attemptEscape(feluka, highMeltem, alwaysSucceedRng);
    expect(result.escaped).toBe(true);
    expect(result.attackerBonus).toBe(0);
  });

  it('fails when rng is above success rate', () => {
    const result = attemptEscape(kadirga, baseExperience, alwaysFailRng);
    expect(result.escaped).toBe(false);
    expect(result.attackerBonus).toBe(ESCAPE_FAIL_ATTACKER_BONUS);
  });
});
