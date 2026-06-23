import { getTranslations } from 'next-intl/server';

import type { Rfp } from '../../domain/entities/Rfp';
import { DashboardKpiRowAnimated } from './DashboardKpiRowAnimated';
import type { DashboardKpiCardProps } from './DashboardKpiCard';

type Props = { rfps: Rfp[] };

export async function DashboardKpiRow({ rfps }: Props) {
  const t = await getTranslations('home.dashboard.kpi');

  const activeRfps = rfps.length;
  const processedProposals = rfps.reduce((acc, r) => acc + r.invitedSuppliers, 0);
  const hitlApprovals = rfps.filter((r) => r.stageStatus === 'hitl').length;

  const cards: DashboardKpiCardProps[] = [
    { label: t('rfpsActivos'),   value: activeRfps,          subtitle: t('rfpsActivosSub') },
    { label: t('propuestas'),    value: processedProposals,  subtitle: t('propuestasSub') },
    { label: t('aprobaciones'),  value: hitlApprovals,       subtitle: t('aprobacionesSub'), highlighted: hitlApprovals > 0 },
    { label: t('ciclo'),         value: '-58%',              subtitle: t('cicloSub'), valueSuccess: true },
    { label: t('issues'),        value: 0,                   subtitle: t('issuesSub') },
  ];

  return <DashboardKpiRowAnimated cards={cards} />;
}
