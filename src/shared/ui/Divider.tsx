import clsx from 'clsx';

type DividerProps = {
  className?: string;
  label?: string;
};

export function Divider({ className, label }: DividerProps) {
  return (
    <div
      className={clsx(
        'flex h-[10px] items-center w-full',
        label ? 'gap-[var(--spacing-12,12px)]' : 'gap-0',
        className,
      )}
    >
      <div className={String.raw`bg-[var(--border\/divider,rgba(255,255,255,0.1))] flex-[1_0_0] h-px min-w-px`} />
      {label && (
        <>
          <p className={String.raw`font-normal leading-normal shrink-0 text-[color:var(--text\/muted,#555c6b)] text-[length:var(--font\/size\/sm,12px)] text-center whitespace-nowrap`}>
            {label}
          </p>
          <div className={String.raw`bg-[var(--border\/divider,rgba(255,255,255,0.1))] flex-[1_0_0] h-px min-w-px`} />
        </>
      )}
    </div>
  );
}
