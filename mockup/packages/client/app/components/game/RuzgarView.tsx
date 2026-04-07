'use client';

import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';
import StarRating from '../ui/StarRating';
import Modal from '../ui/Modal';

export default function RuzgarView() {
  const gameState = useGameStore((s) => s.gameState);
  const turnLog = useGameStore((s) => s.turnLog);
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
        <p className="note">Savaş detayları gelecek versiyonda görsel olarak gösterilecek.</p>
        <button className="primary" onClick={() => setShowCombatResult(false)}>Tamam</button>
      </Modal>

      {/* ── Trade result modal ───────────────────────── */}
      <Modal open={showTradeResult} onClose={() => setShowTradeResult(false)} title="💰 Ticaret Sonucu">
        <p className="note">Ticaret sonuçları burada detaylı gösterilecek.</p>
        <button className="primary" onClick={() => setShowTradeResult(false)}>Tamam</button>
      </Modal>
    </div>
  );
}
