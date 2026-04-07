'use client';

import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import type { RouteType, Intent, Tactic, Port, Route, Good, CargoItem, GameState, BootstrapPayload, TurnResolution } from '../../shared/src/types/index.js';
import { EXPERIENCE_LABELS, GOOD_PURCHASE_COST, REPAIR_COST_PER_POINT } from '../../shared/src/constants/index.js';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const routeColors: Record<RouteType, string> = {
  tramontana: '#7dd3fc',
  kabotaj: '#86efac',
  fortuna: '#fda4af',
  uzun_kabotaj: '#c4b5fd',
};

function routeDasharray(routeType: RouteType) {
  if (routeType === 'kabotaj') {
    return '6 6';
  }

  if (routeType === 'uzun_kabotaj') {
    return '12 6';
  }

  return undefined;
}

export default function Page() {
  const [payload, setPayload] = useState<BootstrapPayload | null>(null);
  const [selectedPortId, setSelectedPortId] = useState('venedik');
  const [socketStatus, setSocketStatus] = useState('bağlanıyor');
  const [order, setOrder] = useState<{ destinationPort: string; routeType: RouteType; intent: Intent }>({
    destinationPort: 'istanbul',
    routeType: 'fortuna',
    intent: 'kervan',
  });
  const [tactic, setTactic] = useState<Tactic>('pruva');
  const [turnLog, setTurnLog] = useState<Array<{ label: string; detail: string }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/bootstrap`)
      .then((response) => response.json())
      .then((data: BootstrapPayload) => {
        setPayload(data);
        setSelectedPortId(data.gameState.player.currentPortId);
      })
      .catch(() =>
        setError(`Bootstrap verisi alınamadı (${API_URL}/api/bootstrap). Serverı "pnpm dev" ile ayağa kaldır.`),
      );

    const socket = io(API_URL, { transports: ['websocket'] });
    socket.on('connect', () => {
      setSocketStatus('bağlı');
      socket.emit('ping');
    });
    socket.on('status', (message) => setSocketStatus(message.message));
    socket.on('pong', () => setSocketStatus('ping/pong hazır'));
    socket.on('disconnect', () => setSocketStatus('bağlantı koptu'));

    return () => {
      socket.close();
    };
  }, []);

  const selectedPort = useMemo(
    () => payload?.ports.find((port) => port.id === selectedPortId) ?? null,
    [payload, selectedPortId],
  );

  const currentPort = useMemo(
    () => payload?.ports.find((port) => port.id === payload.gameState.player.currentPortId) ?? null,
    [payload],
  );
  const latestRumor = payload?.gameState.activeRumors.at(-1);

  const reachableRoutes = useMemo(() => {
    if (!payload || !currentPort) return [];
    return payload.routes.filter((route) => route.from === currentPort.id || route.to === currentPort.id);
  }, [payload, currentPort]);

  useEffect(() => {
    if (!reachableRoutes.length) return;
    const first = reachableRoutes[0];
    setOrder((previous) => ({
      ...previous,
      destinationPort: first.from === currentPort?.id ? first.to : first.from,
      routeType: first.type,
    }));
  }, [reachableRoutes, currentPort?.id]);

  async function refreshWhispers() {
    if (!payload || !currentPort) return;
    const response = await fetch(`${API_URL}/api/whispers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portId: currentPort.id, experience: payload.gameState.player.experience }),
    });
    const data = await response.json();
    setPayload({
      ...payload,
      gameState: {
        ...payload.gameState,
        lastWhispers: data.whispers,
      },
    });
  }

  async function buyCurrentGood() {
    if (!payload || !currentPort) return;
    const goodsEntry = payload.goods.find((good) => good.id === currentPort.produces.good);
    if (!goodsEntry) return;

    const cargoCount = payload.gameState.player.cargo.reduce((total, item) => total + item.quantity, 0);
    if (cargoCount >= payload.gameState.player.ship.cargoCapacity || payload.gameState.player.gold < GOOD_PURCHASE_COST) return;

    const response = await fetch(`${API_URL}/api/buy-good`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: payload.gameState, goodId: goodsEntry.id }),
    });

    if (!response.ok) return;
    const data = await response.json();
    setPayload({ ...payload, gameState: data.state });
  }

  async function dropCargo(cargoIndex: number) {
    if (!payload) return;

    const response = await fetch(`${API_URL}/api/load-cargo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: payload.gameState, cargoIndex, action: 'drop' }),
    });

    if (!response.ok) return;
    const data = await response.json();
    setPayload({ ...payload, gameState: data.state });
  }

  async function repairShipAction() {
    if (!payload) return;

    const response = await fetch(`${API_URL}/api/repair-ship`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: payload.gameState }),
    });

    if (!response.ok) return;
    const data = await response.json();
    setPayload({ ...payload, gameState: data.state });
  }

  async function resolveCurrentTurn() {
    if (!payload) return;

    const response = await fetch(`${API_URL}/api/resolve-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: payload.gameState,
        order,
        tactic,
      }),
    });

    const data: TurnResolution = await response.json();
    setPayload({ ...payload, gameState: data.nextState });
    setTurnLog(data.log);
    setSelectedPortId(data.nextState.player.currentPortId);
  }

  if (!payload) {
    return <main className="shell">{error ? <p>{error}</p> : <p>Mockup yükleniyor...</p>}</main>;
  }

  return (
    <main className="shell">
      <section className="hero card">
        <div>
          <p className="eyebrow">Implementation Plan v2 mockup</p>
          <h1>Mare Nostrum — dikey kesit</h1>
          <p>
            Harita, Fondaco, emir ve Rüzgâr çözümleme akışını tek ekranda doğrulayan ayrı bir alt klasör.
          </p>
        </div>
        <div className="status-grid">
          <div>
            <span>Tur</span>
            <strong>{payload.gameState.turn}</strong>
          </div>
          <div>
            <span>Mevsim</span>
            <strong>{payload.gameState.season}</strong>
          </div>
          <div>
            <span>Socket</span>
            <strong>{socketStatus}</strong>
          </div>
          <div>
            <span>Altın</span>
            <strong>{payload.gameState.player.gold}</strong>
          </div>
        </div>
      </section>

      <section className="grid layout">
        <article className="card map-card">
          <div className="section-head">
            <h2>Harita + 15 liman</h2>
            <p>Rota renkleri: Tramontana / Kabotaj / Fortuna / Uzun Kabotaj</p>
          </div>
          <svg viewBox="0 0 860 520" className="map">
            {payload.routes.map((route) => {
              const from = payload.ports.find((port) => port.id === route.from)!;
              const to = payload.ports.find((port) => port.id === route.to)!;
              return (
                <line
                  key={route.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={routeColors[route.type]}
                  strokeWidth={route.isChokepoint ? 5 : 3}
                  strokeDasharray={routeDasharray(route.type)}
                />
              );
            })}
            {payload.ports.map((port) => (
              <g key={port.id} onClick={() => setSelectedPortId(port.id)} className="port-node">
                <circle
                  cx={port.x}
                  cy={port.y}
                  r={payload.gameState.player.currentPortId === port.id ? 14 : 10}
                  fill={selectedPortId === port.id ? '#facc15' : '#0f172a'}
                  stroke="#e2e8f0"
                  strokeWidth={2}
                />
                <text x={port.x + 14} y={port.y - 14}>{port.name}</text>
              </g>
            ))}
          </svg>
        </article>

        <article className="card side-panel">
          <div className="section-head">
            <h2>Liman detayı</h2>
            <p>{selectedPort?.displayName}</p>
          </div>
          {selectedPort && (
            <>
              <ul className="detail-list">
                <li><span>Bölge</span><strong>{selectedPort.region}</strong></li>
                <li><span>Ürettiği</span><strong>{selectedPort.produces.good}</strong></li>
                <li><span>Aradığı</span><strong>{selectedPort.desires.good}</strong></li>
              </ul>
              <p className="note">{selectedPort.trivia[0]}</p>
            </>
          )}

          <div className="section-head">
            <h3>Oyuncu profili</h3>
            <p>{payload.gameState.player.ship.type} / kapasite {payload.gameState.player.ship.cargoCapacity}</p>
          </div>
          <ul className="detail-list small">
            <li><span>Dayanıklılık</span><strong>{payload.gameState.player.ship.durability}</strong></li>
            <li><span>Ün</span><strong>{payload.gameState.player.renown.join(', ') || 'Henüz yok'}</strong></li>
            <li><span>Kargo</span><strong>{payload.gameState.player.cargo.map((item) => item.name).join(', ') || 'Boş'}</strong></li>
          </ul>
        </article>
      </section>

      <section className="grid cards-3">
        <article className="card">
          <div className="section-head">
            <h2>Fondaco — Kahvehane</h2>
            <button onClick={refreshWhispers}>3 fısıltıyı yenile</button>
          </div>
          <div className="stack">
            {payload.gameState.lastWhispers.map((whisper) => (
              <p key={whisper} className="whisper">{whisper}</p>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="section-head">
            <h2>Pazar</h2>
            <button onClick={buyCurrentGood} disabled={payload.gameState.player.gold < GOOD_PURCHASE_COST}>{`Liman malını al (-${GOOD_PURCHASE_COST})`}</button>
          </div>
          <p className="note">
            {currentPort?.name} üretimi: <strong>{currentPort?.produces.good}</strong>
          </p>
          {payload.gameState.player.cargo.length > 0 ? (
            <div className="stack" style={{ marginTop: 12 }}>
              <p className="note" style={{ marginBottom: 4 }}>Kargo ({payload.gameState.player.cargo.length}/{payload.gameState.player.ship.cargoCapacity}):</p>
              {payload.gameState.player.cargo.map((item, idx) => (
                <div key={`${item.goodId}-${idx}`} className="cargo-row">
                  <span>{item.name} <span className="muted">({item.originPort})</span></span>
                  <button className="small" onClick={() => dropCargo(idx)}>At</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="note" style={{ marginTop: 12 }}>Kargo boş.</p>
          )}
        </article>

        <article className="card">
          <div className="section-head">
            <h2>Tersane</h2>
            <button
              onClick={repairShipAction}
              disabled={payload.gameState.player.ship.durability >= 100 || payload.gameState.player.gold < REPAIR_COST_PER_POINT}
            >
              Gemiyi tamir et
            </button>
          </div>
          <div className="durability-bar">
            <div
              className="durability-fill"
              style={{ width: `${payload.gameState.player.ship.durability}%` }}
            />
            <span className="durability-label">{payload.gameState.player.ship.durability}/100</span>
          </div>
          <ul className="detail-list small" style={{ marginTop: 12 }}>
            <li><span>Gemi</span><strong>{payload.gameState.player.ship.type}</strong></li>
            <li><span>Güç</span><strong>{payload.gameState.player.ship.power}</strong></li>
            <li><span>Kapasite</span><strong>{payload.gameState.player.ship.cargoCapacity}</strong></li>
          </ul>
          <div className="section-head" style={{ marginTop: 16 }}>
            <h3>Deneyim</h3>
          </div>
          <div className="exp-grid">
            {(Object.keys(EXPERIENCE_LABELS) as Array<keyof typeof EXPERIENCE_LABELS>).map((key) => (
              <div key={key} className="exp-item">
                <span>{EXPERIENCE_LABELS[key]}</span>
                <strong>{payload.gameState.player.experience[key]}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid cards-2">
        <article className="card">
          <div className="section-head">
            <h2>Emir sistemi</h2>
            <p>Nereye / nasıl / niyet</p>
          </div>
          <label>
            Hedef liman
            <select value={order.destinationPort} onChange={(event) => setOrder({ ...order, destinationPort: event.target.value })}>
              {reachableRoutes.map((route) => {
                const target = route.from === currentPort?.id ? route.to : route.from;
                return (
                  <option key={route.id} value={target}>{target}</option>
                );
              })}
            </select>
          </label>
          <label>
            Rota tipi
            <select value={order.routeType} onChange={(event) => setOrder({ ...order, routeType: event.target.value as RouteType })}>
              {[...new Set(reachableRoutes.map((route) => route.type))].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Niyet
            <select value={order.intent} onChange={(event) => setOrder({ ...order, intent: event.target.value as Intent })}>
              <option value="kervan">Kervan</option>
              <option value="kara_bayrak">Kara Bayrak</option>
              <option value="pusula">Pusula</option>
              <option value="duman">Duman</option>
            </select>
          </label>
          <label>
            Taktik
            <select value={tactic} onChange={(event) => setTactic(event.target.value as Tactic)}>
              <option value="pruva">Pruva</option>
              <option value="ates">Ateş</option>
              <option value="manevra">Manevra</option>
              <option value="kacis">Kaçış</option>
            </select>
          </label>
          <button className="primary" onClick={resolveCurrentTurn}>Emri kilitle ve çöz</button>
        </article>

        <article className="card">
          <div className="section-head">
            <h2>Rüzgâr özeti</h2>
            <p>Son çözümleme akışı</p>
          </div>
          <div className="stack">
            {turnLog.length ? turnLog.map((entry) => (
              <p key={`${entry.label}-${entry.detail}`} className="log-item"><strong>{entry.label}:</strong> {entry.detail}</p>
            )) : <p className="note">Henüz çözümleme yapılmadı.</p>}
            {latestRumor && (
              <p className="note">Aktif söylenti: {latestRumor.text}</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
