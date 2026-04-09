import { resolveCombat } from './combat.js';
import {
  checkContractFulfillment,
  contractBreakPenalty,
  contractRewardGold,
  priceVisibilityTier,
  sellCargoAtPort,
} from './economy.js';
import {
  applyExperienceGain,
  determineRenown,
  dominantExperienceLabel,
  updateRenownTracking,
  checkRenownDecay,
} from './experience.js';
import { advanceQuest, checkQuestTrigger } from './quest.js';
import { createRumor, spreadRumors } from './rumor.js';
import { isOrderReachable } from '../../shared/src/validators/index.js';
import {
  PUSULA_DISCOVERY_GOLD,
  PUSULA_FIRST_VISIT_MULTIPLIER,
  SATURATION_DECAY_INTERVAL,
  SHIPWRECK_RESPAWN_GOLD,
  KABOTAJ_TRADE_BONUS,
} from '../../shared/src/constants/index.js';
import { getExperienceRatios } from '../../shared/src/formulas/index.js';
import type {
  CityContract,
  GameState,
  Good,
  Order,
  Port,
  Route,
  Tactic,
  TriviaCatalog,
  TurnResolution,
} from '../../shared/src/types/index.js';

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

function updateVisitedPorts(visitedPortIds: string[] | undefined, portId: string): string[] {
  const next = new Set(visitedPortIds ?? []);
  next.add(portId);
  return Array.from(next);
}

function applyCombatOutcome(player: GameState['player'], combat: NonNullable<TurnResolution['combat']>) {
  const nextPlayer = { ...player };
  if (combat.result === 'kazandi') {
    nextPlayer.gold += combat.goldDelta;
    return nextPlayer;
  }

  if (combat.result === 'kacti') {
    return nextPlayer;
  }

  if (combat.shipwrecked) {
    nextPlayer.gold = SHIPWRECK_RESPAWN_GOLD;
    nextPlayer.ship = { type: 'feluka', cargoCapacity: 3, power: 2, durability: 100 };
    nextPlayer.cargo = [];
    return nextPlayer;
  }

  nextPlayer.gold = Math.max(0, nextPlayer.gold + combat.goldDelta);
  nextPlayer.ship = {
    ...nextPlayer.ship,
    durability: Math.max(1, nextPlayer.ship.durability + combat.durabilityDelta),
  };
  return nextPlayer;
}

function resolveContractState(
  contracts: CityContract[] | undefined,
  destinationPortId: string,
  soldGoods: Array<{ goodId: string; quantity: number }>,
  turn: number,
) {
  const fulfilled: string[] = [];
  const expired: string[] = [];
  let goldDelta = 0;

  const nextContracts = (contracts ?? []).map((contract) => {
    if (contract.completed) return contract;

    const result = checkContractFulfillment(contract, soldGoods, turn);
    if (result.fulfilled && contract.portId === destinationPortId) {
      fulfilled.push(contract.id);
      goldDelta += contractRewardGold(contract);
      return { ...contract, accepted: false, completed: true };
    }

    if (result.expired) {
      expired.push(contract.id);
      goldDelta -= contractBreakPenalty(contract);
      return { ...contract, accepted: false, completed: true };
    }

    return contract;
  });

  return { nextContracts, fulfilled, expired, goldDelta };
}

function maybeAdvanceQuest(state: GameState, currentPortId: string) {
  const questState = state.player.questState;
  if (!questState) return null;
  if (!checkQuestTrigger(questState, state.turn + 1, currentPortId, state.player)) return null;

  return advanceQuest(questState, `${currentPortId}-turn-${state.turn + 1}`);
}

