import type { CargoItem, Good, GoodCategory, Port, PriceBand, SmuggleResult, CityContract, PriceVisibilityTier, HiddenExperience } from '../../shared/src/types/index.js';
import {
  SATURATION_PRICE_STEP,
  SATURATION_PRICE_FLOOR,
  PRICE_BAND_MAP,
  GOOD_PURCHASE_COST,
  KABOTAJ_TRADE_BONUS,
  SEASON_YEMEK_BONUS_KIS,
  SEASON_LUKS_BONUS_YAZ,
  SEASON_YEMEK_MALUS_YAZ,
  SEASON_LUKS_MALUS_KIS,
  BULK_DISCOUNT_TIER1_MIN,
  BULK_DISCOUNT_TIER2_MIN,
  BULK_DISCOUNT_TIER1,
  BULK_DISCOUNT_TIER2,
  SMUGGLING_DETECT_BASE,
  SMUGGLING_DETECT_FLOOR,
  SMUGGLING_FINE_GOLD,
  SMUGGLING_LOCKOUT_TURNS,
  CONTRACT_PRICE_BONUS,
  CONTRACT_BREAK_PENALTY,
  FIRST_ARRIVAL_BONUS,
  PRICE_VISIBILITY_LOCAL,
  PRICE_VISIBILITY_NETWORK,
  PRICE_VISIBILITY_FULL,
} from '../../shared/src/constants/index.js';
import { getExperienceRatios } from '../../shared/src/formulas/index.js';

export function priceIndicatorForPort(port: Port, good: Good) {
  if (port.produces.good === good.id) {
    return 2;
  }

  if (port.desires.good === good.id) {
    return 5;
  }

  return good.priceIndicator;
}

/**
 * Return the purchase cost of a good at a given port using the port's
 * basePrice band. Falls back to GOOD_PURCHASE_COST when no band matches.
 */
export function purchaseCostForGood(port: Port, good: Good): number {
  // Currently uses only the port's basePrice band; the good parameter is
  // available for future per-good pricing rules (e.g. quality tiers).
  void good;
  return PRICE_BAND_MAP[port.produces.basePrice] ?? GOOD_PURCHASE_COST;
}

/**
 * Return a sell-price multiplier for the season + good category combination.
 * Yaz (summer): yemek cheap (×0.85), lüks expensive (×1.2).
 * Kış (winter): yemek expensive (×1.3), lüks cheap (×0.85).
 * Savaş goods are unaffected by season.
 */
export function seasonMultiplier(season: 'yaz' | 'kis', category: GoodCategory): number {
  if (season === 'yaz') {
    if (category === 'yemek') return SEASON_YEMEK_MALUS_YAZ;
    if (category === 'luks') return SEASON_LUKS_BONUS_YAZ;
  } else {
    if (category === 'yemek') return SEASON_YEMEK_BONUS_KIS;
    if (category === 'luks') return SEASON_LUKS_MALUS_KIS;
  }
  return 1;
}

/**
 * Return a sale-value multiplier based on the good's base-price band.
 * Pahali goods sell for more, ucuz goods sell for less.
 */
export function basePriceMultiplier(basePrice: PriceBand): number {
  if (basePrice === 'pahali') return 1.25;
  if (basePrice === 'ucuz') return 0.85;
  return 1; // normal
}

/**
 * Return the saturation multiplier for a specific good at a specific port.
 * Each prior delivery reduces the price by SATURATION_PRICE_STEP, floored at
 * SATURATION_PRICE_FLOOR.
 */
export function saturationMultiplier(portId: string, goodId: string, saturation: Record<string, number>): number {
  const key = `${portId}:${goodId}`;
  const count = saturation[key] ?? 0;
  return Math.max(SATURATION_PRICE_FLOOR, 1 - SATURATION_PRICE_STEP * count);
}

/**
 * Determine the effective basePrice band for a good at a port.
 * If the port desires the good, use the port's desires.basePrice;
 * otherwise default to 'normal'.
 */
function effectiveBasePrice(port: Port, good: Good): PriceBand {
  return port.desires.good === good.id ? port.desires.basePrice : 'normal';
}

export function sellCargoAtPort(
  cargo: CargoItem[],
  goods: Good[],
  port: Port,
  saturation: Record<string, number> = {},
  options: { routeBonus?: number; season?: 'yaz' | 'kis' } = {},
) {
  const sold: string[] = [];
  let goldDelta = 0;
  let stars = 1;
  const saturationUpdates: Record<string, number> = {};

  const routeBonus = options.routeBonus ?? 1;
  const season = options.season;

  const remainingCargo = cargo.filter((item) => {
    const good = goods.find((candidate) => candidate.id === item.goodId);
    if (!good) {
      return true;
    }

    const indicator = priceIndicatorForPort(port, good);
    const satMult = saturationMultiplier(port.id, good.id, saturation);
    const seasonMult = season ? seasonMultiplier(season, good.category) : 1;
    const bpMult = basePriceMultiplier(effectiveBasePrice(port, good));
    const saleValue = Math.round(indicator * 20 * item.quantity * satMult * routeBonus * seasonMult * bpMult);
    if (saleValue <= item.purchasePrice * item.quantity) {
      return true;
    }

    sold.push(`${item.name} x${item.quantity}`);
    goldDelta += saleValue;
    stars = Math.max(stars, Math.min(4, indicator - 1));

    // Track saturation increase
    const key = `${port.id}:${good.id}`;
    saturationUpdates[key] = (saturationUpdates[key] ?? 0) + item.quantity;
    return false;
  });

  return { remainingCargo, sold, goldDelta, stars, saturationUpdates };
}

