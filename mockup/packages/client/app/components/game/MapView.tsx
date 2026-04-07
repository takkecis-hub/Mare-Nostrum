'use client';

import { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';
import type { RouteType } from '../../../../shared/src/types/index.js';

const routeColors: Record<RouteType, string> = {
  tramontana: '#7dd3fc',
  kabotaj: '#86efac',
  fortuna: '#fda4af',
  uzun_kabotaj: '#c4b5fd',
};

function routeDasharray(routeType: RouteType) {
  if (routeType === 'kabotaj') return '6 6';
  if (routeType === 'uzun_kabotaj') return '12 6';
  return undefined;
}

interface MapViewProps {
  /** When true, ports are clickable and selecting sets order destination */
  interactive?: boolean;
  /** When provided, only highlight ports reachable from current position */
  highlightReachable?: boolean;
  onPortClick?: (portId: string) => void;
}

export default function MapView({ interactive = true, highlightReachable = false, onPortClick }: MapViewProps) {
  const ports = useGameStore((s) => s.ports);
  const routes = useGameStore((s) => s.routes);
  const gameState = useGameStore((s) => s.gameState);
  const selectedPortId = useUIStore((s) => s.selectedPortId);
  const setSelectedPortId = useUIStore((s) => s.setSelectedPortId);

  const currentPortId = gameState?.player.currentPortId;

  const reachablePortIds = useMemo(() => {
    if (!highlightReachable || !currentPortId) return new Set<string>();
    const ids = new Set<string>();
    for (const route of routes) {
      if (route.from === currentPortId) ids.add(route.to);
      if (route.to === currentPortId) ids.add(route.from);
    }
    return ids;
  }, [highlightReachable, currentPortId, routes]);

  function handlePortClick(portId: string) {
    if (!interactive) return;
    setSelectedPortId(portId);
    onPortClick?.(portId);
  }

  return (
    <svg viewBox="0 0 860 520" className="map" role="img" aria-label="Akdeniz haritası">
      {/* Route lines */}
      {routes.map((route) => {
        const from = ports.find((p) => p.id === route.from);
        const to = ports.find((p) => p.id === route.to);
        if (!from || !to) return null;
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
            opacity={0.7}
          />
        );
      })}

      {/* Port nodes */}
      {ports.map((port) => {
        const isCurrent = currentPortId === port.id;
        const isSelected = selectedPortId === port.id;
        const isReachable = reachablePortIds.size === 0 || reachablePortIds.has(port.id) || isCurrent;
        const dimmed = highlightReachable && !isReachable;

        return (
          <g
            key={port.id}
            onClick={() => handlePortClick(port.id)}
            className={interactive ? 'port-node' : ''}
            opacity={dimmed ? 0.3 : 1}
          >
            {/* Current port glow */}
            {isCurrent && (
              <circle cx={port.x} cy={port.y} r={20} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={0.4}>
                <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={port.x}
              cy={port.y}
              r={isCurrent ? 14 : 10}
              fill={isSelected ? '#facc15' : isCurrent ? 'var(--accent)' : '#0f172a'}
              stroke={isCurrent ? 'var(--accent)' : '#e2e8f0'}
              strokeWidth={2}
            />
            <text x={port.x + 14} y={port.y - 14} className="map-label">{port.name}</text>
          </g>
        );
      })}
    </svg>
  );
}
