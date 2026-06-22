'use client';

import { motion } from 'framer-motion';
import { DashboardKpiCard, type DashboardKpiCardProps } from './DashboardKpiCard';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' as const } },
};

export function DashboardKpiRowAnimated({ cards }: { cards: DashboardKpiCardProps[] }) {
  return (
    <motion.div
      className="flex flex-wrap gap-3"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, i) => (
        <motion.div key={i} variants={item} className="flex-1 min-w-[160px]">
          <DashboardKpiCard {...card} />
        </motion.div>
      ))}
    </motion.div>
  );
}
