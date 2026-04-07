'use client';

import { useMemo, useState, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUIStore } from '../../stores/useUIStore';
import type { RouteType, GoodCategory, Port, Route } from '../../../../shared/src/types/index.js';
import MapBackground from './MapBackground';

/* ════════════════════════════════════════════════════════
   Constants
   ════════════════════════════════════════════════════════ */

const routeColors: Record<RouteType, string> = {
  tramontana: '#7dd3fc',
  kabotaj: '#86efac',
  fortuna: '#fda4af',
  uzun_kabotaj: '#c4b5fd',
};

const categoryColors: Record<GoodCategory, string> = {
  luks: '#f1c40f',
  yemek: '#2ecc71',
  savas: '#e74c3c',
};

/** Ports that get a "major hub" treatment */
const MAJOR_PORTS = new Set(['istanbul', 'iskenderiye', 'venedik']);

/** Chokepoint display names */
const chokepointLabels: Record<string, string> = {
  sicilya: 'SİCİLYA',
  ege: 'EGE',
  otranto: 'OTRANTO',
};

/* ════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════ */

function routeDasharray(routeType: RouteType) {
  if (routeType === 'kabotaj') return '6 6';
  if (routeType === 'uzun_kabotaj') return '12 6';
  return undefined;
}

/** Compute a quadratic bezier control point offset perpendicular to the midpoint. */
function curveControlPoint(
  x1: number, y1: number,
  x2: number, y2: number,
  offset: number,
): { cx: number; cy: number } {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { cx: mx, cy: my };
  // Perpendicular unit vector
  const px = -dy / len;
  const py = dx / len;
  return { cx: mx + px * offset, cy: my + py * offset };
}

/** Route path — curved for long routes, straight for short ones. */
function routePath(from: Port, to: Port, route: Route): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Curves for long-distance routes (>250px) or specific scenic routes
  if (dist > 250 || route.type === 'uzun_kabotaj') {
    const curvature = dist * 0.12;
    const { cx, cy } = curveControlPoint(from.x, from.y, to.x, to.y, curvature);
    return `M ${from.x},${from.y} Q ${Math.round(cx)},${Math.round(cy)} ${to.x},${to.y}`;
  }
  return `M ${from.x},${from.y} L ${to.x},${to.y}`;
}

/* ════════════════════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════════════════════ */

function RouteLegend() {
  return (
    <g transform="translate(16, 12)">
      <rect x="0" y="0" width="192" height="122" rx="6" fill="#0a1628" stroke="#2a3a4a" strokeWidth="1" opacity="0.9" />
      <text x="12" y="20" fontFamily="Georgia, serif" fontSize="12" fill="#c8a96e" fontWeight="bold" letterSpacing="1">MARE NOSTRUM</text>
      <text x="12" y="33" fontFamily="Georgia, serif" fontSize="8" fill="#8899aa" fontStyle="italic">Akdeniz Ticaret Haritası</text>

      <line x1="12" y1="48" x2="40" y2="48" stroke="#7dd3fc" strokeWidth="2.5" />
      <text x="46" y="52" fontFamily="monospace" fontSize="9" fill="#7dd3fc">Tramontana (1 tur)</text>

      <line x1="12" y1="63" x2="40" y2="63" stroke="#86efac" strokeWidth="2.5" strokeDasharray="6 6" />
      <text x="46" y="67" fontFamily="monospace" fontSize="9" fill="#86efac">Kabotaj (2 tur)</text>

      <line x1="12" y1="78" x2="40" y2="78" stroke="#fda4af" strokeWidth="2.5" />
      <text x="46" y="82" fontFamily="monospace" fontSize="9" fill="#fda4af">Fortuna (1 tur, riskli)</text>

      <line x1="12" y1="93" x2="40" y2="93" stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray="12 6" />
      <text x="46" y="97" fontFamily="monospace" fontSize="9" fill="#c4b5fd">Uzun Kabotaj (3 tur)</text>

      <line x1="12" y1="110" x2="40" y2="110" stroke="#ffcc44" strokeWidth="3.5" />
      <text x="46" y="114" fontFamily="monospace" fontSize="9" fill="#ffcc44">Darboğaz (%70-80)</text>
    </g>
  );
}

