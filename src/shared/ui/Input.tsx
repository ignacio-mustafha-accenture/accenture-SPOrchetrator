'use client';

import React, { useState, useId } from 'react';
import clsx from 'clsx';

type InputProps = {
  className?: string;
  type?: 'text' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  errorMessage?: string;
  disabled?: boolean;
  id?: string;
};

export function Input({
  className,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  disabled = false,
  id,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id ?? (label ? generatedId : undefined);
  const hasError = !!errorMessage;
  const resolvedType = type === 'password' && showPassword ? 'text' : type;

  const borderClass = hasError
    ? String.raw`border-[var(--status\/error,#ef4444)]`
    : String.raw`border-[var(--border\/subtle,rgba(255,255,255,0.07))] focus-within:border-[var(--border\/focus,rgba(161,0,255,0.5))]`;

  return (
    <div className={clsx(String.raw`flex flex-col gap-[var(--spacing\/6,6px)] items-start w-[320px]`, className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={String.raw`font-normal leading-normal shrink-0 text-[color:var(--text\/secondary,#8b92a0)] text-[length:var(--font\/size\/sm,12px)] whitespace-nowrap`}
        >
          {label}
        </label>
      )}

      <div
        className={clsx(
          String.raw`bg-[var(--bg\/elevated,#181c23)] border border-solid flex h-[44px] items-center overflow-clip px-[var(--spacing\/14,14px)] rounded-[var(--radius-input,14px)] shrink-0 w-full`,
          type === 'password' ? 'gap-[var(--spacing-8,8px)]' : 'gap-0',
          borderClass,
        )}
      >
        <input
          id={inputId}
          type={resolvedType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            String.raw`flex-[1_0_0] min-w-px font-normal leading-normal bg-transparent outline-none text-[length:var(--font\/size\/lg,14px)]`,
            String.raw`text-[color:var(--text\/muted,#555c6b)]`,
            String.raw`placeholder:text-[color:var(--text\/muted,#555c6b)]`,
            String.raw`focus:text-[color:var(--text\/primary,#f0f2f5)]`,
            disabled && String.raw`opacity-50 cursor-not-allowed`,
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={clsx(
              String.raw`rounded-[var(--radius-full,9999px)] shrink-0 size-[18px] bg-[var(--bg\/glass,rgba(255,255,255,0.12))]`,
              'flex items-center justify-center cursor-pointer disabled:cursor-not-allowed',
            )}
          />
        )}
      </div>

      {hasError && (
        <p className={String.raw`font-normal leading-normal shrink-0 text-[color:var(--status\/error,#ef4444)] text-[length:var(--font\/size\/xs,11px)] whitespace-nowrap`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
