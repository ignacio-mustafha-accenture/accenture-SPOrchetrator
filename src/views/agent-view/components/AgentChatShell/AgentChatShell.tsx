'use client';

import { useState } from 'react';

import type { LogEntryData } from '../../domain/entities/AgentLogEntry';
import { AgentChatHeader } from '../AgentChatHeader/AgentChatHeader';
import { ExecutionLogPanel } from '../ExecutionLogPanel/ExecutionLogPanel';

type AgentChatShellProps = {
  children: React.ReactNode;
  isOnline?: boolean;
  logEntries?: LogEntryData[];
};

export function AgentChatShell({ children, isOnline = true, logEntries }: AgentChatShellProps) {
  const [logOpen, setLogOpen] = useState(false);
  const [internalEntries] = useState<LogEntryData[]>([]);

  const entries = logEntries ?? internalEntries;

  return (
    <div className="flex flex-col h-full">
      <AgentChatHeader
        isOnline={isOnline}
        logOpen={logOpen}
        onLogToggle={() => setLogOpen((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto min-w-0">
          {children}
        </div>
        <ExecutionLogPanel isOpen={logOpen} entries={entries} />
      </div>
    </div>
  );
}
