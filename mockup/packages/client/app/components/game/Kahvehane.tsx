'use client';

import { useMemo, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import type { RumorTemplateId } from '../../../../shared/src/types/index.js';

const TEMPLATE_LABELS: Record<RumorTemplateId, string> = {
  gozdagi: 'Gözdağı',
  suclama: 'Suçlama',
  karalama: 'Karalama',
  ovgu: 'Övgü',
  ifsa: 'İfşa',
  piyasa: 'Piyasa',
};

export default function Kahvehane() {
  const gameState = useGameStore((s) => s.gameState);
  const ports = useGameStore((s) => s.ports);
  const refreshWhispers = useGameStore((s) => s.refreshWhispers);
  const spreadRumor = useGameStore((s) => s.spreadRumor);
  const [targetPortId, setTargetPortId] = useState('venedik');

  if (!gameState) return null;
  const targetOptions = useMemo(
    () => ports.filter((port) => port.id !== gameState.player.currentPortId),
    [ports, gameState.player.currentPortId],
  );
  const activeTarget = targetOptions.some((port) => port.id === targetPortId)
    ? targetPortId
    : targetOptions[0]?.id ?? gameState.player.currentPortId;

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
        <button className="rumor-btn" title="Pasif olarak dinle" onClick={() => void refreshWhispers()}>
          👂 Dinle
        </button>
        <label className="note" style={{ display: 'grid', gap: 6 }}>
          Hedef liman
          <select value={activeTarget} onChange={(event) => setTargetPortId(event.target.value)}>
            {targetOptions.map((port) => (
              <option key={port.id} value={port.id}>
                {port.displayName}
              </option>
            ))}
          </select>
        </label>
        {(Object.keys(TEMPLATE_LABELS) as RumorTemplateId[]).map((templateId) => (
          <button
            key={templateId}
            className="rumor-btn"
            title={`${TEMPLATE_LABELS[templateId]} söylentisi yay (25 altın)`}
            onClick={() => void spreadRumor(templateId, activeTarget)}
            disabled={activeTarget === gameState.player.currentPortId}
          >
            🌬️ {TEMPLATE_LABELS[templateId]}
          </button>
        ))}
      </div>
    </div>
  );
}