function GoodCategoryLegend() {
  return (
    <g transform="translate(660, 12)">
      <rect x="0" y="0" width="184" height="82" rx="6" fill="#0a1628" stroke="#2a3a4a" strokeWidth="1" opacity="0.9" />
      <text x="12" y="20" fontFamily="Georgia, serif" fontSize="11" fill="#c8a96e" fontWeight="bold" letterSpacing="1">MAL TÜRLERİ</text>

      <circle cx="20" cy="38" r="5" fill="#0f172a" stroke="#f1c40f" strokeWidth="2" />
      <text x="32" y="42" fontFamily="monospace" fontSize="9" fill="#f1c40f">Lüks (ipek, baharat, cam)</text>

      <circle cx="20" cy="55" r="5" fill="#0f172a" stroke="#2ecc71" strokeWidth="2" />
      <text x="32" y="59" fontFamily="monospace" fontSize="9" fill="#2ecc71">Yemek (buğday, zeytinyağı)</text>

      <circle cx="20" cy="72" r="5" fill="#0f172a" stroke="#e74c3c" strokeWidth="2" />
      <text x="32" y="76" fontFamily="monospace" fontSize="9" fill="#e74c3c">Savaş (demir, silah, çelik)</text>
    </g>
  );
}

function CompassRose() {
  return (
    <g transform="translate(810, 480)" opacity="0.4">
      <circle cx="0" cy="0" r="20" fill="none" stroke="#c8a96e" strokeWidth="0.5" />
      <line x1="0" y1="-18" x2="0" y2="-8" stroke="#c8a96e" strokeWidth="1.5" />
      <polygon points="0,-20 -3,-14 3,-14" fill="#c8a96e" />
      <text x="0" y="-22" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fill="#c8a96e" fontWeight="bold">K</text>
      <line x1="0" y1="18" x2="0" y2="8" stroke="#c8a96e" strokeWidth="0.8" />
      <line x1="18" y1="0" x2="8" y2="0" stroke="#c8a96e" strokeWidth="0.8" />
      <line x1="-18" y1="0" x2="-8" y2="0" stroke="#c8a96e" strokeWidth="0.8" />
      <line x1="12" y1="-12" x2="6" y2="-6" stroke="#c8a96e" strokeWidth="0.4" />
      <line x1="-12" y1="-12" x2="-6" y2="-6" stroke="#c8a96e" strokeWidth="0.4" />
      <line x1="12" y1="12" x2="6" y2="6" stroke="#c8a96e" strokeWidth="0.4" />
      <line x1="-12" y1="12" x2="-6" y2="6" stroke="#c8a96e" strokeWidth="0.4" />
    </g>
  );
}

function TradeFlowArrows() {
  return (
    <g className="trade-flows">
      {/* East→West luxury flow */}
      <path
        d="M 700,430 Q 620,380 550,330 Q 460,270 370,200 Q 300,160 200,120"
        fill="none"
        stroke="#f1c40f"
        strokeWidth="1"
        opacity="0.15"
        strokeDasharray="3 6"
        markerEnd="url(#arrowEnd)"
      />
      <text
        x="400"
        y="210"
        fontFamily="Georgia, serif"
        fontSize="7"
        fill="#f1c40f"
        opacity="0.3"
        fontStyle="italic"
        transform="rotate(-15 400 210)"
      >
        Lüks akışı →
      </text>

      {/* West→East war goods flow */}
      <path
        d="M 120,190 Q 200,230 300,280 Q 430,310 560,330 Q 620,310 670,250"
        fill="none"
        stroke="#e74c3c"
        strokeWidth="1"
        opacity="0.12"
        strokeDasharray="3 6"
        markerEnd="url(#arrowEnd)"
      />
      <text
        x="420"
        y="320"
        fontFamily="Georgia, serif"
        fontSize="7"
        fill="#e74c3c"
        opacity="0.25"
        fontStyle="italic"
        transform="rotate(5 420 320)"
      >
        ← Savaş akışı
      </text>
    </g>
  );
}

function StatsBar() {
  return (
    <g transform="translate(230, 508)">
      <text fontFamily="Georgia, serif" fontSize="9" fill="#5a6a7a" fontStyle="italic">
        15 Liman · 28 Rota · 3 Darboğaz · 4 Bölge · 15 Mal · 11.–18. Yüzyıl
      </text>
    </g>
  );
}

/* ════════════════════════════════════════════════════════
   Tooltip
   ════════════════════════════════════════════════════════ */

interface TooltipProps {
  port: Port;
  x: number;
  y: number;
}

