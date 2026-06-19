'use client';

import { useTranslations } from 'next-intl';
import { ScrollText, Plus } from 'lucide-react';

type AgentChatHeaderProps = {
  isOnline?: boolean;
  logOpen: boolean;
  onLogToggle: () => void;
  onNewSession?: () => void;
};

export function AgentChatHeader({
  isOnline = true,
  logOpen,
  onLogToggle,
  onNewSession,
}: AgentChatHeaderProps) {
  const t = useTranslations('agentView.chatHeader');

  return (
    <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
      {/* Pulsing status dot */}
      <div className="relative size-2 shrink-0">
        {isOnline && (
          <span className="absolute inset-0 rounded-full bg-[var(--status-success)] animate-ping opacity-60" />
        )}
        <span
          className={
            isOnline
              ? String.raw`relative block size-2 rounded-full bg-[var(--status-success)]`
              : String.raw`relative block size-2 rounded-full bg-[var(--text-muted)]`
          }
        />
      </div>

      {/* Agent identity */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13px] text-[var(--text-primary)] leading-tight truncate">
          {t('agentName')}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-px truncate">
          {t('subtitle')}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onLogToggle}
          aria-label={t('toggleLog')}
          aria-pressed={logOpen}
          className={
            logOpen
              ? String.raw`flex items-center justify-center w-7 h-7 rounded-[var(--radius-nav)] bg-[var(--accent-dim)] text-[var(--accent)] transition-colors duration-150`
              : String.raw`flex items-center justify-center w-7 h-7 rounded-[var(--radius-nav)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-150`
          }
        >
          <ScrollText size={14} strokeWidth={1.5} />
        </button>

        {onNewSession && (
          <button
            type="button"
            onClick={onNewSession}
            aria-label={t('newSession')}
            className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-nav)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-150"
          >
            <Plus size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
