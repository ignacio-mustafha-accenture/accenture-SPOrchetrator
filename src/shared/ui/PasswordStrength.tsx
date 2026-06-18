import clsx from 'clsx';

type PasswordStrengthLevel = '1-Weak' | '2-Fair' | '3-Good' | '4-Strong';

type PasswordStrengthProps = {
  className?: string;
  level?: PasswordStrengthLevel;
};

const levelConfig: Record<PasswordStrengthLevel, { filled: number; color: string; label: string }> = {
  '1-Weak': { filled: 1, color: String.raw`bg-[var(--status\/error,#ef4444)]`, label: 'Muy débil / Weak' },
  '2-Fair': { filled: 2, color: String.raw`bg-[var(--status\/warning,#eab308)]`, label: 'Regular / Fair' },
  '3-Good': { filled: 3, color: String.raw`bg-[var(--status\/info,#60a5fa)]`, label: 'Buena / Good' },
  '4-Strong': { filled: 4, color: String.raw`bg-[var(--status\/success,#22c55e)]`, label: 'Fuerte / Strong' },
};

const textColors: Record<PasswordStrengthLevel, string> = {
  '1-Weak': String.raw`text-[color:var(--status\/error,#ef4444)]`,
  '2-Fair': String.raw`text-[color:var(--status\/warning,#eab308)]`,
  '3-Good': String.raw`text-[color:var(--status\/info,#60a5fa)]`,
  '4-Strong': String.raw`text-[color:var(--status\/success,#22c55e)]`,
};

export function PasswordStrength({ className, level = '1-Weak' }: PasswordStrengthProps) {
  const config = levelConfig[level];
  const emptyBar = String.raw`bg-[var(--border\/subtle,rgba(255,255,255,0.07))]`;

  return (
    <div className={clsx('flex flex-col gap-[var(--spacing\\/6,6px)] items-start', className)}>
      <div className="flex gap-[var(--spacing-4,4px)] items-start shrink-0">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={clsx(
              String.raw`h-[4px] rounded-[var(--radius\/xs,2px)] shrink-0 w-[48px]`,
              i < config.filled ? config.color : emptyBar,
            )}
          />
        ))}
      </div>
      <p className={clsx(String.raw`font-normal leading-normal shrink-0 text-[length:var(--font\/size\/xs,11px)] whitespace-nowrap`, textColors[level])}>
        {config.label}
      </p>
    </div>
  );
}