function PortTooltip({ port, x, y }: TooltipProps) {
  const tx = x > 680 ? x - 160 : x + 18;
  const ty = y > 420 ? y - 80 : y < 60 ? y + 10 : y - 60;
  return (
    <g className="port-tooltip" pointerEvents="none">
      <rect
        x={tx}
        y={ty}
        width="155"
        height="72"
        rx="6"
        fill="#0a1628"
        stroke="#3a4a5a"
        strokeWidth="1"
        opacity="0.95"
      />
      <text x={tx + 8} y={ty + 16} fontFamily="Georgia, serif" fontSize="11" fill="#e2e8f0" fontWeight="bold">
        {port.displayName}
      </text>
      <text x={tx + 8} y={ty + 30} fontFamily="monospace" fontSize="8" fill="#8899aa">
        {port.name} · {port.controller}
      </text>
      <text x={tx + 8} y={ty + 44} fontFamily="monospace" fontSize="8" fill={categoryColors[port.produces.category]}>
        ↑ {port.produces.good.replace(/_/g, ' ')}
      </text>
      <text x={tx + 8} y={ty + 58} fontFamily="monospace" fontSize="8" fill={categoryColors[port.desires.category]}>
        ↓ {port.desires.good.replace(/_/g, ' ')}
      </text>
    </g>
  );
}

/* ════════════════════════════════════════════════════════
   Main MapView
   ════════════════════════════════════════════════════════ */

interface MapViewProps {
  /** When true, ports are clickable and selecting sets order destination */
  interactive?: boolean;
  /** When provided, only highlight ports reachable from current position */
  highlightReachable?: boolean;
  onPortClick?: (portId: string) => void;
}

