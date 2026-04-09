import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import portsJson from '../../../data/ports.json' with { type: 'json' };
import routesJson from '../../../data/routes.json' with { type: 'json' };
import goodsJson from '../../../data/goods.json' with { type: 'json' };
import portGeoJson from '../../../data/port-geo.json' with { type: 'json' };
import whispersJson from '../../../data/whispers.json' with { type: 'json' };
import triviaJson from '../../../data/trivia.json' with { type: 'json' };
import groundingManifestJson from '../../../data/grounding-manifest.json' with { type: 'json' };
import provenanceJson from '../../../data/provenance.json' with { type: 'json' };
import {
  DEFAULT_PLAYER_ID,
  DEFAULT_PLAYER_NAME,
  GOOD_PURCHASE_COST,
  RUMOR_SPREAD_COST,
  RUMOR_SPREAD_SPAM_THRESHOLD,
  RUMOR_SPREAD_SPAM_WINDOW,
} from '../../shared/src/constants/index.js';
import type {
  BootstrapPayload,
  CargoItem,
  CityContract,
  GameState,
  HiddenExperience,
  Order,
  Port,
  RumorTemplateId,
  Tactic,
} from '../../shared/src/types/index.js';
import {
  assertGroundedDataIntegrity,
  parseGoods,
  parseGroundingManifest,
  parsePortGeoMap,
  parsePorts,
  parseProvenanceCatalog,
  parseRoutes,
  parseTriviaCatalog,
  parseWhisperPool,
} from '../../shared/src/validators/index.js';
import { resolveTurn } from '../../engine/src/turn-resolver.js';
import { priceVisibilityTier, purchaseCostForGood } from '../../engine/src/economy.js';
import { repairShip, repairCost } from '../../engine/src/shipyard.js';
import { createQuestState } from '../../engine/src/quest.js';
import { createPlayerRumor } from '../../engine/src/rumor.js';
import { createStatePersistence } from './db/persistence.js';
import { getMockWhispers } from './llm/mock-whispers.js';

const ports = parsePorts(portsJson);
const routes = parseRoutes(routesJson);
const goods = parseGoods(goodsJson);
const triviaCatalog = parseTriviaCatalog(triviaJson);

assertGroundedDataIntegrity({
  ports,
  routes,
  goods,
  portGeo: parsePortGeoMap(portGeoJson),
  whisperPool: parseWhisperPool(whispersJson),
  triviaCatalog,
  groundingManifest: parseGroundingManifest(groundingManifestJson),
  provenanceCatalog: parseProvenanceCatalog(provenanceJson),
});

const app = express();
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean)) ?? ['http://localhost:3000'],
}));
app.use(express.json());

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isExperience(value: unknown): value is HiddenExperience {
  return isRecord(value)
    && typeof value.meltem === 'number'
    && typeof value.terazi === 'number'
    && typeof value.murekkep === 'number'
    && typeof value.simsar === 'number';
}

function isTactic(value: unknown): value is Tactic {
  return value === 'pruva' || value === 'ates' || value === 'manevra' || value === 'kacis';
}

function isRumorTemplateId(value: unknown): value is RumorTemplateId {
  return value === 'gozdagi'
    || value === 'suclama'
    || value === 'karalama'
    || value === 'ovgu'
    || value === 'ifsa'
    || value === 'piyasa';
}

function isOrder(value: unknown): value is Order {
  return isRecord(value)
    && typeof value.destinationPort === 'string'
    && (value.routeType === 'tramontana' || value.routeType === 'kabotaj' || value.routeType === 'fortuna' || value.routeType === 'uzun_kabotaj')
    && (value.intent === 'kervan' || value.intent === 'kara_bayrak' || value.intent === 'pusula' || value.intent === 'duman');
}

function isCargoItem(value: unknown): value is CargoItem {
  return isRecord(value)
    && typeof value.goodId === 'string'
    && typeof value.name === 'string'
    && typeof value.quantity === 'number'
    && typeof value.originPort === 'string'
    && typeof value.purchasePrice === 'number';
}

