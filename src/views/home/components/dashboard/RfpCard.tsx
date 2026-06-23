import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { formatDate } from '@/shared/lib/formatDate';

import type { Rfp } from '../../domain/entities/Rfp';
import { RfpStatusBadge } from './RfpStatusBadge';
import { RfpProgressBar } from './RfpProgressBar';

export function RfpCard({ rfp }: { rfp: Rfp }) {
  const t = useTranslations('home.rfps.card');
  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rfp.estimatedValueUsd);

  return (
    <Link
      href={`/home/rfps/${rfp.rfpId}`}
      className={String.raw`block rounded-[var(--radius-card,12px)] border border-solid border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] p-5 hover:border-[var(--accent,#a100ff)] transition-colors`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] font-medium uppercase tracking-wider truncate`}>
            {rfp.categoryName}
          </p>
          <h3 className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-semibold text-[15px] leading-snug mt-0.5 truncate`}>
            {rfp.name}
          </h3>
        </div>
        <RfpStatusBadge status={rfp.status} />
      </div>

      <div className="mb-3">
        <div className={String.raw`flex justify-between text-[11px] mb-1.5 text-[color:var(--text-secondary,#8b92a0)]`}>
          <span>{t('progress')}</span>
          <span>{rfp.progressPct}%</span>
        </div>
        <RfpProgressBar pct={rfp.progressPct} />
      </div>

      <div className={String.raw`flex items-center justify-between text-[12px] text-[color:var(--text-secondary,#8b92a0)]`}>
        <span>{value}</span>
        <div className="flex items-center gap-3">
          <span>{t('suppliers', { count: rfp.invitedSuppliers })}</span>
          <span>{t('due', { date: formatDate(rfp.deadline) })}</span>
        </div>
      </div>
    </Link>
  );
}
