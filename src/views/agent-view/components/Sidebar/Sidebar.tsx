'use client';

import { usePathname } from 'next/navigation';
import { SidebarView } from './SidebarView';
import type { ChatSession } from '../../domain/entities/ChatSession';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/home' },
  { id: 'rfps', label: 'RFPs', href: '/agent-view' },
  { id: 'suppliers', label: 'Suppliers', href: '/agent-view/suppliers' },
  { id: 'settings', label: 'Settings', href: '/agent-view/settings' },
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

  const activeNavId =
    NAV_ITEMS.slice()
      .reverse()
      .find((item) => pathname.startsWith(item.href) && item.href !== '/home')?.id ?? 'rfps';

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
