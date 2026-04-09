import { describe, expect, it } from 'vitest';
import type { HiddenExperience, Ship } from '../../shared/src/types/index.js';
import {
  COMBAT_LOSS_GOLD,
  COMBAT_LOSS_DURABILITY,
  COMBAT_LOOT_GOLD,
} from '../../shared/src/constants/index.js';
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
    // base = power + durability / 50 = 3 + 100/50 = 5, tacticBonus=1 (karaka+ates), dieRoll=0
    expect(calculatePower(karaka, 'ates', baseExperience)).toBe(6);
  });

  it('adds capped meltem bonus when meltem > terazi', () => {
    // meltemDominant: meltem=5, total=7, ratio=5/7≈0.714, bonus=min(1.0, 1.43)=1.0
    // base = 5, meltemBonus = 1.0, tacticBonus=1 (karaka+ates) → 7
    expect(calculatePower(karaka, 'ates', meltemDominant)).toBe(7);
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
    // base = 5, tacticBonus = 1 (karaka+ates), dieRoll = 3 → 9
    expect(calculatePower(karaka, 'ates', baseExperience, 3)).toBe(9);
  });
});

describe('resolveCombat', () => {
  it('pruva beats ates via counter', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyTactic: 'ates',
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
    // base=5, tacticBonus=1 (karaka+ates) → 6
    expect(calculatePower(karaka, 'ates', equalExp)).toBe(6);
  });

  it('gives no meltem bonus when meltem is less than terazi', () => {
    const teraziDominant: HiddenExperience = { meltem: 1, terazi: 5, murekkep: 1, simsar: 0 };
    // base=5, tacticBonus=1 (karaka+ates) → 6
    expect(calculatePower(karaka, 'ates', teraziDominant)).toBe(6);
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

describe('calculatePower – additional coverage', () => {
  it('returns base power when all experience values are zero', () => {
    const zeroExp: HiddenExperience = { meltem: 0, terazi: 0, murekkep: 0, simsar: 0 };
    // base = 3 + 100/50 = 5, tacticBonus=1 (karaka+ates), total=0 → meltemBonus=0 → 6
    expect(calculatePower(karaka, 'ates', zeroExp)).toBe(6);
  });

  it('computes base correctly when ship durability is 0', () => {
    const zeroDurShip: Ship = { type: 'karaka', cargoCapacity: 4, power: 3, durability: 0 };
    // base = 3 + 0/50 = 3, tacticBonus=1 (karaka+ates) → 4
    expect(calculatePower(zeroDurShip, 'ates', baseExperience)).toBe(4);
  });

  it('computes base correctly when ship durability is 1', () => {
    const lowDurShip: Ship = { type: 'karaka', cargoCapacity: 4, power: 3, durability: 1 };
    // base = 3 + 1/50 = 3.02, tacticBonus=1 (karaka+ates) → 4.02
    expect(calculatePower(lowDurShip, 'ates', baseExperience)).toBe(4.02);
  });

  it('kacis tactic gives no tactic bonus regardless of ship type', () => {
    // kadirga normally gets bonus with pruva, but not with kacis
    expect(calculatePower(kadirga, 'kacis', baseExperience)).toBe(5);
    // feluka normally gets bonus with manevra, but not with kacis
    expect(calculatePower(feluka, 'kacis', baseExperience)).toBe(3.6);
    expect(calculatePower(karaka, 'kacis', baseExperience)).toBe(5);
  });

  it('ates tactic gives tactic bonus only for karaka', () => {
    // karaka + ates → tacticBonus=1 → 6
    expect(calculatePower(karaka, 'ates', baseExperience)).toBe(6);
    // kadirga + ates → no bonus → 5
    expect(calculatePower(kadirga, 'ates', baseExperience)).toBe(5);
    // feluka + ates → no bonus → 3.6
    expect(calculatePower(feluka, 'ates', baseExperience)).toBe(3.6);
  });

  it('applies uncapped meltem bonus when ratio is low', () => {
    // meltem=3, terazi=2, murekkep=5, simsar=5 → total=15
    // meltemRatio = 3/15 = 0.2, meltem(3)>terazi(2) → bonus = min(1.0, 0.4) = 0.4
    const lowMeltemExp: HiddenExperience = { meltem: 3, terazi: 2, murekkep: 5, simsar: 5 };
    // base = 5, meltemBonus = 0.4, tacticBonus = 1 (karaka+ates) → 6.4
    expect(calculatePower(karaka, 'ates', lowMeltemExp)).toBe(6.4);
  });
});

describe('resolveCombat – goldDelta/durabilityDelta details', () => {
  it('on win: goldDelta equals COMBAT_LOOT_GOLD + floor(enemyPower * 2)', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.goldDelta).toBe(COMBAT_LOOT_GOLD + Math.floor(result.enemyPower * 2));
  });

  it('on win: durabilityDelta is 0', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.durabilityDelta).toBe(0);
  });

  it('on win: shipwrecked is false', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.shipwrecked).toBe(false);
  });

  it('on escape: goldDelta, durabilityDelta are 0 and shipwrecked is false', () => {
    const result = resolveCombat({
      playerShip: kadirga,
      playerExperience: meltemDominant,
      playerTactic: 'kacis',
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kacti');
    expect(result.goldDelta).toBe(0);
    expect(result.durabilityDelta).toBe(0);
    expect(result.shipwrecked).toBe(false);
  });

  it('on loss: goldDelta matches -(COMBAT_LOSS_GOLD + floor(powerDiff * 3))', () => {
    const strongEnemy: Ship = { type: 'kadirga', cargoCapacity: 2, power: 6, durability: 100 };
    const result = resolveCombat({
      playerShip: feluka,
      playerExperience: baseExperience,
      playerTactic: 'ates',
      enemyShip: strongEnemy,
      enemyTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
    const powerDiff = Math.max(0, result.enemyPower - result.playerPower);
    expect(result.goldDelta).toBe(-(COMBAT_LOSS_GOLD + Math.floor(powerDiff * 3)));
  });

  it('on loss: durabilityDelta matches -(COMBAT_LOSS_DURABILITY + floor(powerDiff * 2))', () => {
    const strongEnemy: Ship = { type: 'kadirga', cargoCapacity: 2, power: 6, durability: 100 };
    const result = resolveCombat({
      playerShip: feluka,
      playerExperience: baseExperience,
      playerTactic: 'ates',
      enemyShip: strongEnemy,
      enemyTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.result).toBe('kaybetti');
    const powerDiff = Math.max(0, result.enemyPower - result.playerPower);
    expect(result.durabilityDelta).toBe(-(COMBAT_LOSS_DURABILITY + Math.floor(powerDiff * 2)));
  });

  it('manevraIntel is false for pruva counter win', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.manevraIntel).toBe(false);
  });

  it('manevraIntel is false for ates counter win', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'ates',
      enemyShip: karaka,
      enemyTactic: 'manevra',
      rng: fixedRng,
    });
    expect(result.result).toBe('kazandi');
    expect(result.manevraIntel).toBe(false);
  });
});

