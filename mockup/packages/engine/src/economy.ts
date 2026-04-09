import type { CargoItem, Good, GoodCategory, Port, PriceBand } from '../../shared/src/types/index.js';
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
} from '../../shared/src/constants/index.js';

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
export function purchaseCostForGood(port: Port, _good: Good): number {
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
    const bpMult = basePriceMultiplier(port.desires.good === good.id ? port.desires.basePrice : 'normal');
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
