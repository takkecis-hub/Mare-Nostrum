import { create } from 'zustand';
import type {
  BootstrapPayload,
  GameState,
  Port,
  Route,
  Good,
   Order,
   RumorTemplateId,
   Tactic,
   TurnResolution,
} from '../../../shared/src/types/index.js';
import { GOOD_PURCHASE_COST } from '../../../shared/src/constants/index.js';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { error?: string };
    return payload.error ?? `İstek başarısız (${response.status})`;
  } catch {
    return `İstek başarısız (${response.status})`;
  }
}

interface GameStore {
  /* ── data ────────────────────────────────────────── */
  ports: Port[];
  routes: Route[];
  goods: Good[];
  gameState: GameState | null;
  turnLog: Array<{ label: string; detail: string }>;
  error: string;
  actionError: string;
  notice: string;
  loading: boolean;
  actionLoading: boolean;
  lastResolution: TurnResolution | null;

  /* ── order draft ─────────────────────────────────── */
  order: Order;
  tactic: Tactic;

  /* ── actions ─────────────────────────────────────── */
  bootstrap: () => Promise<void>;
  setOrder: (patch: Partial<Order>) => void;
  setTactic: (tactic: Tactic) => void;
  refreshWhispers: () => Promise<void>;
  buyCurrentGood: (goodId: string) => Promise<void>;
  dropCargo: (cargoIndex: number) => Promise<void>;
  repairShip: () => Promise<void>;
  resolveTurn: () => Promise<TurnResolution | null>;
  spreadRumor: (templateId: RumorTemplateId, targetPortId: string) => Promise<void>;
  clearActionError: () => void;
  clearNotice: () => void;
  setActionError: (message: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ports: [],
  routes: [],
  goods: [],
  gameState: null,
  turnLog: [],
  error: '',
  actionError: '',
  notice: '',
  loading: true,
  actionLoading: false,
  lastResolution: null,

  order: { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' },
  tactic: 'pruva',

  /* ── bootstrap ───────────────────────────────────── */
  bootstrap: async () => {
    try {
      const response = await fetch(`${API_URL}/api/bootstrap`);
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data: BootstrapPayload = await response.json();
      const startPortId = data.gameState.player.currentPortId;
      const firstRoute = data.routes.find((route) => route.from === startPortId || route.to === startPortId);
      const defaultDestination = firstRoute
        ? (firstRoute.from === startPortId ? firstRoute.to : firstRoute.from)
        : '';
      set({
        ports: data.ports,
        routes: data.routes,
        goods: data.goods,
        gameState: data.gameState,
        loading: false,
        error: '',
        order: {
          destinationPort: defaultDestination,
          routeType: firstRoute?.type ?? 'fortuna',
          intent: 'kervan',
        },
      });
    } catch (error) {
      set({
        error: error instanceof Error
          ? error.message
          : `Bootstrap verisi alınamadı (${API_URL}/api/bootstrap). Serverı "pnpm dev" ile ayağa kaldır.`,
        loading: false,
      });
    }
  },

  setOrder: (patch) =>
    set((state) => ({ order: { ...state.order, ...patch }, actionError: '', notice: '' })),

  setTactic: (tactic) => set({ tactic }),

  clearActionError: () => set({ actionError: '' }),
  clearNotice: () => set({ notice: '' }),
  setActionError: (message) => set({ actionError: message, notice: '' }),

  /* ── whispers ────────────────────────────────────── */
  refreshWhispers: async () => {
    const { gameState } = get();
    if (!gameState) return;
    try {
      set({ actionLoading: true, actionError: '', notice: '' });
      const response = await fetch(`${API_URL}/api/whispers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portId: gameState.player.currentPortId,
          experience: gameState.player.experience,
        }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data = await response.json() as { whispers: string[] };
      set({
        gameState: {
          ...gameState,
          lastWhispers: data.whispers,
        },
        actionLoading: false,
        notice: 'Kahvehaneden yeni fısıltılar toplandı.',
      });
    } catch (error) {
      set({
        actionLoading: false,
        actionError: error instanceof Error ? error.message : 'Fısıltılar yenilenemedi.',
      });
    }
  },

  /* ── buy ─────────────────────────────────────────── */
  buyCurrentGood: async (goodId) => {
    const { gameState, ports, goods } = get();
    if (!gameState) return;
    const currentPort = ports.find((p) => p.id === gameState.player.currentPortId);
    if (!currentPort) {
      set({ actionError: 'Liman verisi bulunamadı.' });
      return;
    }
    const goodsEntry = goods.find((g) => g.id === goodId);
    if (!goodsEntry) {
      set({ actionError: 'Mal bilgisi bulunamadı.' });
      return;
    }

    const cargoCount = gameState.player.cargo.reduce((sum, item) => sum + item.quantity, 0);
    if (cargoCount >= gameState.player.ship.cargoCapacity || gameState.player.gold < GOOD_PURCHASE_COST) {
      set({ actionError: 'Kargo kapasitesi ya da altın yetersiz.' });
      return;
    }

    try {
      set({ actionLoading: true, actionError: '', notice: '' });
      const response = await fetch(`${API_URL}/api/buy-good`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: gameState, goodId: goodsEntry.id }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data = await response.json() as { state: GameState };
      set({ gameState: data.state, actionLoading: false, notice: `${goodsEntry.name} yüklendi.` });
    } catch (error) {
      set({
        actionLoading: false,
        actionError: error instanceof Error ? error.message : 'Mal alınamadı.',
      });
    }
  },

  /* ── drop cargo ──────────────────────────────────── */
  dropCargo: async (cargoIndex) => {
    const { gameState } = get();
    if (!gameState) return;
    try {
      set({ actionLoading: true, actionError: '', notice: '' });
      const response = await fetch(`${API_URL}/api/load-cargo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: gameState, cargoIndex, action: 'drop' }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data = await response.json() as { state: GameState };
      set({ gameState: data.state, actionLoading: false, notice: 'Kargo denize bırakıldı.' });
    } catch (error) {
      set({
        actionLoading: false,
        actionError: error instanceof Error ? error.message : 'Kargo bırakılamadı.',
      });
    }
  },

  /* ── repair ──────────────────────────────────────── */
  repairShip: async () => {
    const { gameState } = get();
    if (!gameState) return;
    try {
      set({ actionLoading: true, actionError: '', notice: '' });
      const response = await fetch(`${API_URL}/api/repair-ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: gameState }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data = await response.json() as { state: GameState; goldSpent: number };
      set({
        gameState: data.state,
        actionLoading: false,
        notice: `Gemi onarıldı (-${data.goldSpent} altın).`,
      });
    } catch (error) {
      set({
        actionLoading: false,
        actionError: error instanceof Error ? error.message : 'Gemi onarılamadı.',
      });
    }
  },

  /* ── resolve turn ────────────────────────────────── */
  resolveTurn: async () => {
    const { gameState, order, tactic } = get();
    if (!gameState) return null;
    try {
      set({ actionLoading: true, actionError: '', notice: '' });
      const response = await fetch(`${API_URL}/api/resolve-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: gameState, order, tactic }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data: TurnResolution = await response.json();
      set({
        gameState: data.nextState,
        turnLog: data.log,
        lastResolution: data,
        actionLoading: false,
        notice: 'Tur çözüldü.',
      });
      return data;
    } catch (error) {
      set({
        actionLoading: false,
        actionError: error instanceof Error ? error.message : 'Tur çözümlenemedi.',
      });
      return null;
    }
  },

  spreadRumor: async (templateId, targetPortId) => {
    const { gameState } = get();
    if (!gameState) return;
    try {
      set({ actionLoading: true, actionError: '', notice: '' });
      const response = await fetch(`${API_URL}/api/spread-rumor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: gameState, templateId, targetPortId }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      const data = await response.json() as {
        state: GameState;
        rumor: { text: string; counterRumorTriggered: boolean };
      };
      set({
        gameState: data.state,
        actionLoading: false,
        notice: data.rumor.counterRumorTriggered
          ? 'Söylenti yayıldı ama fazla konuştuğun için karşı fısıltı da doğdu.'
          : 'Söylenti liman kahvehanelerine bırakıldı.',
      });
    } catch (error) {
      set({
        actionLoading: false,
        actionError: error instanceof Error ? error.message : 'Söylenti yayılamadı.',
      });
    }
  },
}));
