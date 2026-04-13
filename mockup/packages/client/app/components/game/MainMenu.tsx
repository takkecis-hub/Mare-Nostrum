'use client';

import { useUIStore } from '../../stores/useUIStore';

export default function MainMenu() {
  const setActiveView = useUIStore((s) => s.setActiveView);

  return (
    <div className="main-menu">
      <div className="menu-backdrop" />
      <div className="menu-content">
        <div className="menu-logo">
          <p className="menu-era">XI — XVIII. Yüzyıl</p>
          <h1 className="menu-title">Mare Nostrum</h1>
          <p className="menu-subtitle">Akdeniz&apos;in Efendisi</p>
        </div>

        <nav className="menu-buttons">
          <button className="menu-btn primary" onClick={() => setActiveView('fondaco')}>
            Yeni Oyun
          </button>
          <button className="menu-btn" disabled>
            Devam Et
          </button>
          <button className="menu-btn" disabled>
            Ayarlar
          </button>
          <button className="menu-btn" disabled>
            Hakkında
          </button>
        </nav>

        <div className="menu-footer">
          <span className="muted">Implementation Plan v2 — Dikey Kesit</span>
        </div>
      </div>
    </div>
  );
}
