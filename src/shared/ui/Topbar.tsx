import clsx from 'clsx';
import { Avatar } from './Avatar';

type TopbarPlatform = 'Desktop' | 'Tablet' | 'Mobile';

type TopbarProps = {
  className?: string;
  platform?: TopbarPlatform;
  version?: string;
  tier?: string;
  userInitials?: string;
};

const BADGE_CLASS = String.raw`border border-solid flex items-center px-[var(--spacing-8,8px)] py-[var(--spacing-4,4px)] rounded-[var(--radius-tag,6px)] shrink-0 gap-[var(--spacing\/5,5px)] bg-[var(--bg\/glass-highlight,rgba(255,255,255,0.18))] border-[var(--border\/glass,rgba(255,255,255,0.3))]`;

const BADGE_TEXT = String.raw`font-medium leading-normal shrink-0 text-[color:var(--text\/on-accent,white)] text-[length:var(--font\/size\/xs,11px)] whitespace-nowrap`;

export function Topbar({
  className,
  platform = 'Desktop',
  version = 'v2.1.0',
  tier = 'Enterprise',
  userInitials = 'NM',
}: TopbarProps) {
  const isDesktop = platform === 'Desktop';
  const isTablet = platform === 'Tablet';
  const isMobile = platform === 'Mobile';
  const showBadges = isDesktop || isTablet;

  return (
    <header
      className={clsx(
        String.raw`bg-[var(--bg\/topbar,#6900aa)] flex h-[44px] items-center justify-between px-[var(--topbar\/padding-x,20px)] w-full`,
        className,
      )}
    >
      {/* Breadcrumb */}
      <div
        className={clsx(
          'flex items-center overflow-clip shrink-0',
          isMobile ? 'gap-[var(--spacing-4,4px)]' : String.raw`gap-[var(--spacing-4,4px)] font-normal leading-normal text-[color:var(--text\/primary,#f0f2f5)] whitespace-nowrap`,
        )}
      >
        <p
          className={clsx(
            String.raw`font-normal leading-normal text-[color:var(--text\/primary,#f0f2f5)] whitespace-nowrap shrink-0`,
            isMobile ? String.raw`text-[length:var(--font\/size\/md,13px)]` : String.raw`text-[length:var(--font\/size\/xl,15px)]`,
          )}
        >
          {isMobile ? 'S&P Orchestrator' : 'Accenture'}
        </p>
        {showBadges && (
          <>
            <p className={String.raw`shrink-0 text-[length:var(--font\/size\/lg,14px)] text-[color:var(--text\/primary,#f0f2f5)]`}>›</p>
            <p className={String.raw`shrink-0 text-[length:var(--font\/size\/md,13px)] text-[color:var(--text\/primary,#f0f2f5)]`}>
              {isTablet ? 'S&P Orch.' : 'S&P Orchestrator'}
            </p>
          </>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center overflow-clip shrink-0 gap-[var(--spacing-8,8px)]">
        {showBadges && (
          <>
            <div className={BADGE_CLASS}>
              <p className={BADGE_TEXT}>{tier}</p>
            </div>
            <div className={BADGE_CLASS}>
              <p className={BADGE_TEXT}>{version}</p>
            </div>
          </>
        )}
        <Avatar initials={userInitials} size="S" />
      </div>
    </header>
  );
}
