import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import portsJson from '../../../data/ports.json' with { type: 'json' };
import routesJson from '../../../data/routes.json' with { type: 'json' };
import goodsJson from '../../../data/goods.json' with { type: 'json' };
import { DEFAULT_PLAYER_ID, DEFAULT_PLAYER_NAME } from '../../shared/src/constants/index.js';
import type { BootstrapPayload, CargoItem, GameState, Good, Order, Port, Route, Tactic } from '../../shared/src/types/index.js';
import { resolveTurn } from '../../engine/src/turn-resolver.js';
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
        purchasePrice: 40,
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

  if (state.player.gold < 40) {
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
    purchasePrice: 40,
  };

  const player = {
    ...state.player,
    gold: state.player.gold - 40,
    cargo: [...state.player.cargo, newCargoItem],
  };

  const updatedState: GameState = { ...state, player };
  res.json({ state: updatedState });
});

app.post('/api/load-cargo', (req, res) => {
  const state = req.body?.state as GameState | undefined;
  const goodId = typeof req.body?.goodId === 'string' ? req.body.goodId : undefined;
  const action = typeof req.body?.action === 'string' ? req.body.action : undefined;

  if (!state || !goodId || !action) {
    res.status(400).json({ error: 'state, goodId ve action zorunlu' });
    return;
  }

  if (action !== 'drop') {
    res.status(400).json({ error: 'Desteklenmeyen eylem' });
    return;
  }

  const cargoIndex = state.player.cargo.findIndex((c) => c.goodId === goodId);
  if (cargoIndex === -1) {
    res.status(400).json({ error: 'Kargoda bu mal yok' });
    return;
  }

  const newCargo = [...state.player.cargo];
  newCargo.splice(cargoIndex, 1);

  const player = { ...state.player, cargo: newCargo };
  const updatedState: GameState = { ...state, player };
  res.json({ state: updatedState });
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
