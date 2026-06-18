'use client';

import React, { useId } from 'react';
import clsx from 'clsx';

type CheckboxProps = {
  className?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  children?: React.ReactNode;
  id?: string;
};

export function Checkbox({ className, checked = false, onChange, disabled = false, children, id }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  const boxClass = clsx(
    'relative rounded-[var(--radius-badge,4px)] shrink-0 size-[16px]',
    checked && !disabled && 'bg-[var(--accent,#a100ff)] overflow-clip flex items-center justify-center',
    !checked && !disabled && String.raw`border border-[var(--border\/default,rgba(255,255,255,0.14))] border-solid`,
    disabled && String.raw`border border-[var(--border\/subtle,rgba(255,255,255,0.07))] border-solid`,
  );

  const textClass = clsx(
    String.raw`font-normal leading-normal shrink-0 text-[length:var(--font\/size\/md,13px)] whitespace-nowrap`,
    checked && !disabled && String.raw`text-[color:var(--text\/primary,#f0f2f5)]`,
    !checked && !disabled && String.raw`text-[color:var(--text\/secondary,#8b92a0)]`,
    disabled && String.raw`text-[color:var(--text\/muted,#555c6b)]`,
  );

  return (
    <label
      htmlFor={checkboxId}
      className={clsx(
        'flex gap-[var(--spacing-8,8px)] items-center',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <div className={boxClass} aria-hidden="true">
        {checked && (
          <p className={String.raw`font-bold absolute text-[color:var(--text\/on-accent,white)] text-[length:var(--font\/size\/2xs,10px)] left-[3px] top-[2px] leading-normal whitespace-nowrap`}>
            ✓
          </p>
        )}
      </div>
      {children && <p className={textClass}>{children}</p>}
    </label>
  );
}
