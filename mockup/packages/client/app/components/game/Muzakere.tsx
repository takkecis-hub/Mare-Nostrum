'use client';

import { useState } from 'react';
import Badge from '../ui/Badge';

export default function Muzakere() {
  const [activeTab, setActiveTab] = useState<'genel' | 'ozel'>('genel');

  return (
    <div className="muzakere-panel">
      {/* ── Ornamental header ──────────────────────── */}
      <div className="section-head" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 6px var(--purple-glow))' }}>🤝</span>
          <div>
            <h2 className="muzakere-title" style={{ marginBottom: 2 }}>Müzakere</h2>
            <p className="muzakere-subtitle">Diplomatik görüşmeler · NPC diyalogları</p>
          </div>
        </div>
        <Badge label="🪶 Mürekkep" variant="purple" />
      </div>

      {/* ── Diplomatic reputation bar ─────────────── */}
      <div className="muzakere-rep-bar">
        <span className="muzakere-rep-icon">⚖️</span>
        <div className="muzakere-rep-info">
          <div className="muzakere-rep-label">Diplomatik İtibar</div>
          <div className="muzakere-rep-dots">
            {[1,2,3,4,5].map((i) => (
              <span key={i} className={`muzakere-rep-dot ${i <= 2 ? 'filled' : ''}`} aria-hidden="true" />
            ))}
          </div>
        </div>
        <Badge label="Acemi Elçi" variant="purple" />
      </div>

      {/* ── Court / chat area ─────────────────────── */}
      <div className="muzakere-court">
        <div className="muzakere-tabs">
          <button
            className={`muzakere-tab ${activeTab === 'genel' ? 'active' : ''}`}
            onClick={() => setActiveTab('genel')}
          >
            🏛️ Genel
          </button>
          <button
            className={`muzakere-tab ${activeTab === 'ozel' ? 'active' : ''}`}
            onClick={() => setActiveTab('ozel')}
          >
            📜 Özel Mesaj
          </button>
        </div>
        <div className="muzakere-body">
          <p className="muzakere-system-msg">
            Müzakere sistemi çok oyunculu modda aktif olacak.
          </p>
          <p className="muzakere-system-msg">
            Tek oyunculu modda NPC diyalogları burada görünecek.
          </p>
        </div>
        <div className="muzakere-input-row">
          <input
            className="muzakere-input"
            type="text"
            placeholder="Mesaj yaz..."
            disabled
            aria-label="Diplomatik mesaj giriş alanı"
          />
          <button className="muzakere-send-btn" disabled>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
