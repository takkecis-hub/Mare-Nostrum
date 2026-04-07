'use client';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'gold' | 'danger' | 'success';
}

const VARIANT_CLASS: Record<string, string> = {
  default: 'badge',
  gold: 'badge badge-gold',
  danger: 'badge badge-danger',
  success: 'badge badge-success',
};

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return <span className={VARIANT_CLASS[variant]}>{label}</span>;
}
