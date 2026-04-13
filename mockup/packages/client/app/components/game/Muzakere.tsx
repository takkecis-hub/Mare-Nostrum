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

export default function Muzakere() {
  const gameState = useGameStore((s) => s.gameState);
  const ports = useGameStore((s) => s.ports);
  const refreshWhispers = useGameStore((s) => s.refreshWhispers);
  const spreadRumor = useGameStore((s) => s.spreadRumor);
  const [targetPortId, setTargetPortId] = useState('venedik');

  const targetOptions = useMemo(
    () => ports.filter((port) => port.id !== gameState?.player.currentPortId),
    [ports, gameState?.player.currentPortId],
  );

  if (!gameState) return null;

  const activeTarget = targetOptions.some((port) => port.id === targetPortId)
    ? targetPortId
    : targetOptions[0]?.id ?? gameState.player.currentPortId;

  return (
    <div className="muzakere-view">
      <section className="card intel-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Müzakere</p>
            <h2>İstihbarat</h2>
          </div>
          <button className="small" onClick={() => void refreshWhispers()}>
            Yenile
          </button>
        </div>

        <p className="note">
          Limandaki fısıltıları topla, hedef liman seç ve söylentiyi sessizce yay.
        </p>

        <div className="whisper-stack">
          {gameState.lastWhispers.length > 0 ? (
            gameState.lastWhispers.map((whisper, idx) => (
              <div key={`${whisper.slice(0, 20)}-${idx}`} className="whisper-card">
                <p className="whisper-text">{whisper}</p>
              </div>
            ))
          ) : (
            <p className="note">Henüz fısıltı yok. İstihbaratı yenileyerek dinlemeye başla.</p>
          )}
        </div>

        <div className="rumor-controls">
          <label className="rumor-target">
            Hedef liman
            <select value={activeTarget} onChange={(event) => setTargetPortId(event.target.value)}>
              {targetOptions.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.displayName}
                </option>
              ))}
            </select>
          </label>

          <div className="rumor-grid">
            {(Object.keys(TEMPLATE_LABELS) as RumorTemplateId[]).map((templateId) => (
              <button
                key={templateId}
                className="rumor-btn"
                title={`${TEMPLATE_LABELS[templateId]} söylentisi yay (25 altın)`}
                onClick={() => void spreadRumor(templateId, activeTarget)}
                disabled={activeTarget === gameState.player.currentPortId}
              >
                {TEMPLATE_LABELS[templateId]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card negotiation-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Müzakere</p>
            <h2>Sohbet</h2>
          </div>
          <span className="muted">Çok oyunculu hazırlık</span>
        </div>

        <p className="note">
          Diğer kaptanlarla veya NPC&apos;lerle diplomatik görüşmeler bu alanda toplanacak.
        </p>

        <div className="chat-placeholder">
          <div className="chat-tabs">
            <button className="chat-tab active" type="button">Genel</button>
            <button className="chat-tab" type="button">Özel Mesaj</button>
          </div>
          <div className="chat-body">
            <p className="chat-system-msg">
              Müzakere sistemi çok oyunculu modda aktif olacak.
            </p>
            <p className="chat-system-msg">
              Tek oyunculu modda NPC diyalogları burada görünecek.
            </p>
          </div>
          <div className="chat-input-row">
            <input className="chat-input" type="text" placeholder="Mesaj yaz..." disabled />
            <button disabled type="button">Gönder</button>
          </div>
        </div>
      </section>
    </div>
  );
}
