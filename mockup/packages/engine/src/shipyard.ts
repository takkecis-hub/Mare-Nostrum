import type { Ship } from '../../shared/src/types/index.js';

/** Base repair cost per durability point. */
const COST_PER_POINT = 4;

/** Shipyard discount factor for ports with 'tersane' special. */
const SHIPYARD_DISCOUNT = 0.75;

export interface RepairResult {
  repairedShip: Ship;
  goldSpent: number;
  durabilityRestored: number;
}

/**
 * Return the effective cost-per-point, applying tersane discount if applicable.
 */
function effectiveCostPerPoint(portSpecials: string[]): number {
  return portSpecials.includes('tersane')
    ? Math.ceil(COST_PER_POINT * SHIPYARD_DISCOUNT)
    : COST_PER_POINT;
}

/**
 * Calculate the gold cost to fully repair a ship.
 * Ports with a 'tersane' special tag get a 25 % discount.
 */
export function repairCost(ship: Ship, portSpecials: string[]): number {
  const pointsNeeded = 100 - ship.durability;
  if (pointsNeeded <= 0) return 0;

  return pointsNeeded * effectiveCostPerPoint(portSpecials);
}

/**
 * Repair a ship as much as the player can afford.
 * Returns the updated ship, gold spent, and durability restored.
 */
export function repairShip(
  ship: Ship,
  availableGold: number,
  portSpecials: string[],
): RepairResult {
  const pointsNeeded = 100 - ship.durability;
  if (pointsNeeded <= 0 || availableGold <= 0) {
    return { repairedShip: { ...ship }, goldSpent: 0, durabilityRestored: 0 };
  }

  const costPerPoint = effectiveCostPerPoint(portSpecials);
  const affordablePoints = Math.min(pointsNeeded, Math.floor(availableGold / costPerPoint));
  const goldSpent = affordablePoints * costPerPoint;

  return {
    repairedShip: { ...ship, durability: ship.durability + affordablePoints },
    goldSpent,
    durabilityRestored: affordablePoints,
  };
}
