import type { RiskRating } from '../../../domain/entities/Risk';

const ratingStyle: Record<RiskRating, string> = {
  Bajo:    String.raw`bg-[rgba(34,197,94,0.18)] text-[color:var(--status-success,#22c55e)]`,
  Medio:   String.raw`bg-[rgba(234,179,8,0.18)] text-[color:var(--status-warning,#eab308)]`,
  Alto:    String.raw`bg-[rgba(249,115,22,0.18)] text-[color:#f97316]`,
  Crítico: String.raw`bg-[rgba(239,68,68,0.18)] text-[color:var(--status-error,#ef4444)]`,
};

export function RiskCell({ rating, label }: { rating: RiskRating; label: string }) {
  return (
    <span className={`inline-block rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${ratingStyle[rating]}`}>
      {label}
    </span>
  );
}
