'use client';

import { useState } from 'react';
import { TopbarBidiq } from '@/shared/ui';
import { Sidebar } from '../Sidebar/Sidebar';
import type { ChatSession } from '../../domain/entities/ChatSession';

type AgentViewShellProps = {
  children: React.ReactNode;
  userName: string;
  userInitials: string;
  userRole: string;
  recentSessions: ChatSession[];
  recentLabel: string;
  agentOnline?: boolean;
};

export function AgentViewShell({
  children,
  userName,
  userInitials,
  userRole,
  recentSessions,
  recentLabel,
  agentOnline = true,
}: AgentViewShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hamburger = (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => setIsMobileMenuOpen(true)}
      className="flex flex-col gap-[5px] items-center justify-center w-[20px] shrink-0 cursor-pointer"
    >
      <span className="bg-white h-[2px] w-full rounded-[1px]" />
      <span className="bg-white h-[2px] w-full rounded-[1px]" />
      <span className="bg-white h-[2px] w-full rounded-[1px]" />
    </button>
  );

  return (
    <div className={String.raw`flex flex-col h-screen bg-[var(--bg-base,#0a0c10)] overflow-hidden`}>
      <TopbarBidiq
        userName={userName}
        userInitials={userInitials}
        agentOnline={agentOnline}
        mobileMenuSlot={hamburger}
      />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar
          recentSessions={recentSessions}
          user={{ name: userName, role: userRole, initials: userInitials }}
          recentLabel={recentLabel}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
