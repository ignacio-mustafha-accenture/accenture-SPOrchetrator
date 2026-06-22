export type DashboardKpiCardProps = {
  label: string;
  value: string | number;
  subtitle: string;
  highlighted?: boolean;
  valueSuccess?: boolean;
};

export function DashboardKpiCard({ label, value, subtitle, highlighted, valueSuccess }: DashboardKpiCardProps) {
  return (
    <div
      className={String.raw`w-full rounded-[var(--radius-card-sm,12px)] border border-solid p-5 ${
        highlighted
          ? String.raw`border-[var(--status-warning,#eab308)] bg-[var(--status-warning-dim,rgba(234,179,8,0.12))]`
          : String.raw`border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)]`
      }`}
    >
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] font-medium uppercase tracking-wider mb-3`}>
        {label}
      </p>
      <p
        className={String.raw`font-bold text-[28px] leading-none mb-1 ${
          valueSuccess
            ? String.raw`text-[color:var(--status-success,#22c55e)]`
            : String.raw`text-[color:var(--text-primary,#f0f2f5)]`
        }`}
      >
        {value}
      </p>
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px]`}>{subtitle}</p>
    </div>
  );
}
