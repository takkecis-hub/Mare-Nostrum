import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import portsJson from '../../../data/ports.json' with { type: 'json' };
import routesJson from '../../../data/routes.json' with { type: 'json' };
import goodsJson from '../../../data/goods.json' with { type: 'json' };
import { DEFAULT_PLAYER_ID, DEFAULT_PLAYER_NAME } from '../../shared/src/constants/index.js';
import type { BootstrapPayload, GameState, Good, Order, Port, Route, Tactic } from '../../shared/src/types/index.js';
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
