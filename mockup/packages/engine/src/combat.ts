import type { HiddenExperience, Ship, Tactic } from '../../shared/src/types/index.js';

const counters: Record<Tactic, Tactic | null> = {
  pruva: 'ates',
  ates: 'manevra',
  manevra: 'pruva',
  kacis: null,
};

export function calculatePower(ship: Ship, tactic: Tactic, experience: HiddenExperience) {
  const base = ship.power + ship.durability / 50;
  const meltemBonus = experience.meltem > experience.terazi ? 0.5 : 0;
  let tacticBonus = 0;
  if (tactic === 'pruva' && ship.type === 'kadirga') {
    tacticBonus = 1;
  } else if (tactic === 'manevra' && ship.type === 'feluka') {
    tacticBonus = 1;
  }
  return Math.round((base + meltemBonus + tacticBonus) * 100) / 100;
}

export function resolveCombat(options: {
  playerShip: Ship;
  playerExperience: HiddenExperience;
  playerTactic: Tactic;
  enemyShip?: Ship;
  enemyTactic?: Tactic;
}) {
  const enemyShip = options.enemyShip ?? { type: 'karaka', cargoCapacity: 4, power: 2, durability: 80 };
  const enemyTactic = options.enemyTactic ?? 'ates';
  const enemyExperience: HiddenExperience = { meltem: 2, terazi: 1, murekkep: 0, simsar: 1 };

  const playerPower = calculatePower(options.playerShip, options.playerTactic, options.playerExperience);
  const enemyPower = calculatePower(enemyShip, enemyTactic, enemyExperience);

  let result: 'kazandi' | 'kaybetti' | 'kacti' = 'kaybetti';
  if (options.playerTactic === 'kacis') {
    result = playerPower >= enemyPower ? 'kacti' : 'kaybetti';
  } else if (counters[options.playerTactic] === enemyTactic || playerPower > enemyPower) {
    result = 'kazandi';
  }

  return {
    result,
    tactic: options.playerTactic,
    enemyTactic,
    playerPower,
    enemyPower,
  };
}
