import Link from 'next/link';

type SidebarSessionItemProps = {
  title: string;
  subtitle: string;
  href: string;
};

export function SidebarSessionItem({ title, subtitle, href }: SidebarSessionItemProps) {
  return (
    <Link
      href={href}
      className={String.raw`flex flex-col gap-[2px] items-start px-[12px] py-[8px] rounded-[var(--radius-nav,8px)] w-full hover:bg-[var(--bg-hover,#1e2330)] transition-colors`}
    >
      <p className={String.raw`font-medium leading-normal text-[color:var(--text-secondary,#8b92a0)] text-[12px] w-full truncate`}>
        {title}
      </p>
      <p className={String.raw`font-normal leading-normal text-[color:var(--text-muted,#555c6b)] text-[11px] whitespace-nowrap`}>
        {subtitle}
      </p>
    </Link>
  );
}
