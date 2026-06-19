'use client';

import { useTranslations } from 'next-intl';
import { UserDropdown } from './UserDropdown';

type TopbarBidiqProps = {
  className?: string;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  agentOnline?: boolean;
  tier?: string;
  version?: string;
  onSignOut?: () => void;
  /** Slot for the mobile hamburger button (rendered only on mobile, passed from client shell) */
  mobileMenuSlot?: React.ReactNode;
};

export function TopbarBidiq({
  className,
  userName = 'I. Mustafha',
  userEmail,
  userInitials = 'IM',
  agentOnline = true,
  tier = 'ENTERPRISE',
  version = 'V2.1.0',
  onSignOut,
  mobileMenuSlot,
}: TopbarBidiqProps) {
  const tc = useTranslations('common');

  return (
    <header
      className={
        className ||
        String.raw`bg-[var(--bg-topbar,#6900aa)] flex h-[44px] items-center px-[16px] md:px-[24px] w-full shrink-0`
      }
    >
      {/* Mobile: hamburger + logomark + "BidIQ" */}
      {mobileMenuSlot && (
        <div className="flex md:hidden items-center gap-[10px] shrink-0 mr-[10px]">
          {mobileMenuSlot}
        </div>
      )}

      {/* Desktop/Tablet: full breadcrumb */}
      <div className="hidden md:flex items-center overflow-clip shrink-0 gap-0">
        <span className={String.raw`font-extrabold leading-normal text-white text-[15px] tracking-[-0.3px] whitespace-nowrap shrink-0`}>
          {tc('companyName')}
        </span>
        <span className={String.raw`leading-normal text-[#d580ff] text-[15px] whitespace-nowrap shrink-0 px-[3px]`}>
          {' ›'}
        </span>
        <span className={String.raw`font-semibold leading-normal text-[rgba(255,255,255,0.85)] text-[12px] tracking-[0.36px] whitespace-nowrap shrink-0`}>
          {tc('procurementTechnology')}
        </span>
        <div className="bg-[rgba(255,255,255,0.25)] h-[18px] w-px mx-[12px] shrink-0" />
        <span className={String.raw`font-bold leading-normal text-[#d580ff] text-[12px] tracking-[0.36px] whitespace-nowrap shrink-0`}>
          {tc('appName')}
        </span>
      </div>

      {/* Mobile: just app name */}
      <span className={String.raw`flex md:hidden font-extrabold leading-normal text-white text-[15px] whitespace-nowrap shrink-0`}>
        {tc('appName')}
      </span>

      {/* Spacer */}
      <div className="flex-1 min-w-0" />

      {/* Right — badges + status + user */}
      <div className="flex items-center gap-[12px] shrink-0">
        {/* Desktop only: badges + agent status */}
        <div className="hidden xl:flex items-center gap-[12px] shrink-0">
          <div className={String.raw`bg-[rgba(255,255,255,0.1)] flex items-center px-[9px] py-[3px] rounded-[2px] shrink-0`}>
            <span className={String.raw`font-semibold text-[10px] text-[rgba(255,255,255,0.7)] tracking-[0.6px] whitespace-nowrap`}>
              {tier}
            </span>
          </div>
          <div className={String.raw`bg-[rgba(255,255,255,0.1)] flex items-center px-[9px] py-[3px] rounded-[2px] shrink-0`}>
            <span className={String.raw`font-semibold text-[10px] text-[rgba(255,255,255,0.7)] tracking-[0.6px] whitespace-nowrap`}>
              {version}
            </span>
          </div>
          <div className="flex items-center gap-[6px] shrink-0">
            <div
              className={
                agentOnline
                  ? String.raw`size-[7px] rounded-full bg-[var(--status-success,#22c55e)] shrink-0`
                  : String.raw`size-[7px] rounded-full bg-[var(--text-muted,#555c6b)] shrink-0`
              }
            />
            <span className={String.raw`font-semibold text-[11px] text-[rgba(255,255,255,0.7)] whitespace-nowrap`}>
              {agentOnline ? tc('agentOnline') : tc('agentOffline')}
            </span>
          </div>
          <div className="bg-[rgba(255,255,255,0.25)] h-[18px] w-px shrink-0" />
        </div>

        <UserDropdown
            userInitials={userInitials}
            userName={userName}
            userEmail={userEmail}
            onSignOut={onSignOut}
            showName
            triggerClassName={String.raw`px-[10px] py-[5px] rounded-[var(--radius-button,10px)] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.18)] transition-colors duration-150 text-[rgba(255,255,255,0.85)]`}
          />
      </div>
    </header>
  );
}
