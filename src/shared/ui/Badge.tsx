import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'Success' | 'Warning' | 'Error' | 'Accent' | 'Neutral';

type BadgeProps = {
  className?: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children?: React.ReactNode;
};

const variantStyles: Record<BadgeVariant, { wrapper: string; dot: string; text: string; label: string }> = {
  Success: {
    wrapper: String.raw`bg-[var(--status-success-dim,rgba(34,197,94,0.12))] border-[var(--status-success,#22c55e)]`,
    dot: String.raw`bg-[var(--status-success,#22c55e)]`,
    text: String.raw`text-[color:var(--status-success,#22c55e)]`,
    label: 'Success',
  },
  Warning: {
    wrapper: String.raw`bg-[var(--status-warning-dim,rgba(234,179,8,0.12))] border-[var(--status-warning,#eab308)]`,
    dot: String.raw`bg-[var(--status-warning,#eab308)]`,
    text: String.raw`text-[color:var(--status-warning,#eab308)]`,
    label: 'Warning',
  },
  Error: {
    wrapper: String.raw`bg-[var(--status-error-dim,rgba(239,68,68,0.12))] border-[var(--status-error,#ef4444)]`,
    dot: String.raw`bg-[var(--status-error,#ef4444)]`,
    text: String.raw`text-[color:var(--status-error,#ef4444)]`,
    label: 'Error',
  },
  Accent: {
    wrapper: String.raw`bg-[var(--accent-dim,rgba(161,0,255,0.15))] border-[var(--accent,#a100ff)]`,
    dot: 'bg-[var(--accent,#a100ff)]',
    text: 'text-[color:var(--accent,#a100ff)]',
    label: 'Accent',
  },
  Neutral: {
    wrapper: String.raw`bg-[var(--status-neutral-dim,rgba(139,146,160,0.12))] border-[var(--text-secondary,#8b92a0)]`,
    dot: String.raw`bg-[var(--text-secondary,#8b92a0)]`,
    text: String.raw`text-[color:var(--text-secondary,#8b92a0)]`,
    label: 'Neutral',
  },
};

export function Badge({ className, variant = 'Success', size = 'md', children }: BadgeProps) {
  const s = variantStyles[variant];

  return (
    <span
      className={clsx(
        'border border-solid flex gap-[5px] items-center',
        size === 'sm'
          ? 'px-[5px] py-[2px] rounded-[4px]'
          : 'px-[var(--spacing-8,8px)] py-[var(--spacing-4,4px)] rounded-[var(--radius-tag,6px)]',
        s.wrapper,
        className,
      )}
    >
      <span
        className={clsx(
          'rounded-full shrink-0',
          size === 'sm' ? 'size-[5px]' : String.raw`rounded-[var(--radius-dot,3.5px)] size-[7px]`,
          s.dot,
        )}
      />
      <p
        className={clsx(
          'font-medium whitespace-nowrap',
          size === 'sm' ? 'text-[10px]' : String.raw`text-[length:var(--font-size-xs,11px)]`,
          s.text,
        )}
      >
        {children ?? s.label}
      </p>
    </span>
  );
}
