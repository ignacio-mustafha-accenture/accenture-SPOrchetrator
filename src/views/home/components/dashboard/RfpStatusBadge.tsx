import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/ui';

import type { RfpStatus } from '../../domain/entities/Rfp';

const variantMap: Record<RfpStatus, 'Neutral' | 'Accent' | 'Warning' | 'Success'> = {
  parsing: 'Neutral',
  evaluacion: 'Accent',
  aprobacion: 'Warning',
  completo: 'Success',
};

export function RfpStatusBadge({ status }: { status: RfpStatus }) {
  const t = useTranslations('home.rfps.card.status');
  return <Badge variant={variantMap[status] ?? 'Neutral'}>{t(status)}</Badge>;
}
