import { resolveCombat } from './combat.js';
import { sellCargoAtPort } from './economy.js';
import {
  applyExperienceGain,
  determineRenown,
  dominantExperienceLabel,
  updateRenownTracking,
  checkRenownDecay,
} from './experience.js';
import { createRumor, spreadRumors } from './rumor.js';
import { isOrderReachable } from '../../shared/src/validators/index.js';
import {
  SATURATION_DECAY_INTERVAL,
  SHIPWRECK_RESPAWN_GOLD,
  KABOTAJ_TRADE_BONUS,
} from '../../shared/src/constants/index.js';
import type { GameState, Good, Order, Port, Route, Tactic, TurnResolution } from '../../shared/src/types/index.js';

const TURNS_PER_SEASON = 4;

function nextSeason(currentTurn: number) {
  const nextTurn = currentTurn + 1;
  return Math.floor((nextTurn - 1) / TURNS_PER_SEASON) % 2 === 0 ? 'yaz' : 'kis';
}

/**
 * Decay saturation counters: every SATURATION_DECAY_INTERVAL turns, each
 * entry is reduced by 1 (minimum 0).
 */
function decaySaturation(saturation: Record<string, number>, turn: number): Record<string, number> {
  if (turn % SATURATION_DECAY_INTERVAL !== 0) return { ...saturation };
  const next: Record<string, number> = {};
  for (const [key, value] of Object.entries(saturation)) {
    const decayed = value - 1;
    if (decayed > 0) next[key] = decayed;
  }
  return next;
}

