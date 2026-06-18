'use client';

import { useState, useRef } from 'react';

type ChatInputProps = {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
};

export function ChatInput({ placeholder = 'Message BidIQ Agent…', onSubmit, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={String.raw`bg-[var(--bg-elevated,#181c23)] border border-[var(--border-default,rgba(255,255,255,0.14))] border-solid flex gap-[10px] items-center pl-[16px] pr-[10px] py-[10px] rounded-[var(--radius-input,14px)] w-full`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={String.raw`flex-1 min-w-0 bg-transparent outline-none font-normal leading-normal text-[14px] text-[color:var(--text-primary,#f0f2f5)] placeholder:text-[color:var(--text-muted,#555c6b)] disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={String.raw`bg-[var(--accent,#a100ff)] rounded-[10px] shrink-0 size-[34px] flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-80`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M14 8L2 2L5 8L2 14L14 8Z" fill="white" />
        </svg>
      </button>
    </div>
  );
}
