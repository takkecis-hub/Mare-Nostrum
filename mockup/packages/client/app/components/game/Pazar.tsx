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

  const producedGood = useMemo(
    () => goods.find((g) => g.id === currentPort?.produces.good) ?? null,
    [goods, currentPort?.produces.good],
  );

  if (!gameState || !currentPort) return null;
  const { player } = gameState;
  const cargoCount = player.cargo.reduce((sum, item) => sum + item.quantity, 0);
  const atCapacity = cargoCount >= player.ship.cargoCapacity;
  const canBuy = player.gold >= GOOD_PURCHASE_COST && !atCapacity;

  return (
    <div className="fondaco-panel">
      <div className="section-head">
        <h2>🏪 Pazar</h2>
      </div>

      {/* ── Port production ──────────────────────────── */}
      <div className="market-info">
        <div className="market-row">
          <span>Liman üretimi</span>
          <strong>{currentPort.produces.good}</strong>
          {producedGood && <DotIndicator value={producedGood.priceIndicator} />}
        </div>
        <div className="market-row">
          <span>Aranan mal</span>
          <strong>{currentPort.desires.good}</strong>
        </div>
      </div>

      {/* ── Buy button ───────────────────────────────── */}
      <button
        className="primary market-buy-btn"
        onClick={buyCurrentGood}
        disabled={!canBuy}
      >
        {`Liman malını al (-${GOOD_PURCHASE_COST} 🪙)`}
      </button>

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
