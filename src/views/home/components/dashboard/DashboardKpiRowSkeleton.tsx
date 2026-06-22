'use client';

import { motion } from 'framer-motion';

function KpiCardSkeleton({ delay }: { delay: number }) {
  return (
    <div
      className={String.raw`flex-1 min-w-[160px] rounded-[var(--radius-card-sm,12px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] p-5 relative overflow-hidden`}
    >
      {/* label placeholder */}
      <div className="h-[9px] w-[52%] rounded-full bg-[rgba(255,255,255,0.06)] mb-4" />
      {/* value placeholder */}
      <div className="h-[30px] w-[36%] rounded-[6px] bg-[rgba(255,255,255,0.06)] mb-[7px]" />
      {/* subtitle placeholder */}
      <div className="h-[9px] w-[72%] rounded-full bg-[rgba(255,255,255,0.04)]" />

      {/* shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.055) 50%, transparent 70%)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
          delay,
          repeatDelay: 0.4,
        }}
      />
    </div>
  );
}

export function DashboardKpiRowSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <KpiCardSkeleton key={i} delay={i * 0.12} />
      ))}
    </div>
  );
}