function isShip(value: unknown): value is GameState['player']['ship'] {
  return isRecord(value)
    && (value.type === 'feluka' || value.type === 'karaka' || value.type === 'kadirga')
    && typeof value.cargoCapacity === 'number'
    && typeof value.power === 'number'
    && typeof value.durability === 'number';
}

function isGameState(value: unknown): value is GameState {
  return isRecord(value)
    && typeof value.turn === 'number'
    && (value.season === 'yaz' || value.season === 'kis')
    && Array.isArray(value.activeRumors)
    && Array.isArray(value.lastWhispers)
    && isRecord(value.player)
    && typeof value.player.id === 'string'
    && typeof value.player.name === 'string'
    && typeof value.player.gold === 'number'
    && typeof value.player.currentPortId === 'string'
    && Array.isArray(value.player.renown)
    && Array.isArray(value.player.cargo)
    && value.player.cargo.every(isCargoItem)
    && isShip(value.player.ship)
    && isExperience(value.player.experience);
}

function getProducedGoods(port: Port) {
  return [port.produces, ...(port.bonusProduces ?? [])]
    .map((slot) => goods.find((good) => good.id === slot.good))
    .filter((good): good is (typeof goods)[number] => Boolean(good));
}

function buildCityContracts(sourcePorts: Port[]): CityContract[] {
  return sourcePorts.map((port, index) => ({
    id: `contract-${port.id}`,
    portId: port.id,
    goodId: port.desires.good,
    quantity: port.desires.category === 'yemek' ? 2 : 1,
    rewardGold: port.desires.basePrice === 'pahali' ? 120 : 90,
    deadlineTurn: 8 + index,
    breakPenalty: 40,
    accepted: true,
    completed: false,
  }));
}

function enrichState(state: GameState): GameState {
  return {
    ...state,
    priceVisibility: priceVisibilityTier(state.player.experience),
    cityContracts: state.cityContracts ?? buildCityContracts(ports),
    player: {
      ...state.player,
      visitedPortIds: state.player.visitedPortIds ?? [state.player.currentPortId],
      rumorSpreadTurns: state.player.rumorSpreadTurns ?? [],
      questState: state.player.questState ?? createQuestState('kayip_hazine'),
    },
  };
}

const initialState: GameState = enrichState({
  turn: 1,
  season: 'yaz',
  activeRumors: [],
  lastWhispers: getMockWhispers('venedik', {
    meltem: 1,
    terazi: 3,
    murekkep: 1,
    simsar: 0,
  }),
  player: {
    id: DEFAULT_PLAYER_ID,
    name: DEFAULT_PLAYER_NAME,
    gold: 200,
    currentPortId: 'venedik',
    renown: [],
    cargo: [
      {
        goodId: 'murano_cami',
        name: 'Murano Camı',
        quantity: 1,
        originPort: 'venedik',
        purchasePrice: GOOD_PURCHASE_COST,
      },
    ],
    ship: {
      type: 'karaka',
      cargoCapacity: 5,
      power: 2,
      durability: 100,
    },
    experience: {
      meltem: 1,
      terazi: 3,
      murekkep: 1,
      simsar: 0,
    },
  },
});

const persistence = await createStatePersistence();
const persistedState = persistence ? await persistence.load() : null;
let currentState = enrichState(persistedState ?? initialState);

async function commitState(state: GameState) {
  currentState = enrichState(state);
  if (persistence) {
    await persistence.save(currentState);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mare-nostrum-mockup-server' });
});

app.get('/api/bootstrap', (_req, res) => {
  const payload: BootstrapPayload = {
    ports,
    routes,
    goods,
    gameState: currentState,
  };

  res.json(payload);
});

app.post('/api/whispers', (req, res) => {
  const portId = typeof req.body?.portId === 'string' ? req.body.portId : undefined;
  const experience = req.body?.experience;

  if (!portId || !ports.some((port) => port.id === portId)) {
    res.status(400).json({ error: 'Geçerli bir liman id gerekli' });
    return;
  }
  if (experience !== undefined && !isExperience(experience)) {
    res.status(400).json({ error: 'experience alanı geçersiz' });
    return;
  }

  res.json({ whispers: getMockWhispers(portId, experience ?? initialState.player.experience) });
});

