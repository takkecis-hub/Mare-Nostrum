'use client';

import { useUIStore, type FondacoTab } from '../../stores/useUIStore';
import Kahvehane from './Kahvehane';
import Pazar from './Pazar';
import Muzakere from './Muzakere';
import Tersane from './Tersane';

const TABS: { key: FondacoTab; label: string; icon: string }[] = [
  { key: 'kahvehane', label: 'Kahvehane', icon: '☕' },
  { key: 'pazar', label: 'Pazar', icon: '🏪' },
  { key: 'muzakere', label: 'Müzakere', icon: '🤝' },
  { key: 'tersane', label: 'Tersane', icon: '⚓' },
];

const TAB_COMPONENTS: Record<FondacoTab, React.ComponentType> = {
  kahvehane: Kahvehane,
  pazar: Pazar,
  muzakere: Muzakere,
  tersane: Tersane,
};

export default function FondacoView() {
  const activeTab = useUIStore((s) => s.fondacoTab);
  const setTab = useUIStore((s) => s.setFondacoTab);

  const ActivePanel = TAB_COMPONENTS[activeTab];

  return (
    <div className="fondaco-view card">
      <nav className="fondaco-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            data-tab={tab.key}
            className={`fondaco-tab ${activeTab === tab.key ? 'fondaco-tab-active' : ''}`}
            onClick={() => setTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="fondaco-content" role="tabpanel">
        <ActivePanel />
      </div>
    </div>
  );
}
