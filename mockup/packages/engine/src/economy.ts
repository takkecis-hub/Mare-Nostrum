import type { CargoItem, Good, Port } from '../../shared/src/types/index.js';
import {
  SATURATION_PRICE_STEP,
  SATURATION_PRICE_FLOOR,
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
) {
  const sold: string[] = [];
  let goldDelta = 0;
  let stars = 1;
  const saturationUpdates: Record<string, number> = {};

  const remainingCargo = cargo.filter((item) => {
    const good = goods.find((candidate) => candidate.id === item.goodId);
    if (!good) {
      return true;
    }

    const indicator = priceIndicatorForPort(port, good);
    const multiplier = saturationMultiplier(port.id, good.id, saturation);
    const saleValue = Math.round(indicator * 20 * item.quantity * multiplier);
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
