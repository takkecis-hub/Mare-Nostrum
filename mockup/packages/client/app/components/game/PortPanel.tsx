'use client';

import { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';

export default function PortPanel() {
  const ports = useGameStore((s) => s.ports);
  const gameState = useGameStore((s) => s.gameState);
  const selectedPortId = useUIStore((s) => s.selectedPortId);

  const selectedPort = useMemo(
    () => ports.find((p) => p.id === selectedPortId) ?? null,
    [ports, selectedPortId],
  );

  if (!gameState || !selectedPort) return null;
  const { player } = gameState;
  const visibility = gameState.priceVisibility ?? 'none';
  const isCurrentPort = selectedPort.id === player.currentPortId;
  const canSeeSelectedMarket = visibility === 'full' || (isCurrentPort && visibility !== 'none');
  const canSeeSelectedDemand = visibility === 'full' || visibility === 'network' || isCurrentPort;

  return (
    <div className="port-panel">
      <div className="section-head">
        <h2>Liman Detayı</h2>
      </div>
      <h3 className="port-panel-name">{selectedPort.displayName}</h3>

      <ul className="detail-list">
        <li>
          <span>Bölge</span>
          <strong>{selectedPort.region}</strong>
        </li>
        <li>
          <span>Ürettiği</span>
          <strong>{canSeeSelectedMarket ? selectedPort.produces.good : 'Sisli pazar'}</strong>
        </li>
        <li>
          <span>Aradığı</span>
          <strong>{canSeeSelectedDemand ? selectedPort.desires.good : 'Terazi yetersiz'}</strong>
        </li>
        <li>
          <span>Kontrol</span>
          <strong>{selectedPort.controller}</strong>
        </li>
      </ul>
      {selectedPort.trivia[0] && <p className="note trivia-text">{selectedPort.trivia[0]}</p>}

      <div className="section-head" style={{ marginTop: 16 }}>
        <h3>Kaptan Profili</h3>
      </div>
      <ul className="detail-list small">
        <li>
          <span>Gemi</span>
          <strong>{player.ship.type} / kapasite {player.ship.cargoCapacity}</strong>
        </li>
        <li>
          <span>Dayanıklılık</span>
          <strong>{player.ship.durability}/100</strong>
        </li>
        <li>
          <span>Ün</span>
          <strong>{player.renown.length > 0 ? player.renown.join(', ') : 'Henüz yok'}</strong>
        </li>
        <li>
          <span>Kargo</span>
          <strong>
            {player.cargo.length > 0
              ? player.cargo.map((item) => item.name).join(', ')
              : 'Boş'}
          </strong>
        </li>
      </ul>
    </div>
  );
}
