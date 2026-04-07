import { resolveCombat } from './combat.js';
import { sellCargoAtPort } from './economy.js';
import { applyExperienceGain, determineRenown, dominantExperienceLabel } from './experience.js';
import { createRumor, spreadRumors } from './rumor.js';
import { isOrderReachable } from '../../shared/src/validators/index.js';
import type { GameState, Good, Order, Port, Route, Tactic, TurnResolution } from '../../shared/src/types/index.js';

const TURNS_PER_SEASON = 4;

export function resolveTurn(input: {
  state: GameState;
  order: Order;
  ports: Port[];
  routes: Route[];
  goods: Good[];
  tactic?: Tactic;
}): TurnResolution {
  const { state, order, ports, routes, goods } = input;
  const player = { ...state.player };
  const currentPort = ports.find((port) => port.id === player.currentPortId);
  const destinationPort = ports.find((port) => port.id === order.destinationPort);

  if (!currentPort || !destinationPort || !isOrderReachable(order, player.currentPortId, routes)) {
    return {
      nextState: state,
      log: [{ label: 'Emir', detail: 'Seçilen rota geçerli değil.' }],
      whispers: state.lastWhispers,
    };
  }

  const log = [
    { label: 'Fondaco', detail: `${currentPort.name} limanında hazırlık tamamlandı.` },
    { label: 'Emir', detail: `${destinationPort.name} / ${order.routeType} / ${order.intent}` },
  ];

  let combat;
  if (order.intent === 'kara_bayrak') {
    combat = resolveCombat({
      playerShip: player.ship,
      playerExperience: player.experience,
      playerTactic: input.tactic ?? 'pruva',
    });

    log.push({
      label: 'Karşılaşma',
      detail:
        combat.result === 'kazandi'
          ? 'Düşman gemisi geri çekildi, denizde adın kaldı.'
          : combat.result === 'kacti'
            ? 'Duman ve manevrayla çatışmadan sıyrıldın.'
            : 'Karşılaşma pahalıya patladı; mürettebat sarsıldı.',
    });

    if (combat.result === 'kaybetti') {
      player.gold = Math.max(0, player.gold - 30);
      player.ship.durability = Math.max(20, player.ship.durability - 15);
    }
  }

  player.currentPortId = destinationPort.id;
  player.experience = applyExperienceGain(player.experience, order.intent);

  const trade = order.intent === 'kervan' ? sellCargoAtPort(player.cargo, goods, destinationPort) : undefined;
  if (trade) {
    player.cargo = trade.remainingCargo;
    player.gold += trade.goldDelta;
    log.push({
      label: 'Pazar',
      detail: trade.sold.length
        ? `${trade.sold.join(', ')} satıldı. ${trade.goldDelta} altın kazandın.`
        : 'Bu limanda kârlı satış çıkmadı; malları elde tuttun.',
    });
  }

  const rumors = spreadRumors(
    [...state.activeRumors, createRumor(order.intent, destinationPort.id)],
    routes,
  );
  player.renown = determineRenown(player.experience, rumors.length);

  const dominant = dominantExperienceLabel(player.experience);
  const whispers = [
    `${destinationPort.name} kahvehanesinde bugün ${dominant} kokan dedikodular ağır basıyor.`,
    `${destinationPort.displayName} çevresinde ${rumors.length} aktif söylenti dönüyor.`,
    `${destinationPort.name} limanındaki başlıca aranan mal: ${destinationPort.desires.good}.`,
  ];

  log.push({ label: 'Rüzgâr', detail: `${destinationPort.name} limanına vardın.` });

  return {
    nextState: {
      turn: state.turn + 1,
      season: state.turn % TURNS_PER_SEASON === 0 ? 'kis' : 'yaz',
      player,
      activeRumors: rumors,
      lastWhispers: whispers,
    },
    log,
    whispers,
    combat,
    trade: trade
      ? {
          sold: trade.sold,
          stars: trade.stars,
          goldDelta: trade.goldDelta,
        }
      : undefined,
  };
}
