import Link from 'next/link';
import { Badge } from '@/shared/ui';

type AgentCardProps = {
  name: string;
  description: string;
  status: 'active' | 'coming-soon';
  href?: string;
  badgeActiveLabel: string;
  badgeComingSoonLabel: string;
};

export function AgentCard({
  name,
  description,
  status,
  href,
  badgeActiveLabel,
  badgeComingSoonLabel,
}: AgentCardProps) {
  const initial = name.slice(0, 2).toUpperCase();
  const isActive = status === 'active' && !!href;

  const cardContent = (
    <div
      className={
        isActive
          ? String.raw`flex flex-col gap-4 p-6 rounded-[var(--radius-card,16px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] hover:bg-[var(--bg-hover,#1e2330)] hover:border-[var(--accent,#a100ff)] transition-colors duration-150 cursor-pointer h-full`
          : String.raw`flex flex-col gap-4 p-6 rounded-[var(--radius-card,16px)] border border-[var(--border-subtle,rgba(255,255,255,0.07))] bg-[var(--bg-elevated,#181c23)] opacity-60 cursor-default h-full`
      }
    >
      {/* Icon */}
      <div
        className={
          isActive
            ? String.raw`flex items-center justify-center rounded-[var(--radius-nav,8px)] shrink-0 size-[44px] bg-[var(--accent-dim,rgba(161,0,255,0.15))]`
            : String.raw`flex items-center justify-center rounded-[var(--radius-nav,8px)] shrink-0 size-[44px] bg-[var(--status-neutral-dim,rgba(139,146,160,0.12))]`
        }
      >
        <span
          className={
            isActive
              ? String.raw`font-bold text-[13px] text-[color:var(--accent,#a100ff)]`
              : String.raw`font-bold text-[13px] text-[color:var(--text-muted,#555c6b)]`
          }
        >
          {initial}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        <p className={String.raw`font-semibold text-[14px] leading-snug text-[color:var(--text-primary,#f0f2f5)]`}>
          {name}
        </p>
        <p className={String.raw`font-normal text-[12px] leading-snug text-[color:var(--text-muted,#555c6b)]`}>
          {description}
        </p>
      </div>

      {/* Status badge */}
      <div className="mt-auto">
        {isActive ? (
          <Badge variant="Success">{badgeActiveLabel}</Badge>
        ) : (
          <Badge variant="Neutral">{badgeComingSoonLabel}</Badge>
        )}
      </div>
    </div>
  );

  if (isActive && href) {
    return (
      <Link href={href} className="block h-full no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
