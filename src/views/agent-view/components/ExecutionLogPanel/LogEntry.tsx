'use client';

import { motion } from 'framer-motion';

export type LogEntryData = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  label: string;
  detail?: string;
  timestamp: Date;
};

const ENTRY_STYLES: Record<LogEntryData['type'], string> = {
  info:    String.raw`text-[var(--status-info)] bg-[rgba(37,99,235,0.08)] dark:bg-[rgba(96,165,250,0.08)]`,
  success: String.raw`text-[var(--status-success)] bg-[var(--status-success-dim)]`,
  warning: String.raw`text-[var(--status-warning)] bg-[var(--status-warning-dim)]`,
  error:   String.raw`text-[var(--status-error)] bg-[var(--status-error-dim)]`,
};

const DOT_STYLES: Record<LogEntryData['type'], string> = {
  info:    'bg-[var(--status-info)]',
  success: 'bg-[var(--status-success)]',
  warning: 'bg-[var(--status-warning)]',
  error:   'bg-[var(--status-error)]',
};

type LogEntryProps = {
  entry: LogEntryData;
};

export function LogEntry({ entry }: LogEntryProps) {
  const time = entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex items-start gap-2 px-2.5 py-2 rounded-[var(--radius-tag)] text-[11px] ${ENTRY_STYLES[entry.type]}`}
    >
      <span className={`mt-[5px] size-1.5 rounded-full shrink-0 ${DOT_STYLES[entry.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-snug break-words">{entry.label}</p>
        {entry.detail && (
          <p className="opacity-70 leading-snug mt-0.5 break-words">{entry.detail}</p>
        )}
        <p className="opacity-50 mt-1 font-mono tracking-tight">{time}</p>
      </div>
    </motion.div>
  );
}
