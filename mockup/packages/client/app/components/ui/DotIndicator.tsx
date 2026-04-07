'use client';

/**
 * Renders a 5-dot indicator: ●●●○○
 * value: 1–5 (clamped)
 * Colour follows green → yellow → red gradient.
 */
interface DotIndicatorProps {
  value: number;
  /** Maximum dots (default 5) */
  max?: number;
}

const DOT_COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

export default function DotIndicator({ value, max = 5 }: DotIndicatorProps) {
  const clamped = Math.max(1, Math.min(max, Math.round(value)));
  return (
    <span className="dot-indicator" aria-label={`${clamped} / ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{ color: i < clamped ? DOT_COLORS[Math.min(i, DOT_COLORS.length - 1)] : 'var(--muted)' }}
        >
          {i < clamped ? '●' : '○'}
        </span>
      ))}
    </span>
  );
}
