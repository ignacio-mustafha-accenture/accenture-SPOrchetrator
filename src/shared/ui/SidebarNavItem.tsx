import Link from 'next/link';
import clsx from 'clsx';

type SidebarNavItemProps = {
  label: string;
  href: string;
  active?: boolean;
  iconOnly?: boolean;
};

export function SidebarNavItem({ label, href, active = false, iconOnly = false }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex gap-[10px] items-center rounded-[var(--radius-nav,8px)] w-full transition-colors',
        iconOnly ? 'justify-center p-[10px]' : 'px-[12px] py-[9px]',
        active
          ? String.raw`bg-[var(--accent-dim,rgba(161,0,255,0.15))] border-l-[3px] border-[var(--accent,#a100ff)] pl-[9px]`
          : String.raw`hover:bg-[var(--bg-hover,#1e2330)]`,
      )}
    >
      {/* Icon placeholder — cuadrado 16×16 igual que en Figma */}
      <div
        className={clsx(
          'rounded-[2px] shrink-0 size-[16px]',
          active
            ? String.raw`bg-[var(--accent,#a100ff)]`
            : String.raw`bg-[var(--text-secondary,#8b92a0)] opacity-70`,
        )}
      />
      {!iconOnly && (
        <span
          className={clsx(
            String.raw`font-medium leading-normal text-[13px] whitespace-nowrap shrink-0`,
            active
              ? String.raw`text-[color:var(--accent,#a100ff)]`
              : String.raw`text-[color:var(--text-secondary,#8b92a0)]`,
          )}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
