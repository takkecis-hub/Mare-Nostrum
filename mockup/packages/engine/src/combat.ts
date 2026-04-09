import type { CombatResult, HiddenExperience, Ship, Tactic } from '../../shared/src/types/index.js';
import {
  COMBAT_DICE_MIN,
  COMBAT_DICE_MAX,
  MELTEM_BONUS_CAP,
  COMBAT_LOSS_GOLD,
  COMBAT_LOSS_DURABILITY,
  COMBAT_LOOT_GOLD,
  SHIPWRECK_RESPAWN_GOLD,
} from '../../shared/src/constants/index.js';

const counters: Record<Tactic, Tactic | null> = {
  pruva: 'ates',
  ates: 'manevra',
  manevra: 'pruva',
  kacis: null,
};

/** Roll a d6 (1-6). Accepts an optional RNG for deterministic tests. */
export function rollCombatDie(rng: () => number = Math.random): number {
  return COMBAT_DICE_MIN + Math.floor(rng() * (COMBAT_DICE_MAX - COMBAT_DICE_MIN + 1));
}

export function calculatePower(
  ship: Ship,
  tactic: Tactic,
  experience: HiddenExperience,
  dieRoll = 0,
) {
  const base = ship.power + ship.durability / 50;

  const total = experience.meltem + experience.terazi + experience.murekkep + experience.simsar;
  const meltemRatio = total > 0 ? experience.meltem / total : 0;
  const meltemBonus = experience.meltem > experience.terazi
    ? Math.min(MELTEM_BONUS_CAP, meltemRatio * 2)
    : 0;

  let tacticBonus = 0;
  if (tactic === 'pruva' && ship.type === 'kadirga') {
    tacticBonus = 1;
  } else if (tactic === 'manevra' && ship.type === 'feluka') {
    tacticBonus = 1;
  }
  return Math.round((base + meltemBonus + tacticBonus + dieRoll) * 100) / 100;
}

const ENEMY_TACTICS: Tactic[] = ['pruva', 'ates', 'manevra'];

/** Pick an enemy tactic using the injectable RNG instead of always 'ates'. */
function pickEnemyTactic(rng: () => number): Tactic {
  return ENEMY_TACTICS[Math.floor(rng() * ENEMY_TACTICS.length)];
}

export function resolveCombat(options: {
  playerShip: Ship;
  playerExperience: HiddenExperience;
  playerTactic: Tactic;
  enemyShip?: Ship;
  enemyTactic?: Tactic;
  rng?: () => number;
}): CombatResult {
  const rng = options.rng ?? Math.random;
  const enemyShip = options.enemyShip ?? { type: 'karaka' as const, cargoCapacity: 4, power: 2, durability: 80 };
  const enemyTactic = options.enemyTactic ?? pickEnemyTactic(rng);
  const enemyExperience: HiddenExperience = { meltem: 2, terazi: 1, murekkep: 0, simsar: 1 };

  const playerDie = rollCombatDie(rng);
  const enemyDie = rollCombatDie(rng);

  const playerPower = calculatePower(options.playerShip, options.playerTactic, options.playerExperience, playerDie);
  const enemyPower = calculatePower(enemyShip, enemyTactic, enemyExperience, enemyDie);

  let result: 'kazandi' | 'kaybetti' | 'kacti' = 'kaybetti';
  let manevraIntel = false;

  if (options.playerTactic === 'kacis') {
    result = playerPower >= enemyPower ? 'kacti' : 'kaybetti';
  } else if (counters[options.playerTactic] === enemyTactic) {
    result = 'kazandi';
    if (options.playerTactic === 'manevra') {
      manevraIntel = true;
    }
  } else if (playerPower > enemyPower) {
    result = 'kazandi';
  }

  // Calculate gold and durability deltas
  let goldDelta = 0;
  let durabilityDelta = 0;
  let shipwrecked = false;

  if (result === 'kazandi') {
    goldDelta = COMBAT_LOOT_GOLD + Math.floor(enemyPower * 2);
  } else if (result === 'kaybetti') {
    const powerDiff = Math.max(0, enemyPower - playerPower);
    goldDelta = -(COMBAT_LOSS_GOLD + Math.floor(powerDiff * 3));
    durabilityDelta = -(COMBAT_LOSS_DURABILITY + Math.floor(powerDiff * 2));

    // Check for shipwreck
    const newDurability = options.playerShip.durability + durabilityDelta;
    if (newDurability <= 0) {
      shipwrecked = true;
    }
  }

  return {
    result,
    tactic: options.playerTactic,
    enemyTactic,
    playerPower,
    enemyPower,
    goldDelta,
    durabilityDelta,
    shipwrecked,
    manevraIntel,
  };
}
