'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

import { LogoMark, SidebarNavItem, SidebarUserChip } from '@/shared/ui';

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' as const } },
};

type User = {
  name: string;
  role: string;
  initials: string;
};

type HomeSidebarProps = {
  user: User;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export function HomeSidebar({ user, isMobileOpen, onMobileClose }: HomeSidebarProps) {
  const pathname = usePathname();
  const tc = useTranslations('common');
  const t = useTranslations('home.nav');

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), href: '/home',        icon: LayoutDashboard },
    { id: 'agents',    label: t('agents'),    href: '/home/agents', icon: Bot },
  ];

  const activeId = pathname.startsWith('/home/agents') ? 'agents' : 'dashboard';

  const sidebarContent = (iconOnly: boolean) => (
    <div
      className={
        iconOnly
          ? String.raw`bg-[var(--bg-surface,#111318)] border-r border-[var(--border-subtle,rgba(255,255,255,0.07))] flex flex-col h-full items-center overflow-clip shrink-0 w-[56px]`
          : String.raw`bg-[var(--bg-surface,#111318)] border-r border-[var(--border-subtle,rgba(255,255,255,0.07))] flex flex-col h-full items-start overflow-clip shrink-0 w-[240px]`
      }
    >
      {/* Logo */}
      <div
        className={
          iconOnly
            ? 'flex flex-col items-center py-[14px] w-full shrink-0'
            : 'flex gap-[8px] items-center p-[16px] w-full shrink-0'
        }
      >
        <LogoMark
          className={String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-[var(--radius-logo,8px)] shrink-0 size-[32px]`}
          text="IQ"
        />
        {!iconOnly && (
          <p className={String.raw`font-extrabold leading-normal text-[color:var(--text-primary,#f0f2f5)] text-[16px] whitespace-nowrap shrink-0`}>
            {tc('appName')}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className={String.raw`bg-[var(--border-subtle,rgba(255,255,255,0.07))] h-px w-full shrink-0`} />

      {/* Nav items */}
      <motion.div
        className={
          iconOnly
            ? 'flex flex-col gap-[4px] items-center p-[8px] w-full shrink-0'
            : 'flex flex-col gap-[2px] items-start p-[8px] w-full shrink-0'
        }
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {navItems.map((item) => (
          <motion.div key={item.id} variants={navItemVariants} className="w-full">
            <SidebarNavItem
              label={item.label}
              href={item.href}
              active={item.id === activeId}
              iconOnly={iconOnly}
              icon={item.icon}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 min-h-0 w-full" />

      {/* Divider */}
      <div className={String.raw`bg-[var(--border-subtle,rgba(255,255,255,0.07))] h-px w-full shrink-0`} />

      {/* User chip */}
      {iconOnly ? (
        <div className="flex flex-col items-center py-[12px] w-full shrink-0">
          <div className={String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-full shrink-0 size-[28px]`}>
            <span className={String.raw`font-bold text-white text-[9px]`}>{user.initials}</span>
          </div>
        </div>
      ) : (
        <SidebarUserChip name={user.name} role={user.role} initials={user.initials} />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: xl+ → 240px */}
      <div className="hidden xl:flex h-full shrink-0">
        {sidebarContent(false)}
      </div>

      {/* Tablet: md–xl → 56px icon-only */}
      <div className="hidden md:flex xl:hidden h-full shrink-0">
        {sidebarContent(true)}
      </div>

      {/* Mobile: drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label={tc('aria.closeMenu')}
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/50 cursor-default"
          />
          <div className="relative z-10 h-full">
            {sidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
