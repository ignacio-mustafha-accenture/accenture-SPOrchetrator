import type { StageStatus } from '../../domain/entities/Rfp';

type StageStatusConfig = { icon: string; color: string };

const config: Record<StageStatus, StageStatusConfig> = {
  running: { icon: '▶', color: String.raw`text-[color:var(--status-success,#22c55e)]` },
  done: { icon: '✓', color: String.raw`text-[color:var(--status-success,#22c55e)]` },
  hitl: { icon: '⏸', color: String.raw`text-[color:var(--status-warning,#eab308)]` },
};

export function RfpStageStatus({ status, label }: { status: StageStatus | null; label: string }) {
  if (!status) return <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px]`}>—</span>;
  const { icon, color } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${color}`}>
      <span className="text-[11px]">{icon}</span>
      <span>{label}</span>
    </span>
  );
}
