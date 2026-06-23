'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarView } from './SidebarView';
import type { ChatSession } from '../../domain/entities/ChatSession';

const NAV_CONFIG: { id: string; href: string; disabled: boolean; icon?: LucideIcon }[] = [
  { id: 'overview',  href: '/home',                disabled: false, icon: LayoutDashboard },
  { id: 'rfps',      href: '/agent-view',           disabled: false },
  { id: 'suppliers', href: '/agent-view/suppliers', disabled: true },
  { id: 'settings',  href: '/agent-view/settings',  disabled: true },
];

type SidebarProps = {
  recentSessions: ChatSession[];
  user: { name: string; role: string; initials: string };
  recentLabel: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export function Sidebar({ recentSessions, user, recentLabel, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('agentView.nav');

  const NAV_ITEMS = NAV_CONFIG.map((item) => ({
    ...item,
    label: t(item.id as 'overview' | 'rfps' | 'suppliers' | 'settings'),
  }));

  const activeNavId =
    NAV_ITEMS.slice()
      .reverse()
      .find((item) => pathname.startsWith(item.href) && item.href !== '/agent-view')?.id ?? 'rfps';

  return (
    <SidebarView
      navItems={NAV_ITEMS}
      activeNavId={activeNavId}
      recentSessions={recentSessions}
      user={user}
      recentLabel={recentLabel}
      isDrawerOpen={isMobileOpen}
      onDrawerClose={onMobileClose}
      onHamburgerClick={() => {}}
    />
  );
}
