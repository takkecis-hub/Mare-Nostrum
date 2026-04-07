'use client';

import coastlines from '../../../../../data/coastlines.json';

/* ── Colour constants ─────────────────────────────────── */
const COAST_STROKE = '#2a4a3a';
const COAST_LAND = '#1a2a3a';
const ISLAND_FILL = '#131f2e';

/* ── Region label data ────────────────────────────────── */
const regionLabels: Array<{
  x: number;
  y: number;
  name: string;
  sub: string;
  color: string;
}> = [
  { x: 110, y: 140, name: 'BATI', sub: 'Frenk Denizi', color: '#4a7a9a' },
  { x: 370, y: 170, name: 'ORTA', sub: 'Ara Deniz', color: '#6a4a8a' },
  { x: 640, y: 145, name: 'DOGU', sub: 'Şark Denizi', color: '#8a4a4a' },
  { x: 340, y: 460, name: 'GÜNEY', sub: 'Berber Kıyısı', color: '#8a7a3a' },
];

/**
 * Static background layer for the Mediterranean map.
 * Renders: sea gradient, wave texture, region overlays, coastlines,
 * island shapes, and region labels.
 */
export default function MapBackground() {
  return (
    <g className="map-background">
      {/* ── SVG Definitions ──────────────────────────── */}
      <defs>
        {/* Deep sea gradient */}
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="50%" stopColor="#0f2240" />
          <stop offset="100%" stopColor="#162d50" />
        </linearGradient>

        {/* Wave texture */}
        <pattern
          id="waves"
          width="60"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-5)"
        >
          <path
            d="M0 10 Q15 5, 30 10 Q45 15, 60 10"
            fill="none"
            stroke="#1a3050"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </pattern>

        {/* Region overlays */}
        <radialGradient
          id="regionBati"
          cx="130"
          cy="200"
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="regionOrta"
          cx="400"
          cy="240"
          r="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2d1f4e" stopOpacity="0.30" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="regionDogu"
          cx="680"
          cy="280"
          r="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4a1c1c" stopOpacity="0.30" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="regionGuney"
          cx="400"
          cy="420"
          r="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3d3516" stopOpacity="0.30" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Chokepoint glow filter */}
        <filter id="chokeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Arrow marker for trade flows */}
        <marker
          id="arrowEnd"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#c8a96e" opacity="0.6" />
        </marker>
      </defs>

      {/* ── Sea background ───────────────────────────── */}
      <rect width="860" height="520" fill="url(#seaGrad)" />
      <rect width="860" height="520" fill="url(#waves)" />

      {/* ── Region colour overlays ────────────────────── */}
      <rect width="860" height="520" fill="url(#regionBati)" />
      <rect width="860" height="520" fill="url(#regionOrta)" />
      <rect width="860" height="520" fill="url(#regionDogu)" />
      <rect width="860" height="520" fill="url(#regionGuney)" />

      {/* ── Coastline paths ──────────────────────────── */}
      {/* Continental coastlines */}
      <path
        d={coastlines.europeanCoast}
        fill="none"
        stroke={COAST_STROKE}
        strokeWidth="1.5"
        opacity="0.5"
        strokeDasharray="3 2"
      />
      <path
        d={coastlines.italianEastCoast}
        fill="none"
        stroke={COAST_STROKE}
        strokeWidth="1.5"
        opacity="0.5"
        strokeDasharray="3 2"
      />
      <path
        d={coastlines.balkanCoast}
        fill="none"
        stroke={COAST_STROKE}
        strokeWidth="1"
        opacity="0.4"
        strokeDasharray="2 3"
      />
      <path
        d={coastlines.turkeyWestCoast}
        fill="none"
        stroke={COAST_STROKE}
        strokeWidth="1"
        opacity="0.4"
        strokeDasharray="2 3"
      />
      <path
        d={coastlines.turkeySouthCoast}
        fill="none"
        stroke={COAST_STROKE}
        strokeWidth="1"
        opacity="0.35"
        strokeDasharray="2 3"
      />
      <path
        d={coastlines.levantCoast}
        fill="none"
        stroke={COAST_STROKE}
        strokeWidth="1"
        opacity="0.4"
        strokeDasharray="2 3"
      />
      <path
        d={coastlines.northAfricaCoast}
        fill="none"
        stroke="#3a3520"
        strokeWidth="1.5"
        opacity="0.5"
        strokeDasharray="3 2"
      />

      {/* ── Island shapes (filled, very subtle) ────── */}
      <path d={coastlines.sicily} fill={ISLAND_FILL} stroke={COAST_STROKE} strokeWidth="1" opacity="0.5" />
      <path d={coastlines.sardinia} fill={ISLAND_FILL} stroke={COAST_STROKE} strokeWidth="0.8" opacity="0.4" />
      <path d={coastlines.corsica} fill={ISLAND_FILL} stroke={COAST_STROKE} strokeWidth="0.8" opacity="0.4" />
      <path d={coastlines.crete} fill={ISLAND_FILL} stroke={COAST_STROKE} strokeWidth="0.8" opacity="0.45" />
      <path d={coastlines.cyprus} fill={ISLAND_FILL} stroke={COAST_STROKE} strokeWidth="0.8" opacity="0.45" />

      {/* ── Region labels ────────────────────────────── */}
      {regionLabels.map((r) => (
        <g key={r.name}>
          <text
            x={r.x}
            y={r.y}
            fontFamily="Georgia, serif"
            fontSize="13"
            fill={r.color}
            opacity="0.45"
            fontStyle="italic"
            letterSpacing="4"
          >
            {r.name}
          </text>
          <text
            x={r.x - 14}
            y={r.y + 15}
            fontFamily="Georgia, serif"
            fontSize="9"
            fill={r.color}
            opacity="0.35"
            fontStyle="italic"
            letterSpacing="2"
          >
            {r.sub}
          </text>
        </g>
      ))}
    </g>
  );
}
