import { LogoMark, SidebarNavItem, SidebarSessionItem, SidebarUserChip } from '@/shared/ui';
import type { ChatSession } from '../../domain/entities/ChatSession';

type NavItem = {
  id: string;
  label: string;
  href: string;
};

type User = {
  name: string;
  role: string;
  initials: string;
};

type SidebarViewProps = {
  navItems: NavItem[];
  activeNavId: string;
  recentSessions: ChatSession[];
  user: User;
  recentLabel: string;
  isDrawerOpen: boolean;
  onDrawerClose: () => void;
  onHamburgerClick: () => void;
};

export function SidebarView({
  navItems,
  activeNavId,
  recentSessions,
  user,
  recentLabel,
  isDrawerOpen,
  onDrawerClose,
}: SidebarViewProps) {
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
            BidIQ
          </p>
        )}
      </div>

      {/* Divider */}
      <div className={String.raw`bg-[var(--border-subtle,rgba(255,255,255,0.07))] h-px w-full shrink-0`} />

      {/* Nav items */}
      <div className={iconOnly ? 'flex flex-col gap-[4px] items-center p-[8px] w-full shrink-0' : 'flex flex-col gap-[2px] items-start p-[8px] w-full shrink-0'}>
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            label={item.label}
            href={item.href}
            active={item.id === activeNavId}
            iconOnly={iconOnly}
          />
        ))}
      </div>

      {!iconOnly && (
        <>
          {/* Divider */}
          <div className={String.raw`bg-[var(--border-subtle,rgba(255,255,255,0.07))] h-px w-full shrink-0`} />

          {/* Recent label */}
          <div className="flex items-start pb-[4px] pt-[10px] px-[16px] w-full shrink-0">
            <p className={String.raw`font-semibold leading-normal text-[color:var(--text-muted,#555c6b)] text-[10px] tracking-[0.8px] whitespace-nowrap`}>
              {recentLabel}
            </p>
          </div>

          {/* Recent sessions */}
          <div className="flex flex-col gap-[2px] items-start pb-[8px] pt-[2px] px-[8px] w-full shrink-0">
            {recentSessions.map((session) => (
              <SidebarSessionItem
                key={session.id}
                title={session.title}
                subtitle={`${session.status.charAt(0).toUpperCase() + session.status.slice(1)} · ${session.date}`}
                href={`/agent-view?session=${session.id}`}
              />
            ))}
          </div>
        </>
      )}

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
      {/* Desktop: xl+ → 240px full sidebar */}
      <div className="hidden xl:flex h-full shrink-0">
        {sidebarContent(false)}
      </div>

      {/* Tablet: md–xl → 56px icon sidebar */}
      <div className="hidden md:flex xl:hidden h-full shrink-0">
        {sidebarContent(true)}
      </div>

      {/* Mobile: <md → drawer */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={onDrawerClose}
            className="absolute inset-0 bg-black/50 cursor-default"
          />
          {/* Drawer panel */}
          <div className="relative z-10 h-full">
            {sidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
