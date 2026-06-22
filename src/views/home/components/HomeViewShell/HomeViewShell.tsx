'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TopbarBidiq } from '@/shared/ui';
import { createClient } from '@/shared/lib/supabase/client';
import { HomeSidebar } from '../HomeSidebar/HomeSidebar';

type HomeViewShellProps = {
  children: React.ReactNode;
  userName: string;
  userEmail?: string;
  userInitials: string;
  userRole: string;
  agentOnline?: boolean;
};

export function HomeViewShell({
  children,
  userName,
  userEmail,
  userInitials,
  userRole,
  agentOnline = true,
}: HomeViewShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const tc = useTranslations('common');
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const hamburger = (
    <button
      type="button"
      aria-label={tc('aria.openMenu')}
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
        userEmail={userEmail}
        userInitials={userInitials}
        agentOnline={agentOnline}
        onSignOut={handleSignOut}
        mobileMenuSlot={hamburger}
      />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <HomeSidebar
          user={{ name: userName, role: userRole, initials: userInitials }}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
