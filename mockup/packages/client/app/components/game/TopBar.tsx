'use client';

import { useGameStore } from '../../stores/useGameStore';
import { useSocketStore } from '../../stores/useSocketStore';
import Badge from '../ui/Badge';

const CONNECTED_STATUSES = ['bağlı', 'ping/pong hazır'];

export default function TopBar() {
  const gameState = useGameStore((s) => s.gameState);
  const socketStatus = useSocketStore((s) => s.status);

  if (!gameState) return null;

  const { player, turn, season } = gameState;

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <span className="top-bar-title">Mare Nostrum</span>
        <span className="top-bar-sep">|</span>
        <span className="top-bar-item">
          Tur <strong>{turn}</strong>
        </span>
        <span className="top-bar-item">
          {season === 'yaz' ? '☀️' : '❄️'} {season === 'yaz' ? 'Yaz' : 'Kış'}
        </span>
      </div>
      <div className="top-bar-right">
        {player.renown.length > 0 &&
          player.renown.map((title) => <Badge key={title} label={`★ ${title}`} variant="gold" />)}
        <span className="top-bar-item">
          <span className="gold-icon">🪙</span> <strong>{player.gold}</strong>
        </span>
        <span className="top-bar-item ship-name">
          ⛵ {player.ship.type}
        </span>
        <span className={`top-bar-item socket-status ${CONNECTED_STATUSES.includes(socketStatus) ? 'connected' : ''}`}>
          ● {socketStatus}
        </span>
      </div>
    </header>
  );
}
