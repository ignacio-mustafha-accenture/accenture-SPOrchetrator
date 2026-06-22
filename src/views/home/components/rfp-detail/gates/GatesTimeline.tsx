'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Gate } from '../../../domain/entities/Gate';
import { GateCard } from './GateCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
};

export function GatesTimeline({ gates }: { gates: Gate[] }) {
  const t = useTranslations('home.rfps.detail.gates');

  if (gates.length === 0) {
    return <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] py-6`}>{t('empty')}</p>;
  }

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {gates.map((gate) => (
        <motion.div key={gate.gateId} variants={cardVariants}>
          <GateCard gate={gate} />
        </motion.div>
      ))}
    </motion.div>
  );
}
