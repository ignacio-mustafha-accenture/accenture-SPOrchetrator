'use client';

import { useTranslations } from 'next-intl';

import { ChatAreaClient } from './ChatAreaClient';

type ChatInputAreaProps = {
  onSubmit: (value: string) => void;
  isPending?: boolean;
  placeholder?: string;
};

export function ChatInputArea({ onSubmit, isPending = false, placeholder }: ChatInputAreaProps) {
  const t = useTranslations('agentView');
  const resolvedPlaceholder = placeholder ?? t('inputPlaceholder');
  return (
    <div className="bg-[var(--bg-surface)] md:bg-transparent border-t border-[var(--border-subtle)] md:border-none shrink-0 w-full px-3 md:px-6 pt-2 md:pt-3 pb-5 md:pb-6">
      <ChatAreaClient onSubmit={onSubmit} isPending={isPending} placeholder={resolvedPlaceholder} />
    </div>
  );
}