export default function MapView({
  interactive = true,
  highlightReachable = false,
  onPortClick,
}: MapViewProps) {
  const ports = useGameStore((s) => s.ports);
  const routes = useGameStore((s) => s.routes);
  const gameState = useGameStore((s) => s.gameState);
  const selectedPortId = useUIStore((s) => s.selectedPortId);
  const setSelectedPortId = useUIStore((s) => s.setSelectedPortId);

  const [hoveredPortId, setHoveredPortId] = useState<string | null>(null);

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

  /** Route IDs connected to the hovered port (for dimming) */
  const hoveredRouteSet = useMemo(() => {
    if (!hoveredPortId) return new Set<string>();
    const ids = new Set<string>();
    for (const route of routes) {
      if (route.from === hoveredPortId || route.to === hoveredPortId) {
        ids.add(route.id);
      }
    }
    return ids;
  }, [hoveredPortId, routes]);

  /** Deduped chokepoint labels with midpoint positions */
  const chokepointPositions = useMemo(() => {
    const seen = new Map<string, { mx: number; my: number }>();
    for (const route of routes) {
      if (!route.isChokepoint || seen.has(route.isChokepoint)) continue;
      const from = ports.find((p) => p.id === route.from);
      const to = ports.find((p) => p.id === route.to);
      if (!from || !to) continue;
      seen.set(route.isChokepoint, {
        mx: Math.round((from.x + to.x) / 2),
        my: Math.round((from.y + to.y) / 2),
      });
    }
    return seen;
  }, [routes, ports]);

  const handlePortClick = useCallback(
    (portId: string) => {
      if (!interactive) return;
      setSelectedPortId(portId);
      onPortClick?.(portId);
    },
    [interactive, setSelectedPortId, onPortClick],
  );

  const hoveredPort = hoveredPortId
    ? ports.find((p) => p.id === hoveredPortId) ?? null
    : null;

  return (
    <svg viewBox="0 0 860 520" className="map" role="img" aria-label="Akdeniz haritası">
      {/* ── Background layer ──────────────────────────── */}
      <MapBackground />

      {/* ── Trade flow arrows (behind routes) ─────────── */}
      <TradeFlowArrows />

      {/* ── Route lines ───────────────────────────────── */}
      {routes.map((route) => {
        const from = ports.find((p) => p.id === route.from);
        const to = ports.find((p) => p.id === route.to);
        if (!from || !to) return null;

        const d = routePath(from, to, route);
        const isHoverDimmed = hoveredPortId !== null && !hoveredRouteSet.has(route.id);

        if (route.isChokepoint) {
          return (
            <g key={route.id}>
              {/* Gold glow underlay */}
              <path
                d={d}
                fill="none"
                stroke="#ffcc44"
                strokeWidth={6}
                opacity={isHoverDimmed ? 0.05 : 0.25}
                filter="url(#chokeGlow)"
              />
              {/* Main route */}
              <path
                d={d}
                fill="none"
                stroke={routeColors[route.type]}
                strokeWidth={3.5}
                strokeDasharray={routeDasharray(route.type)}
                opacity={isHoverDimmed ? 0.15 : 0.8}
              />
            </g>
          );
        }

        return (
          <path
            key={route.id}
            d={d}
            fill="none"
            stroke={routeColors[route.type]}
            strokeWidth={2.5}
            strokeDasharray={routeDasharray(route.type)}
            opacity={isHoverDimmed ? 0.12 : 0.55}
          />
        );
      })}

      {/* ── Chokepoint labels ─────────────────────────── */}
      {[...chokepointPositions.entries()].map(([key, { mx, my }]) => {
        const label = chokepointLabels[key] ?? key.toUpperCase();
        const w = label.length * 8 + 16;
        return (
          <g key={`choke-${key}`} transform={`translate(${mx}, ${my})`}>
            <rect x={-w / 2} y="-9" width={w} height="18" rx="4" fill="#ffcc44" opacity="0.15" />
            <text
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="9"
              fill="#ffcc44"
              opacity="0.8"
              fontWeight="bold"
              letterSpacing="1"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* ── Port nodes ────────────────────────────────── */}
      {ports.map((port) => {
        const isCurrent = currentPortId === port.id;
        const isSelected = selectedPortId === port.id;
        const isReachable =
          reachablePortIds.size === 0 || reachablePortIds.has(port.id) || isCurrent;
        const dimmed = highlightReachable && !isReachable;
        const isMajor = MAJOR_PORTS.has(port.id);
        const catColor = categoryColors[port.produces.category];
        const baseR = isMajor ? 14 : 10;
        const r = isCurrent ? baseR + 2 : baseR;

        return (
          <g
            key={port.id}
            onClick={() => handlePortClick(port.id)}
            onMouseEnter={() => setHoveredPortId(port.id)}
            onMouseLeave={() => setHoveredPortId(null)}
            className={interactive ? 'port-node' : ''}
            opacity={dimmed ? 0.3 : 1}
          >
            {/* Major port pulsing outer ring */}
            {isMajor && !isCurrent && (() => {
              const rVals = `${baseR + 6};${baseR + 11};${baseR + 6}`;
              return (
                <circle
                  cx={port.x}
                  cy={port.y}
                  r={baseR + 8}
                  fill="none"
                  stroke={catColor}
                  strokeWidth={1}
                  opacity={0.15}
                >
                  <animate attributeName="r" values={rVals} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0.06;0.15" dur="3s" repeatCount="indefinite" />
                </circle>
              );
            })()}

            {/* Current port glow */}
            {isCurrent && (() => {
              const rVals = `${r + 6};${r + 12};${r + 6}`;
              return (
                <circle
                  cx={port.x}
                  cy={port.y}
                  r={r + 8}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  opacity={0.4}
                >
                  <animate attributeName="r" values={rVals} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              );
            })()}

            {/* Inner glow */}
            <circle cx={port.x} cy={port.y} r={r * 0.5} fill={catColor} opacity={0.35} />

            {/* Main circle */}
            <circle
              cx={port.x}
              cy={port.y}
              r={r}
              fill={isSelected ? '#facc15' : isCurrent ? 'var(--accent)' : '#0f172a'}
              stroke={isCurrent ? 'var(--accent)' : catColor}
              strokeWidth={isMajor ? 3 : 2.5}
            />

            {/* Port name label */}
            <text
              x={port.x}
              y={port.y - r - 4}
              textAnchor="middle"
              className="map-label"
              fontWeight="bold"
              fontSize={isMajor ? '12' : '11'}
            >
              {port.name}
            </text>

            {/* Controller sub-label */}
            <text
              x={port.x}
              y={port.y - r - 16}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="8"
              fill={catColor}
              opacity="0.7"
            >
              {port.displayName}
            </text>
          </g>
        );
      })}

      {/* ── Tooltip ────────────────────────────────────── */}
      {hoveredPort && (
        <PortTooltip port={hoveredPort} x={hoveredPort.x} y={hoveredPort.y} />
      )}

      {/* ── Legends & decorations ─────────────────────── */}
      <RouteLegend />
      <GoodCategoryLegend />
      <CompassRose />
      <StatsBar />
    </svg>
  );
}