describe('resolveCombat – default enemy', () => {
  it('uses default enemy (karaka, power 2, durability 80) when enemyShip not provided', () => {
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyTactic: 'ates',
      rng: fixedRng,
    });
    // Default enemy: {type:'karaka', power:2, durability:80}
    // enemyPower = round((2 + 80/50 + 1.0 + 1 + 1) * 100) / 100 = 6.6
    // (karaka+ates now gives +1 tacticBonus)
    expect(result.enemyPower).toBe(6.6);
  });

  it('picks enemy tactic from RNG when not provided', () => {
    // With fixedRng (always 0), pickEnemyTactic picks index 0 → 'pruva'
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      rng: fixedRng,
    });
    expect(result.enemyTactic).toBe('pruva');
  });

  it('custom enemyShip overrides the default', () => {
    const customEnemy: Ship = { type: 'feluka', cargoCapacity: 3, power: 1, durability: 50 };
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      enemyShip: customEnemy,
      rng: fixedRng,
    });
    // Custom enemy: base=1+50/50=2, meltemBonus=1.0, die=1 (fixedRng) → 4.0
    // Default would be 5.6, confirming override
    expect(result.enemyPower).toBe(4);
  });
});

describe('resolveCombat – enemy tactic selection', () => {
  it('picks a valid enemy tactic from RNG when none is specified', () => {
    const validTactics = ['pruva', 'ates', 'manevra'];
    const result = resolveCombat({
      playerShip: karaka,
      playerExperience: baseExperience,
      playerTactic: 'pruva',
      rng: fixedRng,
    });
    expect(validTactics).toContain(result.enemyTactic);
  });

  it('uses different enemy tactics for different RNG seeds', () => {
    const tactics = new Set<string>();
    // rng() = 0 → index 0 → pruva; rng() = 0.5 → index 1 → ates; rng() = 0.99 → index 2 → manevra
    for (const seed of [0, 0.34, 0.67]) {
      const result = resolveCombat({
        playerShip: karaka,
        playerExperience: baseExperience,
        playerTactic: 'pruva',
        rng: () => seed,
      });
      tactics.add(result.enemyTactic);
    }
    expect(tactics.size).toBeGreaterThanOrEqual(2);
  });
});

describe('calculatePower – karaka ates tactic bonus', () => {
  it('adds +1 tactic bonus for karaka with ates', () => {
    // base = 3 + 100/50 = 5, tacticBonus=1 (karaka+ates) → 6
    const power = calculatePower(karaka, 'ates', baseExperience);
    expect(power).toBe(6);
  });

  it('does not add bonus for karaka with other tactics', () => {
    expect(calculatePower(karaka, 'pruva', baseExperience)).toBe(5);
    expect(calculatePower(karaka, 'manevra', baseExperience)).toBe(5);
    expect(calculatePower(karaka, 'kacis', baseExperience)).toBe(5);
  });

  it('each ship has exactly one tactic bonus', () => {
    // kadirga + pruva → +1
    expect(calculatePower(kadirga, 'pruva', baseExperience)).toBe(6);
    // feluka + manevra → +1
    expect(calculatePower(feluka, 'manevra', baseExperience)).toBe(4.6);
    // karaka + ates → +1
    expect(calculatePower(karaka, 'ates', baseExperience)).toBe(6);
  });
});
