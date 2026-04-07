import { create } from 'zustand';
import type {
  BootstrapPayload,
  GameState,
  Port,
  Route,
  Good,
  RouteType,
  Intent,
  Tactic,
  TurnResolution,
} from '../../../shared/src/types/index.js';
import { GOOD_PURCHASE_COST, REPAIR_COST_PER_POINT } from '../../../shared/src/constants/index.js';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface Order {
  destinationPort: string;
  routeType: RouteType;
  intent: Intent;
}

interface GameStore {
  /* ── data ────────────────────────────────────────── */
  ports: Port[];
  routes: Route[];
  goods: Good[];
  gameState: GameState | null;
  turnLog: Array<{ label: string; detail: string }>;
  error: string;
  loading: boolean;

  /* ── order draft ─────────────────────────────────── */
  order: Order;
  tactic: Tactic;

  /* ── actions ─────────────────────────────────────── */
  bootstrap: () => Promise<void>;
  setOrder: (patch: Partial<Order>) => void;
  setTactic: (tactic: Tactic) => void;
  refreshWhispers: () => Promise<void>;
  buyCurrentGood: () => Promise<void>;
  dropCargo: (cargoIndex: number) => Promise<void>;
  repairShip: () => Promise<void>;
  resolveTurn: () => Promise<TurnResolution | null>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ports: [],
  routes: [],
  goods: [],
  gameState: null,
  turnLog: [],
  error: '',
  loading: true,

  order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' },
  tactic: 'pruva',

  /* ── bootstrap ───────────────────────────────────── */
  bootstrap: async () => {
    try {
      const response = await fetch(`${API_URL}/api/bootstrap`);
      const data: BootstrapPayload = await response.json();
      set({
        ports: data.ports,
        routes: data.routes,
        goods: data.goods,
        gameState: data.gameState,
        loading: false,
        error: '',
      });
    } catch {
      set({
        error: `Bootstrap verisi alınamadı (${API_URL}/api/bootstrap). Serverı "pnpm dev" ile ayağa kaldır.`,
        loading: false,
      });
    }
  },

  setOrder: (patch) =>
    set((state) => ({ order: { ...state.order, ...patch } })),

  setTactic: (tactic) => set({ tactic }),

  /* ── whispers ────────────────────────────────────── */
  refreshWhispers: async () => {
    const { gameState } = get();
    if (!gameState) return;
    const response = await fetch(`${API_URL}/api/whispers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portId: gameState.player.currentPortId,
        experience: gameState.player.experience,
      }),
    });
    const data = await response.json();
    set({
      gameState: {
        ...gameState,
        lastWhispers: data.whispers,
      },
    });
  },

  /* ── buy ─────────────────────────────────────────── */
  buyCurrentGood: async () => {
    const { gameState, ports, goods } = get();
    if (!gameState) return;
    const currentPort = ports.find((p) => p.id === gameState.player.currentPortId);
    if (!currentPort) return;
    const goodsEntry = goods.find((g) => g.id === currentPort.produces.good);
    if (!goodsEntry) return;

    const cargoCount = gameState.player.cargo.reduce((sum, item) => sum + item.quantity, 0);
    if (cargoCount >= gameState.player.ship.cargoCapacity || gameState.player.gold < GOOD_PURCHASE_COST) return;

    const response = await fetch(`${API_URL}/api/buy-good`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: gameState, goodId: goodsEntry.id }),
    });
    if (!response.ok) return;
    const data = await response.json();
    set({ gameState: data.state });
  },

  /* ── drop cargo ──────────────────────────────────── */
  dropCargo: async (cargoIndex) => {
    const { gameState } = get();
    if (!gameState) return;
    const response = await fetch(`${API_URL}/api/load-cargo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: gameState, cargoIndex, action: 'drop' }),
    });
    if (!response.ok) return;
    const data = await response.json();
    set({ gameState: data.state });
  },

  /* ── repair ──────────────────────────────────────── */
  repairShip: async () => {
    const { gameState } = get();
    if (!gameState) return;
    const response = await fetch(`${API_URL}/api/repair-ship`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: gameState }),
    });
    if (!response.ok) return;
    const data = await response.json();
    set({ gameState: data.state });
  },

  /* ── resolve turn ────────────────────────────────── */
  resolveTurn: async () => {
    const { gameState, order, tactic } = get();
    if (!gameState) return null;
    const response = await fetch(`${API_URL}/api/resolve-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: gameState, order, tactic }),
    });
    const data: TurnResolution = await response.json();
    set({ gameState: data.nextState, turnLog: data.log });
    return data;
  },
}));
