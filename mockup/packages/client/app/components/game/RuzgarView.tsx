'use client';

import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';
import StarRating from '../ui/StarRating';
import Modal from '../ui/Modal';

export default function RuzgarView() {
  const gameState = useGameStore((s) => s.gameState);
  const turnLog = useGameStore((s) => s.turnLog);
  const lastResolution = useGameStore((s) => s.lastResolution);
  const showCombatResult = useUIStore((s) => s.showCombatResult);
  const showTradeResult = useUIStore((s) => s.showTradeResult);
  const setShowCombatResult = useUIStore((s) => s.setShowCombatResult);
  const setShowTradeResult = useUIStore((s) => s.setShowTradeResult);
  const setActiveView = useUIStore((s) => s.setActiveView);

  if (!gameState) return null;

  const latestRumor = gameState.activeRumors.at(-1);

  return (
    <div className="ruzgar-view">
      <div className="section-head">
        <h2>🌊 Rüzgâr Özeti</h2>
        <p className="muted">Son çözümleme akışı</p>
      </div>

      {/* ── Turn log ─────────────────────────────────── */}
      <div className="ruzgar-log card">
        {turnLog.length > 0 ? (
          <div className="stack">
            {turnLog.map((entry, idx) => (
              <p key={`${entry.label}-${idx}`} className="log-item">
                <strong>{entry.label}:</strong> {entry.detail}
              </p>
            ))}
          </div>
        ) : (
          <p className="note">Henüz çözümleme yapılmadı.</p>
        )}
      </div>

      {/* ── Latest rumor ─────────────────────────────── */}
      {latestRumor && (
        <div className="ruzgar-rumor card">
          <h3>📢 Aktif Söylenti</h3>
          <p>{latestRumor.text}</p>
        </div>
      )}

      {/* ── Continue button ──────────────────────────── */}
      <div className="ruzgar-actions">
        <button className="primary" onClick={() => setActiveView('fondaco')}>
          ➡️ Sonraki Tura Geç
        </button>
      </div>

      {/* ── Combat result modal ──────────────────────── */}
      <Modal open={showCombatResult} onClose={() => setShowCombatResult(false)} title="⚔️ Savaş Sonucu">
        {lastResolution?.combat ? (
          <div className="stack">
            <p><strong>Sonuç:</strong> {lastResolution.combat.result}</p>
            <p><strong>Taktik:</strong> {lastResolution.combat.tactic}</p>
            <p><strong>Düşman:</strong> {lastResolution.combat.enemyTactic}</p>
            <p><strong>Güç:</strong> {lastResolution.combat.playerPower} / {lastResolution.combat.enemyPower}</p>
            <p><strong>Altın etkisi:</strong> {lastResolution.combat.goldDelta}</p>
          </div>
        ) : (
          <p className="note">Bu tur savaş yaşanmadı.</p>
        )}
        <button className="primary" onClick={() => setShowCombatResult(false)}>Tamam</button>
      </Modal>

      {/* ── Trade result modal ───────────────────────── */}
      <Modal open={showTradeResult} onClose={() => setShowTradeResult(false)} title="💰 Ticaret Sonucu">
        {lastResolution?.trade ? (
          <div className="stack">
            <p><strong>Satılan mallar:</strong> {lastResolution.trade.sold.join(', ') || 'Yok'}</p>
            <p><strong>Altın:</strong> +{lastResolution.trade.goldDelta}</p>
            <div>
              <strong>Pazar yıldızı:</strong> <StarRating stars={lastResolution.trade.stars} />
            </div>
            {lastResolution.contracts && lastResolution.contracts.goldDelta !== 0 && (
              <p><strong>Kontrat etkisi:</strong> {lastResolution.contracts.goldDelta}</p>
            )}
          </div>
        ) : (
          <p className="note">Bu tur ticaret raporu oluşmadı.</p>
        )}
        <button className="primary" onClick={() => setShowTradeResult(false)}>Tamam</button>
      </Modal>
    </div>
  );
}
