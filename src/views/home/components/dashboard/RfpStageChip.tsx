const stageStyle: Record<string, string> = {
  E1: String.raw`bg-[var(--status-neutral-dim,rgba(139,146,160,0.12))] text-[color:var(--text-secondary,#8b92a0)] border-[var(--border-default,rgba(255,255,255,0.14))]`,
  E2: String.raw`bg-[rgba(96,165,250,0.12)] text-[color:var(--status-info,#60a5fa)] border-[var(--status-info,#60a5fa)]`,
  E3: String.raw`bg-[var(--accent-dim,rgba(161,0,255,0.15))] text-[color:var(--accent,#a100ff)] border-[var(--accent,#a100ff)]`,
  E4: String.raw`bg-[var(--status-warning-dim,rgba(234,179,8,0.12))] text-[color:var(--status-warning,#eab308)] border-[var(--status-warning,#eab308)]`,
  E5: String.raw`bg-[var(--status-success-dim,rgba(34,197,94,0.12))] text-[color:var(--status-success,#22c55e)] border-[var(--status-success,#22c55e)]`,
};

export function RfpStageChip({ stage }: { stage: string | null }) {
  if (!stage) return <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px]`}>—</span>;
  const style = stageStyle[stage] ?? stageStyle['E1'];
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-[var(--radius-badge,4px)] border text-[11px] font-bold tracking-wider ${style}`}
    >
      {stage}
    </span>
  );
}
