'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import type { Rfp, StageStatus } from '../../domain/entities/Rfp';

type StageState = StageStatus | 'idle';

type StageConfig = {
  code: string;
  titleKey: string;
  subKey: string;
};

const STAGES: StageConfig[] = [
  { code: 'E1', titleKey: 'e1.title', subKey: 'e1.sub' },
  { code: 'E2', titleKey: 'e2.title', subKey: 'e2.sub' },
  { code: 'E3', titleKey: 'e3.title', subKey: 'e3.sub' },
  { code: 'E4', titleKey: 'e4.title', subKey: 'e4.sub' },
  { code: 'E5', titleKey: 'e5.title', subKey: 'e5.sub' },
];

function inferCurrentStage(rfp: Rfp): { stageNum: number; stageStatus: StageState } {
  switch (rfp.status) {
    case 'parsing':
      return { stageNum: 1, stageStatus: 'running' };
    case 'evaluacion': {
      const pct = rfp.progressPct ?? 0;
      if (pct <= 20) return { stageNum: 1, stageStatus: 'running' };
      if (pct <= 40) return { stageNum: 2, stageStatus: 'running' };
      if (pct <= 65) return { stageNum: 3, stageStatus: 'running' };
      if (pct <= 85) return { stageNum: 4, stageStatus: 'running' };
      return { stageNum: 5, stageStatus: 'running' };
    }
    case 'aprobacion':
      return { stageNum: 5, stageStatus: 'hitl' };
    case 'completo':
      return { stageNum: 5, stageStatus: 'done' };
    default:
      return { stageNum: 1, stageStatus: 'running' };
  }
}

function resolveStageStates(rfp: Rfp): StageState[] {
  const hasExplicitStage = !!rfp.stage;
  const current = hasExplicitStage
    ? parseInt(rfp.stage!.replace('E', ''), 10)
    : inferCurrentStage(rfp).stageNum;
  const currentState = hasExplicitStage
    ? (rfp.stageStatus ?? 'running')
    : inferCurrentStage(rfp).stageStatus;

  return STAGES.map((_, i) => {
    const n = i + 1;
    if (n < current) return 'done';
    if (n === current) return currentState;
    return 'idle';
  });
}

const stateStyles: Record<StageState, { border: string; bg: string; codeColor: string; statusColor: string; borderStyle: string }> = {
  done: {
    border: String.raw`border-[var(--status-success,#22c55e)]`,
    bg: String.raw`bg-[rgba(34,197,94,0.07)]`,
    codeColor: String.raw`text-[color:var(--status-success,#22c55e)]`,
    statusColor: String.raw`text-[color:var(--status-success,#22c55e)]`,
    borderStyle: 'border-solid',
  },
  running: {
    border: String.raw`border-[var(--accent,#a100ff)]`,
    bg: String.raw`bg-[rgba(161,0,255,0.10)]`,
    codeColor: String.raw`text-[color:var(--accent,#a100ff)]`,
    statusColor: String.raw`text-[color:var(--accent,#a100ff)]`,
    borderStyle: 'border-solid',
  },
  hitl: {
    border: String.raw`border-[var(--status-warning,#eab308)]`,
    bg: String.raw`bg-[rgba(234,179,8,0.09)]`,
    codeColor: String.raw`text-[color:var(--status-warning,#eab308)]`,
    statusColor: String.raw`text-[color:var(--status-warning,#eab308)]`,
    borderStyle: 'border-dashed',
  },
  idle: {
    border: String.raw`border-[var(--border-default,rgba(255,255,255,0.14))]`,
    bg: String.raw`bg-[var(--bg-surface,#111318)]`,
    codeColor: String.raw`text-[color:var(--text-secondary,#8b92a0)]`,
    statusColor: String.raw`text-[color:var(--text-secondary,#8b92a0)]`,
    borderStyle: 'border-solid',
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const cardsVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

function RunningDot() {
  return (
    <span className="relative inline-flex h-2 w-2 mr-1.5">
      <span className={String.raw`animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent,#a100ff)] opacity-60`} />
      <span className={String.raw`relative inline-flex rounded-full h-2 w-2 bg-[var(--accent,#a100ff)]`} />
    </span>
  );
}

export function RfpPipelineStrip({ rfp }: { rfp: Rfp }) {
  const t = useTranslations('home.dashboard.pipelineStrip');
  const states = resolveStageStates(rfp);
  const inferredStageNum = rfp.stage
    ? parseInt(rfp.stage.replace('E', ''), 10)
    : inferCurrentStage(rfp).stageNum;

  return (
    <motion.div
      className={String.raw`rounded-[var(--radius-card,16px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] p-5 mb-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] font-medium uppercase tracking-wider mb-4`}>
        {t('title')}
      </p>

      <motion.div className="flex gap-0" variants={cardsVariants} initial="hidden" animate="visible">
        {STAGES.map((stage, i) => {
          const state = states[i];
          const s = stateStyles[state];
          const isLast = i === STAGES.length - 1;
          const isCurrent = (i + 1) === inferredStageNum;
          const statusLabel = isCurrent && rfp.activeAgent && state === 'running'
            ? rfp.activeAgent
            : t(`state.${state}` as Parameters<typeof t>[0]);

          return (
            <motion.div key={stage.code} className="flex flex-1 items-stretch min-w-0" variants={cardVariants}>
              <div
                className={`flex-1 flex flex-col p-3.5 border ${s.borderStyle} ${s.border} ${s.bg} rounded-[var(--radius-card-sm,10px)] min-w-0`}
              >
                <span className={`font-mono text-[10px] font-bold tracking-widest mb-2 ${s.codeColor}`}>
                  {stage.code}
                </span>
                <span className={String.raw`text-[color:var(--text-primary,#f0f2f5)] text-[12px] font-semibold leading-snug mb-0.5`}>
                  {t(stage.titleKey as Parameters<typeof t>[0])}
                </span>
                <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[10px] leading-snug mb-3`}>
                  {t(stage.subKey as Parameters<typeof t>[0])}
                </span>
                <span className={`text-[10px] font-bold font-mono mt-auto flex items-center ${s.statusColor}`}>
                  {state === 'running' && <RunningDot />}
                  {statusLabel}
                </span>
              </div>

              {!isLast && (
                <div className="flex items-center px-1.5 flex-shrink-0">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <path d="M1 1L8 6L1 11" stroke={state === 'done' ? 'var(--status-success,#22c55e)' : 'rgba(255,255,255,0.18)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
