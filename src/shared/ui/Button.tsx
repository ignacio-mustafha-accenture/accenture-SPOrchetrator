'use client';

import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'Primary' | 'Secondary' | 'Ghost';

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const BASE = String.raw`flex items-center justify-center gap-[var(--spacing-8,8px)] px-[var(--spacing-24,24px)] py-[var(--spacing-12,12px)] rounded-[var(--radius-button,10px)] font-medium text-[length:var(--font\/size\/md,13px)] transition-colors cursor-pointer disabled:cursor-not-allowed`;

const VARIANTS: Record<ButtonVariant, string> = {
  Primary: String.raw`bg-[var(--accent,#a100ff)] text-[color:var(--text\/on-accent,white)] hover:bg-[var(--accent\/glow,rgba(161,0,255,0.4))] disabled:bg-[var(--accent\/dim,rgba(161,0,255,0.15))] disabled:text-[color:var(--text\/muted,#555c6b)]`,
  Secondary: String.raw`border border-[var(--border\/default,rgba(255,255,255,0.14))] text-[color:var(--text\/primary,#f0f2f5)] hover:bg-[var(--bg\/hover,#1e2330)] disabled:border-[var(--border\/subtle,rgba(255,255,255,0.07))] disabled:text-[color:var(--text\/muted,#555c6b)]`,
  Ghost: String.raw`text-[color:var(--accent,#a100ff)] hover:bg-[var(--accent\/dim,rgba(161,0,255,0.15))] disabled:text-[color:var(--text\/muted,#555c6b)]`,
};

export function Button({ children, variant = 'Primary', disabled = false, onClick, type = 'button', className }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(BASE, VARIANTS[variant], className)}
    >
      {children ?? 'Button'}
    </button>
  );
}
