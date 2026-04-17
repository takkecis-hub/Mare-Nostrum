'use client';

import coastlines from '../../../../../data/coastlines.json';

/* ── Satellite-style colour palette ───────────────────── */

/** Sea label positions */
const seaLabels: Array<{
  x: number;
  y: number;
  label: string;
  rotate?: number;
  size?: number;
}> = [
  { x: 180, y: 235, label: 'MARE BALEARICUM', rotate: -8, size: 9 },
  { x: 305, y: 300, label: 'MARE TYRRHENUM', rotate: 5, size: 9 },
  { x: 445, y: 350, label: 'MARE IONIUM', rotate: -3, size: 10 },
  { x: 600, y: 290, label: 'MARE AEGAEUM', rotate: -12, size: 9 },
  { x: 680, y: 380, label: 'MARE LEVANTICUM', rotate: 8, size: 9 },
];

/* ── Region label data ────────────────────────────────── */
const regionLabels: Array<{
  x: number;
  y: number;
  name: string;
  sub: string;
  color: string;
}> = [
  { x: 80, y: 110, name: 'IBERIA', sub: 'Frenk Denizi', color: '#7a9a6a' },
  { x: 300, y: 75, name: 'ITALIA', sub: 'Yarımada', color: '#8a9a6a' },
  { x: 460, y: 120, name: 'BALKANLAR', sub: 'Rum İli', color: '#6a8a5a' },
  { x: 680, y: 160, name: 'ANADOLU', sub: 'Şark', color: '#9a8a5a' },
  { x: 160, y: 370, name: 'MAĞREP', sub: 'Berber Kıyısı', color: '#8a7a4a' },
  { x: 500, y: 455, name: 'LİBYA', sub: 'Sahra', color: '#8a7a3a' },
  { x: 730, y: 430, name: 'MISIR', sub: 'Nil Deltası', color: '#7a8a4a' },
];

/**
 * Static background layer for the Mediterranean map.
 * Satellite-style relief rendering with naturalistic terrain,
 * bathymetric sea depths, mountain ridges, and coastal shading.
 */
