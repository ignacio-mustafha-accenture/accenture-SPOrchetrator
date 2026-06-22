function scoreColor(score: number): string {
  if (score >= 70) return String.raw`bg-[rgba(34,197,94,0.18)] text-[color:var(--status-success,#22c55e)]`;
  if (score >= 40) return String.raw`bg-[rgba(234,179,8,0.18)] text-[color:var(--status-warning,#eab308)]`;
  return String.raw`bg-[rgba(239,68,68,0.18)] text-[color:var(--status-error,#ef4444)]`;
}

export function ScoreCell({ score }: { score: number | null }) {
  if (score === null) {
    return <span className={String.raw`text-[12px] text-[color:var(--text-secondary,#8b92a0)]`}>—</span>;
  }
  return (
    <span className={`inline-block rounded-[4px] px-2 py-0.5 text-[12px] font-semibold ${scoreColor(score)}`}>
      {score.toFixed(0)}
    </span>
  );
}