export function resolveTurn(input: {
  state: GameState;
  order: Order;
  ports: Port[];
  routes: Route[];
  goods: Good[];
  triviaCatalog?: TriviaCatalog;
  tactic?: Tactic;
  rng?: () => number;
}): TurnResolution {
  const { state, order, ports, routes, goods, triviaCatalog, rng } = input;
  const player = { ...state.player };
  let cityContracts = [...(state.cityContracts ?? [])];
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
        priceVisibility: priceVisibilityTier(player.experience),
        cityContracts,
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
    player.visitedPortIds = updateVisitedPorts(player.visitedPortIds, player.currentPortId);

    return {
      nextState: {
        turn: state.turn + 1,
        season: nextSeason(state.turn),
        player,
        activeRumors: rumors,
        lastWhispers: whispers,
        portSaturation: decaySaturation(state.portSaturation ?? {}, state.turn + 1),
        priceVisibility: priceVisibilityTier(player.experience),
        cityContracts,
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
  let exploration: TurnResolution['exploration'];
  let contractsResult: TurnResolution['contracts'];
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

      Object.assign(player, applyCombatOutcome(player, combat));
    }
  } else if (selectedRoute && selectedRoute.encounterChance > 0) {
    const ratios = getExperienceRatios(player.experience);
    const encounterChance =
      order.intent === 'duman'
        ? selectedRoute.encounterChance * Math.max(0.2, 1 - ratios.simsar)
        : selectedRoute.encounterChance;
    const triggeredEncounter = rng ? rng() < encounterChance : false;

    if (triggeredEncounter) {
      combat = resolveCombat({
        playerShip: player.ship,
        playerExperience: player.experience,
        playerTactic: order.intent === 'duman' ? 'kacis' : input.tactic ?? 'manevra',
        rng,
      });

      if (combat.result === 'kazandi') {
        log.push({
          label: 'Karşılaşma',
          detail: order.intent === 'duman'
            ? 'Sessiz geçiş korsanlara rağmen başarıyla tamamlandı; iz bırakmadan sıyrıldın.'
            : 'Rotada çıkan korsan pususu dağıtıldı.',
        });
      } else if (combat.result === 'kacti') {
        log.push({
          label: 'Karşılaşma',
          detail: 'Rotadaki tehdidi görüp yelkeni kırdın, doğrudan çatışmadan kurtuldun.',
        });
      } else {
        log.push({
          label: 'Karşılaşma',
          detail: combat.shipwrecked
            ? 'Yol üstünde yakalandınız; gemi parçalandı.'
            : 'Beklenmeyen bir karşılaşma seferi sarstı.',
        });
      }
      Object.assign(player, applyCombatOutcome(player, combat));
    } else if (order.intent === 'duman') {
      const intel = [
        `${destinationPort.name} limanında aranan mal: ${destinationPort.desires.good}.`,
        `${destinationPort.name} çevresinde rota tipi: ${selectedRoute.type}.`,
      ];
      exploration = { goldBonus: 0, intel, stealthSuccess: true };
      log.push({
        label: 'Duman',
        detail: 'Simsar gölgesi altında görünmeden geçtin ve liman hakkında haber topladın.',
      });
    }
  }

  if (combat?.shipwrecked && order.intent !== 'kara_bayrak') {
    return {
      nextState: {
        turn: state.turn + 1,
        season: nextSeason(state.turn),
        player: {
          ...player,
          transitStatus: 'at_port',
          transitTurnsRemaining: 0,
          transitDestination: undefined,
        },
        activeRumors: spreadRumors(state.activeRumors, routes),
        lastWhispers: ['Sefer parçalandı; mürettebat kendini en yakın güvenli kıyıya zor attı.'],
        portSaturation: decaySaturation(state.portSaturation ?? {}, state.turn + 1),
        priceVisibility: priceVisibilityTier(player.experience),
        cityContracts,
      },
      log,
      whispers: ['Sefer parçalandı; mürettebat kendini en yakın güvenli kıyıya zor attı.'],
      combat,
      exploration,
    };
  }

  // Start multi-turn transit if needed
  if (turnsRequired > 1) {
    player.transitStatus = 'in_transit';
    player.transitTurnsRemaining = turnsRequired - 1;
    player.transitDestination = destinationPort.id;

    player.experience = applyExperienceGain(player.experience, order.intent);
    const rumors = spreadRumors(
      [...state.activeRumors, createRumor(order.intent, currentPort.id, player.id, state.turn + 1)],
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
        priceVisibility: priceVisibilityTier(player.experience),
        cityContracts,
      },
      log,
      whispers: [`${destinationPort.name} yolundasınız.`],
      combat,
    };
  }

  player.currentPortId = destinationPort.id;
  player.experience = applyExperienceGain(player.experience, order.intent);
  const isFirstVisit = !(player.visitedPortIds ?? []).includes(destinationPort.id);
  player.visitedPortIds = updateVisitedPorts(player.visitedPortIds, destinationPort.id);

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

    const contractState = resolveContractState(
      state.cityContracts,
      destinationPort.id,
      trade.soldGoods,
      state.turn + 1,
    );
    player.gold += contractState.goldDelta;
    contractsResult = {
      fulfilled: contractState.fulfilled,
      expired: contractState.expired,
      goldDelta: contractState.goldDelta,
    };
    if (contractState.fulfilled.length > 0) {
      log.push({
        label: 'Kontrat',
        detail: `${contractState.fulfilled.length} şehir kontratı tamamlandı, ek ödül alındı.`,
      });
    }
    if (contractState.expired.length > 0) {
      log.push({
        label: 'Kontrat',
        detail: `${contractState.expired.length} kontrat süresi doldu; ceza kesildi.`,
      });
    }
    cityContracts = contractState.nextContracts;
  }

  if (order.intent === 'pusula') {
    const portTrivia = triviaCatalog?.[destinationPort.id] ?? [];
    const trivia = portTrivia.length > 0
      ? portTrivia[state.turn % portTrivia.length]?.text ?? destinationPort.trivia[0] ?? undefined
      : destinationPort.trivia[0] ?? undefined;
    const goldBonus = PUSULA_DISCOVERY_GOLD * (isFirstVisit ? PUSULA_FIRST_VISIT_MULTIPLIER : 1);
    player.gold += goldBonus;
    exploration = { ...exploration, trivia, goldBonus };
    log.push({
      label: 'Pusula',
      detail: `${goldBonus} altınlık keşif mükâfatı aldın${trivia ? `: ${trivia}` : '.'}`,
    });
  }

  const rumors = spreadRumors(
    [...state.activeRumors, createRumor(order.intent, destinationPort.id, player.id, state.turn + 1)],
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
  const questProgress = maybeAdvanceQuest({ ...state, player }, destinationPort.id);
  if (questProgress) {
    log.push({
      label: 'Görev',
      detail: `${questProgress.stageTitle}: ${questProgress.stageDescription}`,
    });
    player.questState = questProgress.quest;
  }

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
        priceVisibility: priceVisibilityTier(player.experience),
        cityContracts,
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
    exploration,
    contracts: contractsResult,
  };
}
