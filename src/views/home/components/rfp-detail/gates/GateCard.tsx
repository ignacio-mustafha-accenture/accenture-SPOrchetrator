'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui';
import type { Gate, GateStatus } from '../../../domain/entities/Gate';
import { GateDecisionModal } from './GateDecisionModal';
import { formatDate } from '@/shared/lib/formatDate';

const statusVariant: Record<GateStatus, 'Neutral' | 'Accent' | 'Success' | 'Error' | 'Warning'> = {
  pending: 'Neutral',
  open: 'Accent',
  approved: 'Success',
  rejected: 'Error',
  decided: 'Success',
  expired: 'Warning',
};

export function GateCard({ gate }: { gate: Gate }) {
  const t = useTranslations('home.rfps.detail.gates');
  const [showModal, setShowModal] = useState(false);
  const canDecide = gate.status === 'pending' || gate.status === 'open';

  return (
    <>
      <div className={String.raw`rounded-[var(--radius-card,12px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] p-4`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px] font-mono`}>
              G-{gate.gateNumber}
            </span>
            {gate.isIrreversible && (
              <Badge variant="Warning">{t('irreversible')}</Badge>
            )}
          </div>
          <Badge variant={statusVariant[gate.status]}>{t(`status.${gate.status}`)}</Badge>
        </div>

        <h3 className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-semibold text-[14px] mb-3`}>
          {gate.label}
        </h3>

        {gate.decidedBy && (
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px] mb-3`}>
            {t('decidedBy')} <strong className={String.raw`text-[color:var(--text-primary,#f0f2f5)]`}>{gate.decidedBy}</strong>
            {gate.decisionDate && <> {t('on')} {formatDate(gate.decisionDate)}</>}
          </p>
        )}

        {gate.rationale && (
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px] italic mb-3 border-l-2 border-[var(--border-default,rgba(255,255,255,0.14))] pl-3`}>
            {gate.rationale}
          </p>
        )}

        {canDecide && (
          <button
            onClick={() => setShowModal(true)}
            className={String.raw`mt-1 px-4 py-1.5 rounded-[8px] bg-[var(--accent,#a100ff)] text-white text-[12px] font-semibold hover:opacity-90 transition-opacity`}
          >
            {t('btnDecide')}
          </button>
        )}
      </div>

      {showModal && (
        <GateDecisionModal gate={gate} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
