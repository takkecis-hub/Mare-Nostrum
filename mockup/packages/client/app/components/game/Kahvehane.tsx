'use client';

import { useGameStore } from '../../stores/useGameStore';

export default function Kahvehane() {
  const gameState = useGameStore((s) => s.gameState);
  const refreshWhispers = useGameStore((s) => s.refreshWhispers);

  if (!gameState) return null;

  return (
    <div className="fondaco-panel">
      <div className="section-head">
        <h2>☕ Kahvehane</h2>
        <button onClick={refreshWhispers}>3 fısıltıyı yenile</button>
      </div>
      <p className="note">Limandaki dedikodulara kulak ver. Bilgi güçtür.</p>
      <div className="whisper-stack">
        {gameState.lastWhispers.length > 0 ? (
          gameState.lastWhispers.map((whisper, idx) => (
            <div key={`${whisper.slice(0, 20)}-${idx}`} className="whisper-card">
              <span className="whisper-icon">🗣️</span>
              <p className="whisper-text">{whisper}</p>
            </div>
          ))
        ) : (
          <p className="note">Henüz fısıltı yok. Butona tıklayarak dinle.</p>
        )}
      </div>

      <div className="rumor-actions">
        <button className="rumor-btn" title="Pasif olarak dinle">👂 Dinle</button>
        <button className="rumor-btn" title="Söylenti yay (25 altın)">🌬️ Rüzgâr Ek</button>
        <button className="rumor-btn" title="Yanlış söylentiyi çürüt">💧 Ateşe Su</button>
        <button className="rumor-btn" title="Kaynağı araştır">🔍 İzi Sürmek</button>
      </div>
    </div>
  );
}
