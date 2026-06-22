import { useTranslations } from 'next-intl';
import type { Rfp } from '../../domain/entities/Rfp';
import { RfpCard } from './RfpCard';

export function RfpCardGrid({ rfps }: { rfps: Rfp[] }) {
  const t = useTranslations('home.dashboard');

  if (rfps.length === 0) {
    return (
      <div className={String.raw`flex items-center justify-center h-40 text-[color:var(--text-secondary,#8b92a0)] text-[14px]`}>
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {rfps.map((rfp) => (
        <RfpCard key={rfp.rfpId} rfp={rfp} />
      ))}
    </div>
  );
}
