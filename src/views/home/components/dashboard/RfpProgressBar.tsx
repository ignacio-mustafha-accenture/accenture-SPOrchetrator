export function RfpProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className={String.raw`w-full h-[4px] rounded-full bg-[var(--border-default,rgba(255,255,255,0.14))]`}>
      <div
        className={String.raw`h-full rounded-full bg-[var(--accent,#a100ff)] transition-all`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
