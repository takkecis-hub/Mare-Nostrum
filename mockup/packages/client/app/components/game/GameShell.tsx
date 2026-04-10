'use client';

import { useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';
import { useSocketStore } from '../../stores/useSocketStore';
import TopBar from './TopBar';
import MapView from './MapView';
import PortPanel from './PortPanel';
import FondacoView from './FondacoView';
import EmirView from './EmirView';
import RuzgarView from './RuzgarView';
import MainMenu from './MainMenu';

export default function GameShell() {
  const bootstrap = useGameStore((s) => s.bootstrap);
  const loading = useGameStore((s) => s.loading);
  const error = useGameStore((s) => s.error);
  const actionError = useGameStore((s) => s.actionError);
  const notice = useGameStore((s) => s.notice);
  const actionLoading = useGameStore((s) => s.actionLoading);
  const clearActionError = useGameStore((s) => s.clearActionError);
  const clearNotice = useGameStore((s) => s.clearNotice);
  const gameState = useGameStore((s) => s.gameState);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const activeView = useUIStore((s) => s.activeView);
  const setSelectedPortId = useUIStore((s) => s.setSelectedPortId);
  const setActiveView = useUIStore((s) => s.setActiveView);

  /* ── Bootstrap on mount ──────────────────────────── */
  useEffect(() => {
    bootstrap()
      .then(() => {
        const state = useGameStore.getState();
        if (state.gameState) {
          setSelectedPortId(state.gameState.player.currentPortId);
        }
      })
      .catch(() => {
        /* bootstrap sets error state internally */
      });
    connect();
    return () => disconnect();
  }, [bootstrap, connect, disconnect, setSelectedPortId]);

  /* ── Loading / Error states ──────────────────────── */
  if (loading) {
    return (
      <main className="shell">
        <div className="loading-screen">
          <span className="loading-spinner">⏳</span>
          <p>Mockup yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shell">
        <div className="error-screen card">
            <h2>⚠️ Bağlantı Hatası</h2>
            <p>{error}</p>
            <button className="primary" onClick={() => void bootstrap()}>
              Tekrar Dene
            </button>
          </div>
        </main>
      );
  }

  /* ── Main Menu ───────────────────────────────────── */
  if (activeView === 'menu') {
    return <MainMenu />;
  }

  /* ── Game layout ─────────────────────────────────── */
  return (
    <main className="shell">
      <TopBar />

      {(actionError || notice || actionLoading) && (
        <div className="card" style={{ marginBottom: 16, borderLeft: actionError ? '3px solid var(--danger)' : notice ? '3px solid var(--success)' : '3px solid var(--info)' }}>
          {actionLoading && <p className="note" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>⏳ İşlem sürüyor...</p>}
          {actionError && (
            <div className="section-head">
              <p style={{ color: 'var(--danger)' }}>⚠️ {actionError}</p>
              <button className="small" onClick={clearActionError}>Kapat</button>
            </div>
          )}
          {notice && (
            <div className="section-head">
              <p style={{ color: 'var(--success)' }}>✅ {notice}</p>
              <button className="small" onClick={clearNotice}>Kapat</button>
            </div>
          )}
        </div>
      )}

      {/* ── Phase navigation ─────────────────────────── */}
      <nav className="phase-nav">
        <button
          className={`phase-btn ${activeView === 'fondaco' ? 'phase-btn-active' : ''}`}
          onClick={() => setActiveView('fondaco')}
        >
          🏛️ Fondaco
        </button>
        <button
          className={`phase-btn ${activeView === 'emir' ? 'phase-btn-active' : ''}`}
          onClick={() => setActiveView('emir')}
        >
          📜 Emir
        </button>
        <button
          className={`phase-btn ${activeView === 'ruzgar' ? 'phase-btn-active' : ''}`}
          onClick={() => setActiveView('ruzgar')}
        >
          🌊 Rüzgâr
        </button>
      </nav>

      {/* ── View content ─────────────────────────────── */}
      <div className="game-content">
        {activeView === 'fondaco' && (
          <section className="grid layout">
            <div className="fondaco-main">
              <article className="card map-card">
                <div className="section-head">
                  <h2>🗺️ Harita</h2>
                </div>
                <MapView />
              </article>
              <FondacoView />
            </div>
            <aside className="card side-panel">
              <PortPanel />
            </aside>
          </section>
        )}

        {activeView === 'emir' && <EmirView />}
        {activeView === 'ruzgar' && <RuzgarView />}
      </div>
    </main>
  );
}
