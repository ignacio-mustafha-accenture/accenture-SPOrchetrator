'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Rfp } from '../../domain/entities/Rfp';
import { RfpStatusBadge } from '../dashboard/RfpStatusBadge';
import { formatDate } from '@/shared/lib/formatDate';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export function RfpDetailHeader({ rfp }: { rfp: Rfp }) {
  const t = useTranslations('home.rfps.detail.header');
  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rfp.estimatedValueUsd);

  return (
    <motion.div
      className={String.raw`border-b border-[var(--border-default,rgba(255,255,255,0.14))] pb-5 mb-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-start justify-between gap-4 mb-4" variants={itemVariants}>
        <div>
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] uppercase tracking-wider font-medium mb-1`}>
            {rfp.categoryName} · {rfp.rfpId}
          </p>
          <h1 className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-bold text-[22px] leading-snug`}>
            {rfp.name}
          </h1>
        </div>
        <RfpStatusBadge status={rfp.status} />
      </motion.div>

      <motion.div className={String.raw`flex flex-wrap gap-6 text-[13px]`} variants={itemVariants}>
        <div>
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] mb-0.5`}>{t('estimatedValue')}</p>
          <p className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-semibold`}>{value}</p>
        </div>
        <div>
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] mb-0.5`}>{t('deadline')}</p>
          <p className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-semibold`}>{formatDate(rfp.deadline)}</p>
        </div>
        <div>
          <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] mb-0.5`}>{t('invitedSuppliers')}</p>
          <p className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-semibold`}>{rfp.invitedSuppliers}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
