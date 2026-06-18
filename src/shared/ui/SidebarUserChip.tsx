import { Avatar } from './Avatar';

type SidebarUserChipProps = {
  name: string;
  role: string;
  initials?: string;
};

export function SidebarUserChip({ name, role, initials = 'IM' }: SidebarUserChipProps) {
  return (
    <div className={String.raw`flex gap-[10px] items-center px-[10px] py-[8px] rounded-[var(--radius-nav,8px)] w-full`}>
      <Avatar initials={initials} size="S" className="size-[28px] shrink-0" />
      <div className="flex flex-col items-start overflow-clip shrink-0">
        <p className={String.raw`font-semibold leading-normal text-[color:var(--text-primary,#f0f2f5)] text-[12px] whitespace-nowrap`}>
          {name}
        </p>
        <p className={String.raw`font-normal leading-normal text-[color:var(--text-muted,#555c6b)] text-[11px] whitespace-nowrap`}>
          {role}
        </p>
      </div>
    </div>
  );
}
