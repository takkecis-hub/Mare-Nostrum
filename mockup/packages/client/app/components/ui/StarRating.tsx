'use client';

/**
 * Star rating display: ★★★☆☆
 * stars: 0–4 (number of filled stars)
 */
interface StarRatingProps {
  stars: number;
  max?: number;
}

export default function StarRating({ stars, max = 4 }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(max, Math.round(stars)));
  return (
    <span className="star-rating" aria-label={`${clamped} / ${max} yıldız`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < clamped ? 'var(--accent)' : 'var(--muted)' }}>
          {i < clamped ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}