app.post('/api/resolve-turn', async (req, res) => {
  const state = req.body?.state;
  const order = req.body?.order;
  const tactic = req.body?.tactic;

  if (!isGameState(state) || !isOrder(order)) {
    res.status(400).json({ error: 'state ve order zorunlu' });
    return;
  }
  if (tactic !== undefined && !isTactic(tactic)) {
    res.status(400).json({ error: 'Geçersiz taktik' });
    return;
  }

  try {
    const resolution = resolveTurn({
      state: enrichState(state),
      order,
      ports,
      routes,
      goods,
      triviaCatalog,
      tactic,
      rng: Math.random,
    });

    await commitState(resolution.nextState);
    res.json({
      ...resolution,
      nextState: currentState,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Tur çözümlenemedi',
    });
  }
});

app.post('/api/buy-good', async (req, res) => {
  const state = req.body?.state;
  const goodId = typeof req.body?.goodId === 'string' ? req.body.goodId : undefined;

  if (!isGameState(state) || !goodId) {
    res.status(400).json({ error: 'state ve goodId zorunlu' });
    return;
  }

  const currentPort = ports.find((p) => p.id === state.player.currentPortId);
  if (!currentPort) {
    res.status(400).json({ error: 'Liman bulunamadı' });
    return;
  }

  const producedGoods = getProducedGoods(currentPort);
  if (!producedGoods.some((good) => good.id === goodId)) {
    res.status(400).json({ error: 'Bu liman bu malı üretmiyor' });
    return;
  }

  const good = goods.find((g) => g.id === goodId);
  if (!good) {
    res.status(400).json({ error: 'Mal bulunamadı' });
    return;
  }

  const cost = purchaseCostForGood(currentPort, good);

  if (state.player.gold < cost) {
    res.status(400).json({ error: 'Yetersiz altın' });
    return;
  }

  const cargoQuantity = state.player.cargo.reduce((sum, item) => sum + item.quantity, 0);
  if (cargoQuantity + 1 > state.player.ship.cargoCapacity) {
    res.status(400).json({ error: 'Kargo dolu' });
    return;
  }

  const newCargoItem: CargoItem = {
    goodId,
    name: good.name,
    quantity: 1,
    originPort: state.player.currentPortId,
    purchasePrice: cost,
  };

  const player = {
    ...state.player,
    gold: state.player.gold - cost,
    cargo: [...state.player.cargo, newCargoItem],
  };

  const updatedState: GameState = enrichState({ ...state, player });
  await commitState(updatedState);
  res.json({ state: currentState });
});

app.post('/api/load-cargo', async (req, res) => {
  const state = req.body?.state;
  const goodId = typeof req.body?.goodId === 'string' ? req.body.goodId : undefined;
  const action = typeof req.body?.action === 'string' ? req.body.action : undefined;
  const cargoIndex = typeof req.body?.cargoIndex === 'number' ? req.body.cargoIndex : undefined;

  if (!isGameState(state) || !action) {
    res.status(400).json({ error: 'state ve action zorunlu' });
    return;
  }

  if (action !== 'drop') {
    res.status(400).json({ error: 'Desteklenmeyen eylem' });
    return;
  }

  let targetIndex: number;
  if (cargoIndex !== undefined) {
    if (cargoIndex < 0 || cargoIndex >= state.player.cargo.length) {
      res.status(400).json({ error: 'Geçersiz kargo indeksi' });
      return;
    }
    targetIndex = cargoIndex;
  } else if (goodId) {
    targetIndex = state.player.cargo.findIndex((c) => c.goodId === goodId);
    if (targetIndex === -1) {
      res.status(400).json({ error: 'Kargoda bu mal yok' });
      return;
    }
  } else {
    res.status(400).json({ error: 'goodId veya cargoIndex zorunlu' });
    return;
  }

  const newCargo = [...state.player.cargo];
  newCargo.splice(targetIndex, 1);

  const player = { ...state.player, cargo: newCargo };
  const updatedState: GameState = enrichState({ ...state, player });
  await commitState(updatedState);
  res.json({ state: currentState });
});

