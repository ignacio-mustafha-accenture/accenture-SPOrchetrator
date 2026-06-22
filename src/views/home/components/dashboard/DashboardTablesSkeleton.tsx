'use client';

import { motion } from 'framer-motion';

function Shimmer({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
      }}
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay, repeatDelay: 0.5 }}
    />
  );
}

function SkeletonBlock({ w, h = 'h-[9px]', className = '' }: { w: string; h?: string; className?: string }) {
  return <div className={`${h} ${w} rounded-full bg-[rgba(255,255,255,0.06)] ${className}`} />;
}

function PipelineTableSkeleton() {
  const rowWidths = [
    ['w-[10%]', 'w-[22%]', 'w-[14%]', 'w-[8%]', 'w-[6%]', 'w-[10%]', 'w-[9%]', 'w-[11%]'],
    ['w-[10%]', 'w-[18%]', 'w-[16%]', 'w-[8%]', 'w-[6%]', 'w-[10%]', 'w-[9%]', 'w-[13%]'],
    ['w-[10%]', 'w-[20%]', 'w-[12%]', 'w-[8%]', 'w-[6%]', 'w-[10%]', 'w-[9%]', 'w-[10%]'],
    ['w-[10%]', 'w-[15%]', 'w-[18%]', 'w-[8%]', 'w-[6%]', 'w-[10%]', 'w-[9%]', 'w-[14%]'],
    ['w-[10%]', 'w-[19%]', 'w-[14%]', 'w-[8%]', 'w-[6%]', 'w-[10%]', 'w-[9%]', 'w-[11%]'],
  ];

  return (
    <div className={String.raw`rounded-[var(--radius-card,16px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] overflow-hidden relative`}>
      <Shimmer delay={0} />

      {/* header */}
      <div className={String.raw`px-5 py-3.5 border-b border-[var(--border-default,rgba(255,255,255,0.14))] flex items-center gap-3`}>
        <SkeletonBlock w="w-[72px]" h="h-[11px]" />
        <div className="ml-auto flex items-center gap-2">
          {/* search box */}
          <div className="w-[160px] h-[28px] rounded-[8px] bg-[rgba(255,255,255,0.05)]" />
          {/* filter pills */}
          {[48, 58, 70, 66, 62].map((w, i) => (
            <div key={i} className={`w-[${w}px] h-[24px] rounded-[6px] bg-[rgba(255,255,255,0.05)]`} style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* thead */}
      <div className={String.raw`px-4 py-2.5 border-b border-[var(--border-default,rgba(255,255,255,0.10))] flex items-center gap-6`}>
        {[10, 18, 14, 8, 6, 10, 9, 11].map((pct, i) => (
          <div key={i} className="h-[8px] rounded-full bg-[rgba(255,255,255,0.05)]" style={{ width: `${pct}%` }} />
        ))}
      </div>

      {/* rows */}
      {rowWidths.map((cols, ri) => (
        <div
          key={ri}
          className={String.raw`px-4 py-3 flex items-center gap-6 border-b border-[var(--border-default,rgba(255,255,255,0.05))] last:border-0`}
        >
          {cols.map((w, ci) => (
            <div key={ci} className={`h-[10px] rounded-full bg-[rgba(255,255,255,0.06)] ${w}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ActivityLogSkeleton() {
  const rowWidths = [
    ['w-[8%]', 'w-[8%]', 'w-[55%]'],
    ['w-[8%]', 'w-[8%]', 'w-[45%]'],
    ['w-[8%]', 'w-[8%]', 'w-[60%]'],
    ['w-[8%]', 'w-[8%]', 'w-[50%]'],
    ['w-[8%]', 'w-[8%]', 'w-[42%]'],
  ];

  return (
    <div className={String.raw`rounded-[var(--radius-card,16px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] overflow-hidden relative`}>
      <Shimmer delay={0.2} />

      {/* header */}
      <div className={String.raw`px-5 py-3.5 border-b border-[var(--border-default,rgba(255,255,255,0.14))] flex items-center gap-3`}>
        <SkeletonBlock w="w-[100px]" h="h-[11px]" />
        <div className="ml-auto flex items-center gap-1.5">
          {[36, 28, 34, 30, 28].map((w, i) => (
            <div key={i} className="h-[24px] rounded-[6px] bg-[rgba(255,255,255,0.05)]" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* thead */}
      <div className={String.raw`px-5 py-2 border-b border-[var(--border-default,rgba(255,255,255,0.10))] flex items-center gap-6`}>
        {[8, 8, 50].map((pct, i) => (
          <div key={i} className="h-[8px] rounded-full bg-[rgba(255,255,255,0.05)]" style={{ width: `${pct}%` }} />
        ))}
      </div>

      {/* rows */}
      {rowWidths.map((cols, ri) => (
        <div
          key={ri}
          className={String.raw`px-5 py-2.5 flex items-center gap-6 border-b border-[var(--border-default,rgba(255,255,255,0.05))] last:border-0`}
        >
          {cols.map((w, ci) => (
            <div key={ci} className={`h-[10px] rounded-full bg-[rgba(255,255,255,0.06)] ${w}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardTablesSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <PipelineTableSkeleton />
      <ActivityLogSkeleton />
    </div>
  );
}
