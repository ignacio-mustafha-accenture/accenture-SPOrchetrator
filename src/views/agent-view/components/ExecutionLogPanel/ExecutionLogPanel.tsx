'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import { LogEntry, type LogEntryData } from './LogEntry';

type ExecutionLogPanelProps = {
  isOpen: boolean;
  entries?: LogEntryData[];
};

export function ExecutionLogPanel({ isOpen, entries = [] }: ExecutionLogPanelProps) {
  const t = useTranslations('agentView.executionLog');

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 320 : 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden shrink-0 flex"
      aria-hidden={!isOpen}
    >
      {/* Inner fixed-width container — revealed by the animated outer div */}
      <div className="w-[320px] h-full flex flex-col bg-[var(--bg-surface)] border-l border-[var(--border-subtle)]">
        {/* Panel header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] shrink-0">
          <ScrollText size={13} strokeWidth={1.5} className="text-[var(--text-muted)] shrink-0" />
          <span className="flex-1 min-w-0 font-semibold text-[12px] text-[var(--text-secondary)] tracking-[0.2px] whitespace-nowrap">
            {t('title')}
          </span>
          {/* Live indicator */}
          <span className="size-1.5 rounded-full bg-[var(--status-success)] shrink-0" />
        </div>

        {/* Entries list */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 min-h-0">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 h-full text-center py-10">
              <span className="text-[24px] leading-none">⚡</span>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-[180px]">
                {t('empty')}
              </p>
            </div>
          ) : (
            entries.map((entry) => <LogEntry key={entry.id} entry={entry} />)
          )}
        </div>
      </div>
    </motion.div>
  );
}
