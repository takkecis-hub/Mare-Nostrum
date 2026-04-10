'use client';

import { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';
import MapView from './MapView';
import type { RouteType, Intent, Tactic } from '../../../../shared/src/types/index.js';

const ROUTE_INFO: Record<RouteType, { icon: string; label: string; desc: string; color: string }> = {
  tramontana: { icon: '🧭', label: 'Tramontana', desc: '1 tur, standart karşılaşma', color: '#7dd3fc' },
  kabotaj: { icon: '🏖️', label: 'Kabotaj', desc: '2 tur, güvenli, yavaş', color: '#86efac' },
  fortuna: { icon: '🌊', label: 'Fortuna', desc: '1 tur, riskli (%20 fırtına)', color: '#fda4af' },
  uzun_kabotaj: { icon: '🗺️', label: 'Uzun Kabotaj', desc: '2+ tur, keşif odaklı', color: '#c4b5fd' },
};

const INTENT_INFO: Record<Intent, { icon: string; label: string; desc: string; riskClass: string; riskLabel: string; rewardClass: string; rewardLabel: string; cardClass: string }> = {
  kervan: {
    icon: '🐪', label: 'Kervan', desc: 'Barışçıl ticaret',
    riskClass: 'risk-low', riskLabel: 'Düşük Risk',
    rewardClass: 'reward-gold', rewardLabel: 'Altın Kazancı',
    cardClass: 'choice-card-kervan',
  },
  kara_bayrak: {
    icon: '🏴‍☠️', label: 'Kara Bayrak', desc: 'Saldır ve yağmala',
    riskClass: 'risk-high', riskLabel: 'Yüksek Risk',
    rewardClass: 'reward-plunder', rewardLabel: 'Yağma',
    cardClass: 'choice-card-kara_bayrak',
  },
  pusula: {
    icon: '🧭', label: 'Pusula', desc: 'Keşfet ve gözle',
    riskClass: 'risk-medium', riskLabel: 'Orta Risk',
    rewardClass: 'reward-discovery', rewardLabel: 'Keşif',
    cardClass: 'choice-card-pusula',
  },
  duman: {
    icon: '🌫️', label: 'Duman', desc: 'Sessiz geçiş, istihbarat topla',
    riskClass: 'risk-low', riskLabel: 'Düşük Risk',
    rewardClass: 'reward-intel', rewardLabel: 'İstihbarat',
    cardClass: 'choice-card-duman',
  },
};

const TACTIC_INFO: Record<Tactic, { icon: string; label: string; desc: string }> = {
  pruva: { icon: '⚔️', label: 'Pruva', desc: 'Yaklaş ve borda et' },
  ates: { icon: '🔥', label: 'Ateş', desc: 'Mesafeli ateş' },
  manevra: { icon: '💨', label: 'Manevra', desc: 'Rüzgârı kullan, pozisyon al' },
  kacis: { icon: '🏃', label: 'Kaçış', desc: 'Savaştan kaç' },
};

export default function EmirView() {
  const gameState = useGameStore((s) => s.gameState);
  const ports = useGameStore((s) => s.ports);
  const routes = useGameStore((s) => s.routes);
  const order = useGameStore((s) => s.order);
  const tactic = useGameStore((s) => s.tactic);
  const setOrder = useGameStore((s) => s.setOrder);
  const setTactic = useGameStore((s) => s.setTactic);
  const resolveTurn = useGameStore((s) => s.resolveTurn);
  const setActionError = useGameStore((s) => s.setActionError);
  const setActiveView = useUIStore((s) => s.setActiveView);
  const setShowCombatResult = useUIStore((s) => s.setShowCombatResult);
  const setShowTradeResult = useUIStore((s) => s.setShowTradeResult);

  const currentPortId = gameState?.player.currentPortId;

  const reachableRoutes = useMemo(() => {
    if (!currentPortId) return [];
    return routes.filter((r) => r.from === currentPortId || r.to === currentPortId);
  }, [routes, currentPortId]);

  const availableRouteTypes = useMemo(
    () => [...new Set(reachableRoutes.map((r) => r.type))],
    [reachableRoutes],
  );
  const reachablePortIds = useMemo(() => {
    if (!currentPortId) return new Set<string>();
    return new Set(
      reachableRoutes
        .filter((route) => route.type === order.routeType)
        .map((route) => (route.from === currentPortId ? route.to : route.from)),
    );
  }, [currentPortId, order.routeType, reachableRoutes]);

  function handlePortSelect(portId: string) {
    setOrder({ destinationPort: portId });
  }

  async function handleLockOrder() {
    if (!reachablePortIds.has(order.destinationPort)) {
      setActionError('Seçili rota ve hedef birlikte geçerli değil.');
      return;
    }
    const result = await resolveTurn();
    if (result) {
      if (result.combat) {
        setShowCombatResult(true);
      }
      if (result.trade) {
        setShowTradeResult(true);
      }
      setActiveView('ruzgar');
    }
  }

  const destPort = ports.find((p) => p.id === order.destinationPort);
  const canLockOrder = Boolean(destPort) && reachablePortIds.has(order.destinationPort);

  return (
    <div className="emir-view">
      <div className="emir-header">
        <h2>⚓ Emir Sistemi</h2>
        <p className="muted">Nereye gideceksin, nasıl gideceksin, niyetin ne?</p>
      </div>

      {/* ── NEREYE? (Where) ─────────────────────────── */}
      <div className="emir-section">
        <h3>📍 NEREYE?</h3>
        <div className="emir-map-container card">
          <MapView interactive highlightReachable onPortClick={handlePortSelect} />
        </div>
        {destPort && (
          <div className="emir-dest-preview">
            Hedef: <strong>{destPort.displayName}</strong>
          </div>
        )}
      </div>

      {/* ── NASIL? (How) ────────────────────────────── */}
      <div className="emir-section">
        <h3>🧭 NASIL?</h3>
        <div className="choice-cards">
          {availableRouteTypes.map((type) => {
            const info = ROUTE_INFO[type];
            return (
              <button
                key={type}
                className={`choice-card ${order.routeType === type ? 'choice-card-selected' : ''}`}
                onClick={() => setOrder({ routeType: type })}
                style={{ borderLeftColor: order.routeType === type ? info.color : undefined }}
              >
                <span className="choice-icon">{info.icon}</span>
                <strong>{info.label}</strong>
                <span className="choice-desc">{info.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NIYET? (Intent) ─────────────────────────── */}
      <div className="emir-section">
        <h3>🎯 NİYET?</h3>
        <div className="choice-cards">
          {(Object.keys(INTENT_INFO) as Intent[]).map((intent) => {
            const info = INTENT_INFO[intent];
            return (
              <button
                key={intent}
                className={`choice-card ${info.cardClass} ${order.intent === intent ? 'choice-card-selected' : ''}`}
                onClick={() => setOrder({ intent })}
              >
                <span className="choice-icon">{info.icon}</span>
                <strong>{info.label}</strong>
                <span className="choice-desc">{info.desc}</span>
                <div className="intent-meta">
                  <span className={`risk-tag ${info.riskClass}`}>{info.riskLabel}</span>
                  <span className={`reward-tag ${info.rewardClass}`}>{info.rewardLabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAKTİK (Tactic — visible when intent is kara_bayrak) ─ */}
      {order.intent === 'kara_bayrak' && (
        <div className="emir-section">
          <h3>⚔️ TAKTİK</h3>
          <div className="choice-cards">
            {(Object.keys(TACTIC_INFO) as Tactic[]).map((t) => {
              const info = TACTIC_INFO[t];
              return (
                <button
                  key={t}
                  className={`choice-card ${tactic === t ? 'choice-card-selected' : ''}`}
                  onClick={() => setTactic(t)}
                >
                  <span className="choice-icon">{info.icon}</span>
                  <strong>{info.label}</strong>
                  <span className="choice-desc">{info.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Summary + Lock ──────────────────────────── */}
      <div className="emir-summary">
        <div className="emir-summary-items">
          <span>📍 {destPort?.name ?? '?'}</span>
          <span>🧭 {ROUTE_INFO[order.routeType]?.label}</span>
          <span>🎯 {INTENT_INFO[order.intent]?.label}</span>
          {order.intent === 'kara_bayrak' && <span>⚔️ {TACTIC_INFO[tactic]?.label}</span>}
        </div>
        <button className="primary emir-lock-btn" onClick={handleLockOrder} disabled={!canLockOrder}>
          🔒 Emri Kilitle ve Çöz
        </button>
      </div>
    </div>
  );
}