export function resolveTurn(input: {
  state: GameState;
  order: Order;
  ports: Port[];
  routes: Route[];
  goods: Good[];
  tactic?: Tactic;
  rng?: () => number;
}): TurnResolution {
  const { state, order, ports, routes, goods } = input;
  const player = { ...state.player };
  const currentPort = ports.find((port) => port.id === player.currentPortId);
  const destinationPort = ports.find((port) => port.id === order.destinationPort);

  // Handle players currently in transit (multi-turn routes)
  if (player.transitStatus === 'in_transit' && player.transitTurnsRemaining && player.transitTurnsRemaining > 1) {
    player.transitTurnsRemaining -= 1;
    return {
      nextState: {
        turn: state.turn + 1,
        season: nextSeason(state.turn),
        player,
        activeRumors: spreadRumors(state.activeRumors, routes),
        lastWhispers: [`Açık denizde ${player.transitTurnsRemaining} tur daha kaldı.`],
        portSaturation: decaySaturation(state.portSaturation ?? {}, state.turn + 1),
      },
      log: [
        { label: 'Deniz', detail: `Açık denizde ilerliyorsunuz. Varışa ${player.transitTurnsRemaining} tur.` },
      ],
      whispers: [`Açık denizde ${player.transitTurnsRemaining} tur daha kaldı.`],
    };
  }

  // Complete transit if arriving this turn
  if (player.transitStatus === 'in_transit' && player.transitTurnsRemaining === 1) {
    const arrivalPort = ports.find((port) => port.id === player.transitDestination);
    if (arrivalPort) {
      player.currentPortId = arrivalPort.id;
    }
    player.transitStatus = 'at_port';
    player.transitTurnsRemaining = 0;
    player.transitDestination = undefined;

    const dominant = dominantExperienceLabel(player.experience);
    const rumors = spreadRumors(state.activeRumors, routes);
    const whispers = [
      `${player.currentPortId} limanına vardın. ${dominant} kokan haberler geliyor.`,
    ];

    return {
      nextState: {
        turn: state.turn + 1,
        season: nextSeason(state.turn),
        player,
        activeRumors: rumors,
        lastWhispers: whispers,
        portSaturation: decaySaturation(state.portSaturation ?? {}, state.turn + 1),
      },
      log: [
        { label: 'Varış', detail: `${player.currentPortId} limanına ulaştınız.` },
      ],
      whispers,
    };
  }

  const isInvalidRoute =
    !currentPort || !destinationPort || !isOrderReachable(order, player.currentPortId, routes);

  if (isInvalidRoute) {
    return {
      nextState: state,
      log: [{ label: 'Emir', detail: 'Seçilen rota geçerli değil.' }],
      whispers: state.lastWhispers,
    };
  }

  // Check if this is a multi-turn route (kabotaj/uzun_kabotaj)
  const selectedRoute = routes.find(
    (r) =>
      r.type === order.routeType &&
      ((r.from === player.currentPortId && r.to === order.destinationPort) ||
        (r.to === player.currentPortId && r.from === order.destinationPort)),
  );
  const turnsRequired = selectedRoute?.turnsRequired ?? 1;

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
      rng: input.rng,
    });

    if (combat.result === 'kazandi') {
      log.push({
        label: 'Karşılaşma',
        detail: combat.manevraIntel
          ? 'Ustaca manevrayla düşmanı alt ettin; bir sonraki hamlesini de sezip bilgi elde ettin.'
          : 'Düşman gemisi geri çekildi, denizde adın kaldı.',
      });
      player.gold += combat.goldDelta;
    } else if (combat.result === 'kacti') {
      log.push({
        label: 'Karşılaşma',
        detail: 'Duman ve manevrayla çatışmadan sıyrıldın.',
      });
    } else {
      // kaybetti
      log.push({
        label: 'Karşılaşma',
        detail: combat.shipwrecked
          ? 'Geminiz battı! Yakın bir limana sığındınız.'
          : 'Karşılaşma pahalıya patladı; mürettebat sarsıldı.',
      });

      if (combat.shipwrecked) {
        // Shipwreck: respawn with feluka at nearest port
        player.gold = SHIPWRECK_RESPAWN_GOLD;
        player.ship = { type: 'feluka', cargoCapacity: 3, power: 2, durability: 100 };
        player.cargo = [];
      } else {
        player.gold = Math.max(0, player.gold + combat.goldDelta);
        player.ship = {
          ...player.ship,
          durability: Math.max(1, player.ship.durability + combat.durabilityDelta),
        };
      }
    }
  }

  // Start multi-turn transit if needed
  if (turnsRequired > 1) {
    player.transitStatus = 'in_transit';
    player.transitTurnsRemaining = turnsRequired - 1;
    player.transitDestination = destinationPort.id;

    player.experience = applyExperienceGain(player.experience, order.intent);
    const rumors = spreadRumors(
      [...state.activeRumors, createRumor(order.intent, currentPort.id)],
      routes,
    );
    player.renown = determineRenown(player.experience, rumors.length);

    log.push({ label: 'Deniz', detail: `${destinationPort.name} yolunda. Varışa ${turnsRequired - 1} tur.` });

    return {
      nextState: {
        turn: state.turn + 1,
        season: nextSeason(state.turn),
        player,
        activeRumors: rumors,
        lastWhispers: [`${destinationPort.name} yolundasınız.`],
        portSaturation: decaySaturation(state.portSaturation ?? {}, state.turn + 1),
      },
      log,
      whispers: [`${destinationPort.name} yolundasınız.`],
      combat,
    };
  }

  player.currentPortId = destinationPort.id;
  player.experience = applyExperienceGain(player.experience, order.intent);

  const saturation = { ...(state.portSaturation ?? {}) };
  const routeBonus = (order.routeType === 'kabotaj' || order.routeType === 'uzun_kabotaj') ? KABOTAJ_TRADE_BONUS : 1;
  const trade = order.intent === 'kervan' ? sellCargoAtPort(player.cargo, goods, destinationPort, saturation, { routeBonus, season: nextSeason(state.turn) }) : undefined;
  if (trade) {
    player.cargo = trade.remainingCargo;
    player.gold += trade.goldDelta;
    // Merge saturation updates
    for (const [key, count] of Object.entries(trade.saturationUpdates)) {
      saturation[key] = (saturation[key] ?? 0) + count;
    }
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

  // Renown decay check
  const renownTracking = updateRenownTracking(
    player.renown,
    order.intent,
    state.turn + 1,
    player.renownLastAction,
  );
  const decay = checkRenownDecay(player.renown, order.intent, state.turn + 1, renownTracking);
  if (decay.warnings.length > 0) {
    log.push({
      label: 'Ün',
      detail: `Şöhretiniz sarsılıyor: ${decay.warnings.join(', ')}`,
    });
  }
  if (decay.losses.length > 0) {
    player.renown = player.renown.filter((r) => !decay.losses.includes(r));
    log.push({
      label: 'Ün',
      detail: `Unvanınızı kaybettiniz: ${decay.losses.join(', ')}`,
    });
  }
  player.renownLastAction = renownTracking;
  player.transitStatus = 'at_port';
  player.transitTurnsRemaining = 0;
  player.transitDestination = undefined;

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
      season: nextSeason(state.turn),
      player,
      activeRumors: rumors,
      lastWhispers: whispers,
      portSaturation: decaySaturation(saturation, state.turn + 1),
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
