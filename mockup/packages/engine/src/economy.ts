import type { CargoItem, Good, Port } from '../../shared/src/types/index.js';

export function priceIndicatorForPort(port: Port, good: Good) {
  if (port.produces.good === good.id) {
    return 2;
  }

  if (port.desires.good === good.id) {
    return 5;
  }

  return good.priceIndicator;
}

export function sellCargoAtPort(cargo: CargoItem[], goods: Good[], port: Port) {
  const sold: string[] = [];
  let goldDelta = 0;
  let stars = 1;

  const remainingCargo = cargo.filter((item) => {
    const good = goods.find((candidate) => candidate.id === item.goodId);
    if (!good) {
      return true;
    }

    const indicator = priceIndicatorForPort(port, good);
    const saleValue = indicator * 20 * item.quantity;
    if (saleValue <= item.purchasePrice * item.quantity) {
      return true;
    }

    sold.push(`${item.name} x${item.quantity}`);
    goldDelta += saleValue;
    stars = Math.max(stars, Math.min(4, indicator - 1));
    return false;
  });

  return { remainingCargo, sold, goldDelta, stars };
}
