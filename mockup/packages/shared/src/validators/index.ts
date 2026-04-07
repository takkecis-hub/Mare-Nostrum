import type { Order, Route } from '../types/index.js';

export function isOrderReachable(order: Order, currentPortId: string, routes: Route[]) {
  return routes.some(
    (route) =>
      route.type === order.routeType &&
      ((route.from === currentPortId && route.to === order.destinationPort) ||
        (route.to === currentPortId && route.from === order.destinationPort)),
  );
}
