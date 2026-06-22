'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Proposal } from '../../domain/entities/Proposal';
import type { Rfp } from '../../domain/entities/Rfp';
import type { RiskSupplier } from '../../domain/entities/Risk';
import type { ScoreSupplier } from '../../domain/entities/Score';
import type { Supplier } from '../../domain/entities/Supplier';
import type { Variable } from '../../domain/entities/Variable';
import type { Gate } from '../../domain/entities/Gate';
import { ProposalsTable } from './resumen/ProposalsTable';
import { SuppliersTable } from './suppliers/SuppliersTable';
import { ScoreMatrix } from './scores/ScoreMatrix';
import { VariablesSection } from './variables/VariablesSection';
import { RiskHeatmap } from './risk/RiskHeatmap';
import { GatesTimeline } from './gates/GatesTimeline';

type Tab = 'resumen' | 'suppliers' | 'scores' | 'variables' | 'risk' | 'gates';

export function RfpDetailTabs({
  rfp,
  suppliers,
  proposals,
  scores,
  variables,
  risks,
  gates,
}: {
  rfp: Rfp;
  suppliers: Supplier[];
  proposals: Proposal[];
  scores: ScoreSupplier[];
  variables: Variable[];
  risks: RiskSupplier[];
  gates: Gate[];
}) {
  const t = useTranslations('home.rfps.detail.tabs');
  const [active, setActive] = useState<Tab>('resumen');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'resumen', label: t('resumen') },
    { key: 'suppliers', label: t('suppliers') },
    { key: 'scores', label: t('scores') },
    { key: 'variables', label: t('variables') },
    { key: 'risk', label: t('risk') },
    { key: 'gates', label: t('gates') },
  ];

  return (
    <div>
      {/* Tab nav */}
      <motion.div
        className={String.raw`flex gap-1 border-b border-[var(--border-default,rgba(255,255,255,0.14))] mb-6 overflow-x-auto`}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05, staggerDirection: -1 } } }}
      >
        {tabs.map(({ key, label }) => (
          <motion.button
            key={key}
            onClick={() => setActive(key)}
            variants={{
              hidden: { opacity: 0, x: 18 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
            }}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === key
                ? String.raw`border-[var(--accent,#a100ff)] text-[color:var(--accent,#a100ff)]`
                : String.raw`border-transparent text-[color:var(--text-secondary,#8b92a0)] hover:text-[color:var(--text-primary,#f0f2f5)]`
            }`}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab content */}
      <div>
        {active === 'resumen' && <ProposalsTable proposals={proposals} />}
        {active === 'suppliers' && <SuppliersTable suppliers={suppliers} />}
        {active === 'scores' && <ScoreMatrix scores={scores} />}
        {active === 'variables' && (
          <VariablesSection variables={variables} suppliers={suppliers} />
        )}
        {active === 'risk' && <RiskHeatmap risks={risks} />}
        {active === 'gates' && <GatesTimeline gates={gates} />}
      </div>
    </div>
  );
}
