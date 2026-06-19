'use client';

import { useState } from 'react';
import { AgentChatHeader } from '../AgentChatHeader/AgentChatHeader';
import { ExecutionLogPanel } from '../ExecutionLogPanel/ExecutionLogPanel';
import type { LogEntryData } from '../ExecutionLogPanel/LogEntry';

type AgentChatShellProps = {
  children: React.ReactNode;
  isOnline?: boolean;
};

export function AgentChatShell({ children, isOnline = true }: AgentChatShellProps) {
  const [logOpen, setLogOpen] = useState(false);
  const [logEntries] = useState<LogEntryData[]>([]);

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
        <ExecutionLogPanel isOpen={logOpen} entries={logEntries} />
      </div>
    </div>
  );
}
