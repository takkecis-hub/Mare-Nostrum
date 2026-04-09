import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import portsJson from '../../../data/ports.json' with { type: 'json' };
import routesJson from '../../../data/routes.json' with { type: 'json' };
import goodsJson from '../../../data/goods.json' with { type: 'json' };
import { DEFAULT_PLAYER_ID, DEFAULT_PLAYER_NAME, GOOD_PURCHASE_COST } from '../../shared/src/constants/index.js';
import type { BootstrapPayload, CargoItem, GameState, Good, Order, Port, Route, Tactic } from '../../shared/src/types/index.js';
import { resolveTurn } from '../../engine/src/turn-resolver.js';
import { repairShip, repairCost } from '../../engine/src/shipyard.js';
import { purchaseCostForGood } from '../../engine/src/economy.js';
import { getMockWhispers } from './llm/mock-whispers.js';

const ports = portsJson as Port[];
const routes = routesJson as Route[];
const goods = goodsJson as Good[];

const app = express();
app.use(cors());
app.use(express.json());

const initialState: GameState = {
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
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mare-nostrum-mockup-server' });
});

app.get('/api/bootstrap', (_req, res) => {
  const payload: BootstrapPayload = {
    ports,
    routes,
    goods,
    gameState: initialState,
  };

  res.json(payload);
});

app.post('/api/whispers', (req, res) => {
  const portId = typeof req.body?.portId === 'string' ? req.body.portId : 'venedik';
  const experience = req.body?.experience ?? initialState.player.experience;
  res.json({ whispers: getMockWhispers(portId, experience) });
});

app.post('/api/resolve-turn', (req, res) => {
  const state = req.body?.state as GameState | undefined;
  const order = req.body?.order as Order | undefined;
  const tactic = req.body?.tactic as Tactic | undefined;

  if (!state || !order) {
    res.status(400).json({ error: 'state ve order zorunlu' });
    return;
  }

  const resolution = resolveTurn({
    state,
    order,
    ports,
    routes,
    goods,
    tactic,
  });

  res.json(resolution);
});

app.post('/api/buy-good', (req, res) => {
  const state = req.body?.state as GameState | undefined;
  const goodId = typeof req.body?.goodId === 'string' ? req.body.goodId : undefined;

  if (!state || !goodId) {
    res.status(400).json({ error: 'state ve goodId zorunlu' });
    return;
  }

  const currentPort = ports.find((p) => p.id === state.player.currentPortId);
  if (!currentPort) {
    res.status(400).json({ error: 'Liman bulunamadı' });
    return;
  }

  if (currentPort.produces.good !== goodId) {
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

  if (state.player.cargo.length + 1 > state.player.ship.cargoCapacity) {
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

  const updatedState: GameState = { ...state, player };
  res.json({ state: updatedState });
});

app.post('/api/load-cargo', (req, res) => {
  const state = req.body?.state as GameState | undefined;
  const goodId = typeof req.body?.goodId === 'string' ? req.body.goodId : undefined;
  const action = typeof req.body?.action === 'string' ? req.body.action : undefined;
  const cargoIndex = typeof req.body?.cargoIndex === 'number' ? req.body.cargoIndex : undefined;

  if (!state || !action) {
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
  const updatedState: GameState = { ...state, player };
  res.json({ state: updatedState });
});

app.post('/api/repair-cost', (req, res) => {
  const state = req.body?.state as GameState | undefined;

  if (!state) {
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

app.post('/api/repair-ship', (req, res) => {
  const state = req.body?.state as GameState | undefined;

  if (!state) {
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

  const updatedState: GameState = { ...state, player };
  res.json({
    state: updatedState,
    goldSpent: result.goldSpent,
    durabilityRestored: result.durabilityRestored,
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
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
