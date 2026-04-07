import { describe, expect, it } from 'vitest';
import type { HiddenExperience, Ship } from '../../shared/src/types/index.js';
import { calculatePower, resolveCombat } from './combat.js';

const baseExperience: HiddenExperience = { meltem: 1, terazi: 2, murekkep: 1, simsar: 0 };
const meltemDominant: HiddenExperience = { meltem: 5, terazi: 1, murekkep: 1, simsar: 0 };

const karaka: Ship = { type: 'karaka', cargoCapacity: 4, power: 3, durability: 100 };
const kadirga: Ship = { type: 'kadirga', cargoCapacity: 2, power: 3, durability: 100 };
const feluka: Ship = { type: 'feluka', cargoCapacity: 3, power: 2, durability: 80 };

describe('calculatePower', () => {
  it('returns base calculation without bonuses', () => {
    // base = power + durability / 50 = 3 + 100/50 = 5, no bonuses
    expect(calculatePower(karaka, 'ates', baseExperience)).toBe(5);
  });

  it('adds meltem bonus when meltem > terazi', () => {
    // base = 5, meltemBonus = 0.5
    expect(calculatePower(karaka, 'ates', meltemDominant)).toBe(5.5);
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
    // karaka + pruva: no bonus
    expect(calculatePower(karaka, 'pruva', baseExperience)).toBe(5);
    // kadirga + manevra: no bonus, base = 3 + 100/50 = 5
    expect(calculatePower(kadirga, 'manevra', baseExperience)).toBe(5);
  });
});

describe('resolveCombat', () => {
  it('pruva beats ates via counter', () => {
    // enemy defaults to karaka power 2, tactic 'ates'
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
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
    });
    expect(result.result).toBe('kazandi');
  });

  it('kacis escapes when player power >= enemy power', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'kacis',
    });
    // player power 5 vs enemy (karaka power 2 dur 80 = 3.6) → player stronger → kacti
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
    });
    expect(result.result).toBe('kaybetti');
  });

  it('kaybetti when tactic=pruva vs enemy manevra (enemy counter)', () => {
    // manevra counters pruva, player power not > enemy power
    const weakShip: Ship = { type: 'karaka', cargoCapacity: 4, power: 1, durability: 50 };
    const strongEnemy: Ship = { type: 'karaka', cargoCapacity: 4, power: 5, durability: 100 };
    const result = resolveCombat({
      playerShip: weakShip,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyShip: strongEnemy,
      enemyTactic: 'manevra',
    });
    expect(result.result).toBe('kaybetti');
  });

  it('returns tactic and power info in result', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'ates',
    });
    expect(result.tactic).toBe('ates');
    expect(typeof result.playerPower).toBe('number');
    expect(typeof result.enemyPower).toBe('number');
  });
});
