import Link from 'next/link';
import clsx from 'clsx';

type SidebarNavItemProps = {
  label: string;
  href: string;
  active?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
};

export function SidebarNavItem({ label, href, active = false, iconOnly = false, disabled = false }: SidebarNavItemProps) {
  const baseClass = clsx(
    'flex gap-[10px] items-center rounded-[var(--radius-nav,8px)] w-full transition-colors',
    iconOnly ? 'justify-center p-[10px]' : 'px-[12px] py-[9px]',
    disabled
      ? 'opacity-40 cursor-default'
      : active
        ? String.raw`bg-[var(--accent-dim,rgba(161,0,255,0.15))] border-l-[3px] border-[var(--accent,#a100ff)] pl-[9px]`
        : String.raw`hover:bg-[var(--bg-hover,#1e2330)]`,
  );

  const icon = (
    <div
      className={clsx(
        'rounded-[2px] shrink-0 size-[16px]',
        active && !disabled
          ? String.raw`bg-[var(--accent,#a100ff)]`
          : String.raw`bg-[var(--text-secondary,#8b92a0)] opacity-70`,
      )}
    />
  );

  const text = !iconOnly && (
    <span
      className={clsx(
        String.raw`font-medium leading-normal text-[13px] whitespace-nowrap shrink-0`,
        active && !disabled
          ? String.raw`text-[color:var(--accent,#a100ff)]`
          : String.raw`text-[color:var(--text-secondary,#8b92a0)]`,
      )}
    >
      {label}
    </span>
  );

  if (disabled) {
    return (
      <div className={baseClass} aria-disabled="true">
        {icon}
        {text}
      </div>
    );
  }

  return (
    <Link href={href} className={baseClass}>
      {icon}
      {text}
    </Link>
  );
}
