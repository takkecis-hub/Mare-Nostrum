'use client';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'gold' | 'danger' | 'success' | 'purple' | 'teal';
}

const VARIANT_CLASS: Record<string, string> = {
  default: 'badge',
  gold: 'badge badge-gold',
  danger: 'badge badge-danger',
  success: 'badge badge-success',
  purple: 'badge badge-purple',
  teal: 'badge badge-teal',
};

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return <span className={VARIANT_CLASS[variant]}>{label}</span>;
}
