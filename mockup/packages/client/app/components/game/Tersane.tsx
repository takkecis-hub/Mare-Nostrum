'use client';

import { useGameStore } from '../../stores/useGameStore';
import { EXPERIENCE_LABELS, REPAIR_COST_PER_POINT } from '../../../../shared/src/constants/index.js';
import ProgressBar from '../ui/ProgressBar';

export default function Tersane() {
  const gameState = useGameStore((s) => s.gameState);
  const repairShip = useGameStore((s) => s.repairShip);

  if (!gameState) return null;
  const { player } = gameState;
  const { ship } = player;
  const needsRepair = ship.durability < 100;
  const canRepair = needsRepair && player.gold >= REPAIR_COST_PER_POINT;
  const repairCost = (100 - ship.durability) * REPAIR_COST_PER_POINT;

  return (
    <div className="fondaco-panel">
      <div className="section-head">
        <h2>⚓ Tersane</h2>
      </div>

      {/* ── Ship identity ──────────────────────────────── */}
      <div className="ship-display">
        <div className="ship-silhouette">
          {ship.type === 'feluka' && '⛵'}
          {ship.type === 'karaka' && '🚢'}
          {ship.type === 'kadirga' && '⚔️🚣'}
        </div>
        <div className="ship-identity">
          <h3>{ship.type.charAt(0).toUpperCase() + ship.type.slice(1)}</h3>
          <span className="muted">Kaptan {player.name}</span>
        </div>
      </div>

      {/* ── Durability ───────────────────────────────── */}
      <div className="tersane-section">
        <span className="tersane-label">Dayanıklılık</span>
        <ProgressBar value={ship.durability} max={100} label={`${ship.durability}/100`} gradient />
        {canRepair && (
          <button className="repair-btn" onClick={repairShip}>
            🔧 Tamir et ({repairCost} 🪙)
          </button>
        )}
        {!needsRepair && <span className="note">Gemi tam durumda.</span>}
      </div>

      {/* ── Ship stats ───────────────────────────────── */}
      <div className="ship-stats-grid">
        <div className="stat-box">
          <span>Güç</span>
          <strong>{ship.power}</strong>
        </div>
        <div className="stat-box">
          <span>Kapasite</span>
          <strong>{ship.cargoCapacity}</strong>
        </div>
        <div className="stat-box">
          <span>Tip</span>
          <strong>{ship.type}</strong>
        </div>
      </div>

      {/* ── Experience ───────────────────────────────── */}
      <div className="section-head" style={{ marginTop: 16 }}>
        <h3>Deneyim</h3>
      </div>
      <div className="exp-grid">
        {(Object.keys(EXPERIENCE_LABELS) as Array<keyof typeof EXPERIENCE_LABELS>).map((key) => (
          <div key={key} className="exp-item">
            <span>{EXPERIENCE_LABELS[key]}</span>
            <strong>{player.experience[key]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