export default function MapBackground() {
  return (
    <g className="map-background">
      {/* ══════════════════════════════════════════════════
          SVG Definitions — gradients, filters, patterns
          ══════════════════════════════════════════════════ */}
      <defs>
        {/* ── Deep ocean gradient (satellite blue) ─── */}
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#0a1e3d" />
          <stop offset="30%" stopColor="#0c2244" />
          <stop offset="60%" stopColor="#0e2a52" />
          <stop offset="100%" stopColor="#112e58" />
        </linearGradient>

        {/* ── Subtle ocean current texture ──────────── */}
        <pattern
          id="oceanTexture"
          width="80"
          height="30"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-8)"
        >
          <path
            d="M0 15 Q20 8, 40 15 Q60 22, 80 15"
            fill="none"
            stroke="#1a3a60"
            strokeWidth="0.4"
            opacity="0.3"
          />
          <path
            d="M10 5 Q30 0, 50 5 Q70 10, 90 5"
            fill="none"
            stroke="#153050"
            strokeWidth="0.3"
            opacity="0.2"
          />
        </pattern>

        {/* ── European land gradient (green/fertile) ── */}
        <linearGradient id="europeLandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a4a28" />
          <stop offset="40%" stopColor="#3a5a30" />
          <stop offset="70%" stopColor="#4a6038" />
          <stop offset="100%" stopColor="#3a5230" />
        </linearGradient>

        {/* ── Italian peninsula gradient ────────────── */}
        <linearGradient id="italyLandGrad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#3a5a30" />
          <stop offset="50%" stopColor="#4a6438" />
          <stop offset="100%" stopColor="#566a40" />
        </linearGradient>

        {/* ── Balkans gradient ──────────────────────── */}
        <linearGradient id="balkansLandGrad" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3a5830" />
          <stop offset="50%" stopColor="#4a6238" />
          <stop offset="100%" stopColor="#506840" />
        </linearGradient>

        {/* ── Turkey / Anatolia gradient (drier) ───── */}
        <linearGradient id="turkeyLandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5a30" />
          <stop offset="40%" stopColor="#5a6838" />
          <stop offset="70%" stopColor="#6a7040" />
          <stop offset="100%" stopColor="#7a7848" />
        </linearGradient>

        {/* ── Levant gradient (arid) ──────────────── */}
        <linearGradient id="levantLandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6a6a38" />
          <stop offset="50%" stopColor="#7a7840" />
          <stop offset="100%" stopColor="#8a8248" />
        </linearGradient>

        {/* ── North Africa gradient (desert/sandy) ── */}
        <linearGradient id="africaLandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5a30" />
          <stop offset="30%" stopColor="#7a7038" />
          <stop offset="60%" stopColor="#8a7a40" />
          <stop offset="100%" stopColor="#9a8848" />
        </linearGradient>

        {/* ── Island gradients ─────────────────────── */}
        <radialGradient id="sicilyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5a6a38" />
          <stop offset="100%" stopColor="#4a5a30" />
        </radialGradient>
        <radialGradient id="sardiniaGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4a5830" />
          <stop offset="100%" stopColor="#3a4a28" />
        </radialGradient>
        <radialGradient id="corsicaGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#3a5228" />
          <stop offset="100%" stopColor="#2a4220" />
        </radialGradient>
        <radialGradient id="creteGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5a6238" />
          <stop offset="100%" stopColor="#4a5430" />
        </radialGradient>
        <radialGradient id="cyprusGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#6a6a38" />
          <stop offset="100%" stopColor="#5a5a30" />
        </radialGradient>

        {/* ── Coastal shelf glow ───────────────────── */}
        <filter id="coastalGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#1a5a6a" floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Mountain shadow filter ───────────────── */}
        <filter id="mountainShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
        </filter>

        {/* ── Land edge shadow (terrain relief) ────── */}
        <filter id="landShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="2" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>

        {/* ── Inner highlight for terrain relief ───── */}
        <filter id="terrainRelief" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset dx="-2" dy="-2" in="blur" result="offsetBlur" />
          <feFlood floodColor="#ffffff" floodOpacity="0.08" result="highlight" />
          <feComposite in="highlight" in2="offsetBlur" operator="in" result="innerHighlight" />
          <feOffset dx="2" dy="2" in="blur" result="shadowOffset" />
          <feFlood floodColor="#000000" floodOpacity="0.3" result="shadow" />
          <feComposite in="shadow" in2="shadowOffset" operator="in" result="innerShadow" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innerHighlight" />
            <feMergeNode in="innerShadow" />
          </feMerge>
        </filter>

        {/* ── Vignette gradient ────────────────────── */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="70%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </radialGradient>

        {/* ── Chokepoint glow filter ───────────────── */}
        <filter id="chokeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Arrow marker for trade flows ─────────── */}
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

        {/* ── Terrain noise pattern (satellite detail) */}
        <pattern
          id="terrainNoise"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="1" height="1" x="0" y="0" fill="#000" opacity="0.03" />
          <rect width="1" height="1" x="2" y="1" fill="#fff" opacity="0.02" />
          <rect width="1" height="1" x="1" y="3" fill="#000" opacity="0.02" />
          <rect width="1" height="1" x="3" y="2" fill="#fff" opacity="0.015" />
        </pattern>

        {/* ── Depth zone gradients ─────────────────── */}
        <radialGradient id="depthWestern" cx="180" cy="230" r="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#061228" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="depthTyrrhenian" cx="330" cy="280" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#061228" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="depthIonian" cx="470" cy="345" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#061228" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="depthLevantine" cx="670" cy="380" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#061228" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ══════════════════════════════════════════════════
          Layer 1 — Ocean Base
          ══════════════════════════════════════════════════ */}
      <rect width="860" height="520" fill="url(#seaGrad)" />
      <rect width="860" height="520" fill="url(#oceanTexture)" />

      {/* ── Bathymetric depth zones ────────────────── */}
      <path d={coastlines.westernBasin} fill="#071630" opacity="0.5" />
      <path d={coastlines.tyrrhenianBasin} fill="#071630" opacity="0.45" />
      <path d={coastlines.ionianBasin} fill="#071630" opacity="0.45" />
      <path d={coastlines.levantineBasin} fill="#071630" opacity="0.4" />

      {/* Depth radial overlays */}
      <rect width="860" height="520" fill="url(#depthWestern)" />
      <rect width="860" height="520" fill="url(#depthTyrrhenian)" />
      <rect width="860" height="520" fill="url(#depthIonian)" />
      <rect width="860" height="520" fill="url(#depthLevantine)" />

      {/* ── Depth contour lines ────────────────────── */}
      <path
        d={coastlines.depthContourShallow}
        fill="none"
        stroke="#1a4a6a"
        strokeWidth="0.5"
        opacity="0.2"
      />
      <path
        d={coastlines.depthContourMid}
        fill="none"
        stroke="#153a58"
        strokeWidth="0.4"
        opacity="0.15"
      />
      <path
        d={coastlines.depthContourDeep}
        fill="none"
        stroke="#102a48"
        strokeWidth="0.3"
        opacity="0.12"
      />

      {/* ══════════════════════════════════════════════════
          Layer 2 — Continental Shelf Glow
          ══════════════════════════════════════════════════ */}
      <path
        d={coastlines.europeanShelf}
        fill="none"
        stroke="#1a6a7a"
        strokeWidth="12"
        opacity="0.08"
        strokeLinecap="round"
      />
      <path
        d={coastlines.africanShelf}
        fill="none"
        stroke="#1a6a5a"
        strokeWidth="12"
        opacity="0.07"
        strokeLinecap="round"
      />

      {/* ══════════════════════════════════════════════════
          Layer 3 — Filled Landmasses (satellite terrain)
          ══════════════════════════════════════════════════ */}

      {/* Europe + Italian Peninsula */}
      <path
        d={coastlines.europeFilledLand}
        fill="url(#europeLandGrad)"
        filter="url(#landShadow)"
      />
      <path
        d={coastlines.europeFilledLand}
        fill="url(#terrainNoise)"
        opacity="0.5"
      />

      {/* Balkans */}
      <path
        d={coastlines.balkansFilledLand}
        fill="url(#balkansLandGrad)"
        filter="url(#landShadow)"
      />
      <path
        d={coastlines.balkansFilledLand}
        fill="url(#terrainNoise)"
        opacity="0.4"
      />

      {/* Turkey (north) */}
      <path
        d={coastlines.turkeyFilledLand}
        fill="url(#turkeyLandGrad)"
        filter="url(#landShadow)"
      />
      <path
        d={coastlines.turkeyFilledLand}
        fill="url(#terrainNoise)"
        opacity="0.4"
      />

      {/* Turkey south coast */}
      <path
        d={coastlines.turkeySouthFilledLand}
        fill="url(#turkeyLandGrad)"
      />

      {/* Levant (Beyrut → Egypt) */}
      <path
        d={coastlines.levantFilledLand}
        fill="url(#levantLandGrad)"
        filter="url(#landShadow)"
      />
      <path
        d={coastlines.levantFilledLand}
        fill="url(#terrainNoise)"
        opacity="0.4"
      />

      {/* North Africa */}
      <path
        d={coastlines.northAfricaFilledLand}
        fill="url(#africaLandGrad)"
        filter="url(#landShadow)"
      />
      <path
        d={coastlines.northAfricaFilledLand}
        fill="url(#terrainNoise)"
        opacity="0.5"
      />

      {/* ══════════════════════════════════════════════════
          Layer 4 — Islands (satellite terrain fills)
          ══════════════════════════════════════════════════ */}
      <path d={coastlines.sicily} fill="url(#sicilyGrad)" stroke="#3a5a2a" strokeWidth="1.2" filter="url(#terrainRelief)" />
      <path d={coastlines.sardinia} fill="url(#sardiniaGrad)" stroke="#3a5228" strokeWidth="1" filter="url(#terrainRelief)" />
      <path d={coastlines.corsica} fill="url(#corsicaGrad)" stroke="#2a4a20" strokeWidth="1" filter="url(#terrainRelief)" />
      <path d={coastlines.crete} fill="url(#creteGrad)" stroke="#4a5a30" strokeWidth="1" filter="url(#terrainRelief)" />
      <path d={coastlines.cyprus} fill="url(#cyprusGrad)" stroke="#5a5a30" strokeWidth="1" filter="url(#terrainRelief)" />

      {/* ══════════════════════════════════════════════════
          Layer 5 — Coastline Strokes (crisp edges)
          ══════════════════════════════════════════════════ */}
      <path d={coastlines.europeanCoast} fill="none" stroke="#1a5a4a" strokeWidth="1.8" opacity="0.7" />
      <path d={coastlines.italianEastCoast} fill="none" stroke="#1a5a4a" strokeWidth="1.8" opacity="0.7" />
      <path d={coastlines.balkanCoast} fill="none" stroke="#1a5848" strokeWidth="1.2" opacity="0.6" />
      <path d={coastlines.turkeyWestCoast} fill="none" stroke="#3a5a38" strokeWidth="1.2" opacity="0.6" />
      <path d={coastlines.turkeySouthCoast} fill="none" stroke="#3a5a38" strokeWidth="1.2" opacity="0.55" />
      <path d={coastlines.levantCoast} fill="none" stroke="#4a5a38" strokeWidth="1.2" opacity="0.6" />
      <path d={coastlines.northAfricaCoast} fill="none" stroke="#4a4a28" strokeWidth="1.8" opacity="0.65" />

      {/* Thin light coastal highlight (sunlit edge) */}
      <path d={coastlines.europeanCoast} fill="none" stroke="#5a9a7a" strokeWidth="0.6" opacity="0.25" />
      <path d={coastlines.italianEastCoast} fill="none" stroke="#5a9a7a" strokeWidth="0.6" opacity="0.25" />
      <path d={coastlines.northAfricaCoast} fill="none" stroke="#7a8a58" strokeWidth="0.5" opacity="0.2" />

      {/* ══════════════════════════════════════════════════
          Layer 6 — Mountain Ridges (relief shading)
          ══════════════════════════════════════════════════ */}
      <g className="mountain-ridges" opacity="0.7">
        {/* Alps */}
        <path d={coastlines.alpsRidge} fill="none" stroke="#6a8a58" strokeWidth="2.5" opacity="0.4" />
        <path d={coastlines.alpsRidge} fill="none" stroke="#8aaa70" strokeWidth="1" opacity="0.3" />
        <path d={coastlines.alpsPeaks} fill="none" stroke="#9aba80" strokeWidth="1.2" opacity="0.35" filter="url(#mountainShadow)" />
        {/* Snow caps hint */}
        <path d={coastlines.alpsPeaks} fill="none" stroke="#c8d8b8" strokeWidth="0.5" opacity="0.25" />

        {/* Apennines */}
        <path d={coastlines.apenninesRidge} fill="none" stroke="#5a7a48" strokeWidth="2" opacity="0.35" />
        <path d={coastlines.apenninesRidge} fill="none" stroke="#7a9a60" strokeWidth="0.8" opacity="0.25" />

        {/* Atlas Mountains (North Africa) */}
        <path d={coastlines.atlasRidge} fill="none" stroke="#6a6a38" strokeWidth="2.5" opacity="0.4" />
        <path d={coastlines.atlasPeaks} fill="none" stroke="#8a8a50" strokeWidth="1.2" opacity="0.35" filter="url(#mountainShadow)" />

        {/* Anatolian Highlands */}
        <path d={coastlines.anatolianRidge} fill="none" stroke="#7a7a40" strokeWidth="2.5" opacity="0.4" />
        <path d={coastlines.anatolianPeaks} fill="none" stroke="#9a9a58" strokeWidth="1.2" opacity="0.35" filter="url(#mountainShadow)" />

        {/* Lebanon Mountains */}
        <path d={coastlines.lebanonRidge} fill="none" stroke="#6a6a38" strokeWidth="2" opacity="0.4" />
        <path d={coastlines.lebanonPeaks} fill="none" stroke="#8a8a50" strokeWidth="1" opacity="0.35" filter="url(#mountainShadow)" />
      </g>

      {/* ══════════════════════════════════════════════════
          Layer 7 — Sea Labels (classical names)
          ══════════════════════════════════════════════════ */}
      {seaLabels.map((s) => (
        <text
          key={s.label}
          x={s.x}
          y={s.y}
          fontFamily="Georgia, serif"
          fontSize={s.size ?? 9}
          fill="#4a7a9a"
          opacity="0.25"
          fontStyle="italic"
          letterSpacing="3"
          transform={s.rotate ? `rotate(${s.rotate} ${s.x} ${s.y})` : undefined}
        >
          {s.label}
        </text>
      ))}

      {/* ══════════════════════════════════════════════════
          Layer 8 — Region Labels (on land)
          ══════════════════════════════════════════════════ */}
      {regionLabels.map((r) => (
        <g key={r.name}>
          <text
            x={r.x}
            y={r.y}
            fontFamily="Georgia, serif"
            fontSize="11"
            fill={r.color}
            opacity="0.5"
            fontStyle="italic"
            letterSpacing="3"
          >
            {r.name}
          </text>
          <text
            x={r.x}
            y={r.y + 13}
            fontFamily="Georgia, serif"
            fontSize="8"
            fill={r.color}
            opacity="0.35"
            fontStyle="italic"
            letterSpacing="1.5"
          >
            {r.sub}
          </text>
        </g>
      ))}

      {/* ══════════════════════════════════════════════════
          Layer 9 — Latitude/Longitude Grid (very subtle)
          ══════════════════════════════════════════════════ */}
      <g className="lat-lon-grid" opacity="0.06">
        {/* Latitude lines (approximate) */}
        <line x1="0" y1="80" x2="860" y2="80" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="0" y1="180" x2="860" y2="180" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="0" y1="280" x2="860" y2="280" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="0" y1="380" x2="860" y2="380" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="0" y1="480" x2="860" y2="480" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />

        {/* Longitude lines (approximate) */}
        <line x1="100" y1="0" x2="100" y2="520" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="250" y1="0" x2="250" y2="520" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="400" y1="0" x2="400" y2="520" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="550" y1="0" x2="550" y2="520" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="700" y1="0" x2="700" y2="520" stroke="#5a8aaa" strokeWidth="0.5" strokeDasharray="4 8" />
      </g>

      {/* ══════════════════════════════════════════════════
          Layer 10 — Atmospheric Vignette
          ══════════════════════════════════════════════════ */}
      <rect width="860" height="520" fill="url(#vignette)" />
    </g>
  );
}
