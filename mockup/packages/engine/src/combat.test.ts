import { describe, expect, it } from 'vitest';
import type { HiddenExperience, Ship } from '../../shared/src/types/index.js';
import { calculatePower, resolveCombat, rollCombatDie } from './combat.js';

const baseExperience: HiddenExperience = { meltem: 1, terazi: 2, murekkep: 1, simsar: 0 };
const meltemDominant: HiddenExperience = { meltem: 5, terazi: 1, murekkep: 1, simsar: 0 };

const karaka: Ship = { type: 'karaka', cargoCapacity: 4, power: 3, durability: 100 };
const kadirga: Ship = { type: 'kadirga', cargoCapacity: 2, power: 3, durability: 100 };
const feluka: Ship = { type: 'feluka', cargoCapacity: 3, power: 2, durability: 80 };

/** Deterministic RNG that always returns 0 → die roll = 1. */
const fixedRng = () => 0;

describe('rollCombatDie', () => {
  it('returns min die for rng=0', () => {
    expect(rollCombatDie(() => 0)).toBe(1);
  });

  it('returns max die for rng≈1', () => {
    expect(rollCombatDie(() => 0.999)).toBe(6);
  });

  it('returns a value in the 1-6 range', () => {
    const result = rollCombatDie();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });
});

describe('calculatePower', () => {
  it('returns base calculation without bonuses (no die)', () => {
    // base = power + durability / 50 = 3 + 100/50 = 5, no bonuses, dieRoll=0
    expect(calculatePower(karaka, 'ates', baseExperience)).toBe(5);
  });

  it('adds capped meltem bonus when meltem > terazi', () => {
    // meltemDominant: meltem=5, total=7, ratio=5/7≈0.714, bonus=min(1.0, 1.43)=1.0
    // base = 5, meltemBonus = 1.0
    expect(calculatePower(karaka, 'ates', meltemDominant)).toBe(6);
  });

  it('adds tactic bonus for kadirga + pruva', () => {
    // base = 5, tacticBonus = 1
    expect(calculatePower(kadirga, 'pruva', baseExperience)).toBe(6);
  });

  it('adds tactic bonus for feluka + manevra', () => {
    // base = 2 + 80/50 = 3.6, tacticBonus = 1
    expect(calculatePower(feluka, 'manevra', baseExperience)).toBe(4.6);
  });

  it('gives no tactic bonus for wrong ship/tactic combo', () => {
    expect(calculatePower(karaka, 'pruva', baseExperience)).toBe(5);
    expect(calculatePower(kadirga, 'manevra', baseExperience)).toBe(5);
  });

  it('adds die roll to power when provided', () => {
    // base = 5, dieRoll = 3
    expect(calculatePower(karaka, 'ates', baseExperience, 3)).toBe(8);
  });
});

