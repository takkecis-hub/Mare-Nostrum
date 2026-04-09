'use client';

import { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import DotIndicator from '../ui/DotIndicator';
import { GOOD_PURCHASE_COST } from '../../../../shared/src/constants/index.js';

export default function Pazar() {
  const gameState = useGameStore((s) => s.gameState);
  const ports = useGameStore((s) => s.ports);
  const goods = useGameStore((s) => s.goods);
  const buyCurrentGood = useGameStore((s) => s.buyCurrentGood);
  const dropCargo = useGameStore((s) => s.dropCargo);

  const currentPort = useMemo(
    () => ports.find((p) => p.id === gameState?.player.currentPortId) ?? null,
    [ports, gameState?.player.currentPortId],
  );

  const producedGoods = useMemo(
    () =>
      currentPort
        ? [currentPort.produces, ...(currentPort.bonusProduces ?? [])]
          .map((slot) => goods.find((g) => g.id === slot.good))
          .filter((good): good is NonNullable<typeof good> => Boolean(good))
        : [],
    [goods, currentPort],
  );

  if (!gameState || !currentPort) return null;
  const { player } = gameState;
  const cargoCount = player.cargo.reduce((sum, item) => sum + item.quantity, 0);
  const atCapacity = cargoCount >= player.ship.cargoCapacity;
  const canBuy = player.gold >= GOOD_PURCHASE_COST && !atCapacity;
  const visibility = gameState.priceVisibility ?? 'none';
  const canSeeLocalMarket = visibility !== 'none';
  const canSeeDemand = visibility === 'network' || visibility === 'full';

  return (
    <div className="fondaco-panel">
      <div className="section-head">
        <h2>🏪 Pazar</h2>
      </div>

      {/* ── Port production ──────────────────────────── */}
      <div className="market-info">
        <div className="market-row">
          <span>Liman üretimi</span>
          {canSeeLocalMarket ? (
            <strong>{producedGoods.map((good) => good.name).join(', ')}</strong>
          ) : (
            <strong>Terazi zayıf — pazar sisli</strong>
          )}
        </div>
        <div className="market-row">
          <span>Aranan mal</span>
          <strong>{canSeeDemand ? currentPort.desires.good : 'Ağ bilgisi kapalı'}</strong>
        </div>
        {canSeeLocalMarket && producedGoods[0] && <DotIndicator value={producedGoods[0].priceIndicator} />}
      </div>

      {/* ── Buy button ───────────────────────────────── */}
      <div className="stack">
        {producedGoods.map((good) => (
          <button
            key={good.id}
            className="primary market-buy-btn"
            onClick={() => void buyCurrentGood(good.id)}
            disabled={!canBuy}
          >
            {`${good.name} al (-${GOOD_PURCHASE_COST} 🪙)`}
          </button>
        ))}
      </div>

      {/* ── Cargo capacity bar ───────────────────────── */}
      <div className="cargo-section">
        <div className="cargo-header">
          <span>Kargo</span>
          <strong>{cargoCount}/{player.ship.cargoCapacity}</strong>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(cargoCount / player.ship.cargoCapacity) * 100}%` }}
          />
        </div>

        {/* ── Cargo items ──────────────────────────────── */}
        {player.cargo.length > 0 ? (
          <div className="cargo-list">
            {player.cargo.map((item, idx) => (
              <div key={`${item.goodId}-${idx}`} className="cargo-row">
                <div className="cargo-item-info">
                  <strong>{item.name}</strong>
                  <span className="muted">({item.originPort})</span>
                </div>
                <button className="small" onClick={() => dropCargo(idx)}>At</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="note">Kargo boş.</p>
        )}
      </div>
    </div>
  );
}
