import { create } from 'zustand';

export type GameView = 'menu' | 'fondaco' | 'muzakere' | 'emir' | 'ruzgar';
export type FondacoTab = 'pazar' | 'tersane';

interface UIStore {
  /* ── navigation ──────────────────────────────────── */
  activeView: GameView;
  fondacoTab: FondacoTab;
  selectedPortId: string;

  /* ── modals / overlays ───────────────────────────── */
  showCombatResult: boolean;
  showTradeResult: boolean;

  /* ── actions ─────────────────────────────────────── */
  setActiveView: (view: GameView) => void;
  setFondacoTab: (tab: FondacoTab) => void;
  setSelectedPortId: (id: string) => void;
  setShowCombatResult: (show: boolean) => void;
  setShowTradeResult: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: 'menu',
  fondacoTab: 'pazar',
  selectedPortId: 'venedik',

  showCombatResult: false,
  showTradeResult: false,

  setActiveView: (view) => set({ activeView: view }),
  setFondacoTab: (tab) => set({ fondacoTab: tab }),
  setSelectedPortId: (id) => set({ selectedPortId: id }),
  setShowCombatResult: (show) => set({ showCombatResult: show }),
  setShowTradeResult: (show) => set({ showTradeResult: show }),
}));
