import clsx from 'clsx';

type AvatarProps = {
  className?: string;
  initials: string;
  src?: string;
  size?: 'S';
};

export function Avatar({ className, initials, src, size = 'S' }: AvatarProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center relative',
        String.raw`rounded-[var(--radius-full,9999px)]`,
        !src && 'bg-[var(--accent,#a100ff)]',
        size === 'S' && 'size-[26px]',
        className,
      )}
    >
      {src && (
        <img
          alt={initials}
          className={String.raw`absolute inset-0 max-w-none object-cover pointer-events-none rounded-[var(--radius-full,9999px)] size-full`}
          src={src}
        />
      )}
      <p
        className={clsx(
          String.raw`font-bold leading-normal relative shrink-0 text-[color:var(--text\/on-accent,white)] text-center whitespace-nowrap`,
          size === 'S' && String.raw`text-[length:var(--font\/size\/3xs,9px)]`,
        )}
      >
        {initials}
      </p>
    </div>
  );
}