app.post('/api/repair-cost', (req, res) => {
  const state = req.body?.state;

  if (!isGameState(state)) {
    res.status(400).json({ error: 'state zorunlu' });
    return;
  }

  const port = ports.find((p) => p.id === state.player.currentPortId);
  if (!port) {
    res.status(400).json({ error: 'Liman bulunamadı' });
    return;
  }

  const totalCost = repairCost(state.player.ship, port.special);
  res.json({
    hasTersane: port.special.includes('tersane'),
    totalCost,
    pointsNeeded: 100 - state.player.ship.durability,
  });
});

app.post('/api/repair-ship', async (req, res) => {
  const state = req.body?.state;

  if (!isGameState(state)) {
    res.status(400).json({ error: 'state zorunlu' });
    return;
  }

  const currentPort = ports.find((p) => p.id === state.player.currentPortId);
  if (!currentPort) {
    res.status(400).json({ error: 'Liman bulunamadı' });
    return;
  }

  if (state.player.ship.durability >= 100) {
    res.status(400).json({ error: 'Gemi zaten tam dayanıklılıkta' });
    return;
  }

  const result = repairShip(state.player.ship, state.player.gold, currentPort.special);

  if (result.goldSpent === 0) {
    res.status(400).json({ error: 'Tamir için yeterli altın yok' });
    return;
  }

  const player = {
    ...state.player,
    ship: result.repairedShip,
    gold: state.player.gold - result.goldSpent,
  };

  const updatedState: GameState = enrichState({ ...state, player });
  await commitState(updatedState);
  res.json({
    state: currentState,
    goldSpent: result.goldSpent,
    durabilityRestored: result.durabilityRestored,
  });
});

app.post('/api/spread-rumor', async (req, res) => {
  const state = req.body?.state;
  const templateId = req.body?.templateId;
  const targetPortId = req.body?.targetPortId;

  if (!isGameState(state) || !isRumorTemplateId(templateId) || typeof targetPortId !== 'string') {
    res.status(400).json({ error: 'state, templateId ve targetPortId zorunlu' });
    return;
  }
  if (!ports.some((port) => port.id === targetPortId)) {
    res.status(400).json({ error: 'Hedef liman bulunamadı' });
    return;
  }
  if (state.player.gold < RUMOR_SPREAD_COST) {
    res.status(400).json({ error: 'Söylenti yaymak için altın yetmiyor' });
    return;
  }

  const recentTurns = (state.player.rumorSpreadTurns ?? []).filter(
    (turn) => state.turn - turn < RUMOR_SPREAD_SPAM_WINDOW,
  );
  if (recentTurns.includes(state.turn)) {
    res.status(400).json({ error: 'Aynı turda yalnızca bir söylenti yayabilirsin' });
    return;
  }

  const rumor = createPlayerRumor({
    templateId,
    sourcePortId: state.player.currentPortId,
    targetPortId,
    playerId: state.player.id,
    turn: state.turn,
  });

  const updatedTurns = [...recentTurns, state.turn];
  const activeRumors = [...state.activeRumors, rumor];
  let counterRumorTriggered = false;
  if (updatedTurns.length >= RUMOR_SPREAD_SPAM_THRESHOLD) {
    counterRumorTriggered = true;
    activeRumors.push({
      ...createPlayerRumor({
        templateId: 'suclama',
        sourcePortId: state.player.currentPortId,
        targetPortId: state.player.currentPortId,
        playerId: state.player.id,
        turn: state.turn + 1,
      }),
      text: 'Kaptanın dili fazla oynuyor; her limanda adı gereğinden hızlı dolaşıyor.',
      tone: 'olumsuz',
    });
  }

  const nextState = enrichState({
    ...state,
    activeRumors,
    player: {
      ...state.player,
      gold: state.player.gold - RUMOR_SPREAD_COST,
      rumorSpreadTurns: updatedTurns,
    },
  });

  await commitState(nextState);
  res.json({
    state: currentState,
    rumor: {
      text: rumor.text,
      counterRumorTriggered,
    },
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean)) ?? ['http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  socket.emit('status', { message: 'socket hazır' });
  socket.on('ping', () => {
    socket.emit('pong', { at: Date.now() });
  });
});

const port = Number(process.env.PORT ?? 4000);
httpServer.listen(port, () => {
  console.log(`Mock server listening on http://localhost:${port}`);
});
