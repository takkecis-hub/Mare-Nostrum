'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  /** When true renders the red→orange→green gradient (durability bar) */
  gradient?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  gradient = false,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="progress-bar">
      <div
        className={gradient ? 'progress-fill progress-fill-gradient' : 'progress-fill'}
        style={{ width: `${pct}%` }}
      />
      {label && <span className="progress-label">{label}</span>}
    </div>
  );
}