describe('resolveCombat', () => {
  it('pruva beats ates via counter', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.enemyTactic).toBe('ates');
  });

  it('player wins when higher power even without counter', () => {
    const strongShip: Ship = { type: 'karaka', cargoCapacity: 4, power: 10, durability: 100 };
    const result = resolveCombat({
      playerShip: strongShip,
      playerExperience: baseExperience,
      playerTactic: 'manevra',
      enemyTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
  });

  it('kacis escapes when player power >= enemy power', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'kacis',
      rng: fixedRng,
    });
    // player: base=5 +0 +0 +1(die) = 6
    // enemy: base=3.6 +1.0(meltem) +0 +1(die) = 5.6
    expect(result.result).toBe('kacti');
  });

  it('kacis loses when player is weaker', () => {
    const weakShip: Ship = { type: 'feluka', cargoCapacity: 3, power: 1, durability: 50 };
    const strongEnemy: Ship = { type: 'karaka', cargoCapacity: 4, power: 10, durability: 100 };
    const result = resolveCombat({
      playerShip: weakShip,
      playerExperience: baseExperience,
      playerTactic: 'kacis',
      enemyShip: strongEnemy,
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
  });

  it('kaybetti when tactic=pruva vs enemy manevra (enemy counter)', () => {
    const weakShip: Ship = { type: 'karaka', cargoCapacity: 4, power: 1, durability: 50 };
    const strongEnemy: Ship = { type: 'karaka', cargoCapacity: 4, power: 5, durability: 100 };
    const result = resolveCombat({
      playerShip: weakShip,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyShip: strongEnemy,
      enemyTactic: 'manevra',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
  });

  it('returns tactic and power info in result', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.tactic).toBe('ates');
    expect(typeof result.playerPower).toBe('number');
    expect(typeof result.enemyPower).toBe('number');
  });

  it('returns goldDelta, durabilityDelta, and shipwrecked fields', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      rng: fixedRng,
    });
    expect(typeof result.goldDelta).toBe('number');
    expect(typeof result.durabilityDelta).toBe('number');
    expect(typeof result.shipwrecked).toBe('boolean');
  });

  it('awards loot gold on combat win', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.goldDelta).toBeGreaterThan(0);
  });

  it('loses gold and durability on combat loss', () => {
    const weakShip: Ship = { type: 'feluka', cargoCapacity: 3, power: 1, durability: 50 };
    const strongEnemy: Ship = { type: 'karaka', cargoCapacity: 4, power: 10, durability: 100 };
    const result = resolveCombat({
      playerShip: weakShip,
      playerExperience: baseExperience,
      playerTactic: 'kacis',
      enemyShip: strongEnemy,
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
    expect(result.goldDelta).toBeLessThan(0);
    expect(result.durabilityDelta).toBeLessThan(0);
  });

  it('sets shipwrecked true when durability would reach 0', () => {
    const fragileShip: Ship = { type: 'feluka', cargoCapacity: 3, power: 1, durability: 10 };
    const strongEnemy: Ship = { type: 'karaka', cargoCapacity: 4, power: 10, durability: 100 };
    const result = resolveCombat({
      playerShip: fragileShip,
      playerExperience: baseExperience,
      playerTactic: 'ates',
      enemyShip: strongEnemy,
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
    expect(result.shipwrecked).toBe(true);
  });

  it('sets manevraIntel true when manevra counters pruva', () => {
    const result = resolveCombat({
      playerShip: feluka,
      playerExperience: baseExperience,
      playerTactic: 'manevra',
      enemyTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.manevraIntel).toBe(true);
  });
});

describe('calculatePower – edge cases', () => {
  it('gives no meltem bonus when meltem equals terazi', () => {
    const equalExp: HiddenExperience = { meltem: 3, terazi: 3, murekkep: 1, simsar: 1 };
    expect(calculatePower(karaka, 'ates', equalExp)).toBe(5);
  });

  it('gives no meltem bonus when meltem is less than terazi', () => {
    const teraziDominant: HiddenExperience = { meltem: 1, terazi: 5, murekkep: 1, simsar: 0 };
    expect(calculatePower(karaka, 'ates', teraziDominant)).toBe(5);
  });

  it('stacks meltem bonus and tactic bonus for kadirga + pruva + high meltem', () => {
    // base = 5, tacticBonus = 1, meltemBonus = 1.0 (capped) → total = 7.0
    expect(calculatePower(kadirga, 'pruva', meltemDominant)).toBe(7);
  });
});

describe('resolveCombat – edge cases', () => {
  it('kaybetti when equal power and no counter advantage', () => {
    // player: karaka + manevra + baseExperience → no meltem (meltem<terazi), no tactic
    // enemy: karaka + manevra + hardcoded exp → meltem bonus 1.0
    // With same dice (fixedRng), enemy is stronger due to meltem
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'manevra',
      enemyShip: karaka,
      enemyTactic: 'manevra',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
  });

  it('ates beats manevra via counter', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'ates',
      enemyShip: karaka,
      enemyTactic: 'manevra',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
  });

  it('kazandi when player has counter against enemy tactic regardless of power', () => {
    const result = resolveCombat({
      playerShip: feluka,
      playerExperience: baseExperience,
      playerTactic: 'manevra',
      enemyShip: karaka,
      enemyTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
  });
});
