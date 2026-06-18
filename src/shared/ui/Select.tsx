'use client';

import clsx from 'clsx';

type Option = { value: string; label: string };

type SelectProps = {
  className?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Option[];
  disabled?: boolean;
};

export function Select({
  className,
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  options = [],
  disabled = false,
}: SelectProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={clsx(String.raw`flex flex-col gap-[var(--spacing\/6,6px)] items-start w-[320px]`, className)}>
      {label && (
        <p className={String.raw`text-[color:var(--text\/secondary,#8b92a0)] text-[length:var(--font\/size\/sm,12px)]`}>
          {label}
        </p>
      )}
      <div
        className={clsx(
          String.raw`relative bg-[var(--bg\/elevated,#181c23)] border border-solid flex gap-0 h-[44px] items-center justify-between overflow-clip px-[var(--spacing\/14,14px)] rounded-[var(--radius-input,14px)] shrink-0 w-full text-[length:var(--font\/size\/lg,14px)]`,
          String.raw`border-[var(--border\/subtle,rgba(255,255,255,0.07))] focus-within:border-[var(--border\/focus,rgba(161,0,255,0.5))]`,
        )}
      >
        <p
          className={clsx(
            'flex-[1_0_0] min-w-px',
            selectedLabel
              ? String.raw`text-[color:var(--text\/primary,#f0f2f5)]`
              : String.raw`text-[color:var(--text\/muted,#555c6b)]`,
          )}
        >
          {selectedLabel ?? placeholder}
        </p>
        <p className={String.raw`shrink-0 text-[color:var(--text\/secondary,#8b92a0)] whitespace-nowrap`}>⌄</p>
        <select
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          aria-label={label ?? placeholder}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