// --- Bulk purchase discounts ---

/**
 * Return the discount multiplier based on the quantity being purchased.
 * 1-3 units: no discount (×1.0)
 * 4-7 units: -10% (×0.9)
 * 8+ units: -20% (×0.8)
 */
export function bulkDiscountMultiplier(quantity: number): number {
  if (quantity >= BULK_DISCOUNT_TIER2_MIN) return BULK_DISCOUNT_TIER2;
  if (quantity >= BULK_DISCOUNT_TIER1_MIN) return BULK_DISCOUNT_TIER1;
  return 1;
}

/**
 * Calculate the total purchase cost for a good at a port with bulk discount.
 */
export function purchaseCostWithDiscount(port: Port, good: Good, quantity: number): number {
  const unitCost = purchaseCostForGood(port, good);
  return Math.round(unitCost * quantity * bulkDiscountMultiplier(quantity));
}

// --- Smuggling system ---

/**
 * Calculate the detection probability for smuggling based on Simsar experience.
 * High Simsar ratio → low detection probability (floor at 3%).
 * Low Simsar → high detection (base at 40%).
 */
export function smugglingDetectionProbability(experience: HiddenExperience): number {
  const ratios = getExperienceRatios(experience);
  const simsarWeight = ratios.simsar;
  // Linear interpolation from base (40%) to floor (3%) as simsar goes 0→0.5
  const range = SMUGGLING_DETECT_BASE - SMUGGLING_DETECT_FLOOR;
  const reduction = Math.min(simsarWeight / 0.5, 1) * range;
  return Math.max(SMUGGLING_DETECT_FLOOR, SMUGGLING_DETECT_BASE - reduction);
}

/**
 * Attempt to smuggle forbidden goods into a port.
 * Returns the smuggling result: detection, fines, and confiscation.
 */
export function attemptSmuggling(
  cargo: CargoItem[],
  forbiddenGoodIds: string[],
  experience: HiddenExperience,
  rng: () => number = Math.random,
): SmuggleResult {
  const smuggledItems = cargo.filter((item) => forbiddenGoodIds.includes(item.goodId));

  if (smuggledItems.length === 0) {
    return { detected: false, fineGold: 0, goodsConfiscated: [], lockoutTurns: 0 };
  }

  const detectProb = smugglingDetectionProbability(experience);
  const detected = rng() < detectProb;

  if (!detected) {
    return { detected: false, fineGold: 0, goodsConfiscated: [], lockoutTurns: 0 };
  }

  return {
    detected: true,
    fineGold: SMUGGLING_FINE_GOLD,
    goodsConfiscated: smuggledItems,
    lockoutTurns: SMUGGLING_LOCKOUT_TURNS,
  };
}

// --- City contracts ---

/**
 * Check if a city contract has been fulfilled by the player's current cargo delivery.
 */
export function checkContractFulfillment(
  contract: CityContract,
  soldGoods: Array<{ goodId: string; quantity: number }>,
  currentTurn: number,
): { fulfilled: boolean; expired: boolean } {
  if (contract.completed) return { fulfilled: false, expired: false };
  if (currentTurn > contract.deadlineTurn) return { fulfilled: false, expired: true };

  const delivered = soldGoods
    .filter((item) => item.goodId === contract.goodId)
    .reduce((sum, item) => sum + item.quantity, 0);

  return { fulfilled: delivered >= contract.quantity, expired: false };
}

/**
 * Calculate the reward for fulfilling a contract (bonus price).
 */
export function contractRewardGold(contract: CityContract): number {
  return contract.rewardGold;
}

/**
 * Calculate the penalty for breaking/expiring a contract.
 */
export function contractBreakPenalty(contract: CityContract): number {
  return contract.breakPenalty || CONTRACT_BREAK_PENALTY;
}

/**
 * Apply the contract bonus to a sale — used when kervan sells goods matching an active contract.
 */
export function contractSaleBonus(): number {
  return CONTRACT_PRICE_BONUS;
}

// --- First arrival bonus ---

/**
 * Return the first-arrival bonus multiplier. The first player to deliver a
 * good to a port in a turn gets a 15% price bonus.
 */
export function firstArrivalMultiplier(isFirstArrival: boolean): number {
  return isFirstArrival ? FIRST_ARRIVAL_BONUS : 1;
}

// --- Price visibility ---

/**
 * Determine the player's price visibility tier based on Terazi experience.
 * Higher Terazi ratio → more market information.
 */
export function priceVisibilityTier(experience: HiddenExperience): PriceVisibilityTier {
  const ratios = getExperienceRatios(experience);
  const teraziRatio = ratios.terazi;

  if (teraziRatio >= PRICE_VISIBILITY_FULL) return 'full';
  if (teraziRatio >= PRICE_VISIBILITY_NETWORK) return 'network';
  if (teraziRatio >= PRICE_VISIBILITY_LOCAL) return 'local';
  return 'none';
}
