'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type LogLevel = 'OK' | 'INFO' | 'WARN' | 'ERR';

type ActivityEntry = {
  time: string;
  level: LogLevel;
  message: string;
};

const DEMO_ENTRIES: ActivityEntry[] = [
  { time: '09:41', level: 'WARN', message: 'RFP-001 · Gate 1 awaiting HITL approval — TCO Engine confidence 94%' },
  { time: '09:38', level: 'OK',   message: 'RFP-004 · Insights Agent completed stage E5 — confidence 96%' },
  { time: '09:22', level: 'OK',   message: 'RFP-002 · Technical Evaluator finished stage E2 — 3 suppliers scored' },
  { time: '09:15', level: 'INFO', message: 'RFP-003 · Parser · Extractor running stage E1 — 5 docs ingested' },
  { time: '08:57', level: 'OK',   message: 'RFP-001 · TCO Engine scored 5 proposals across 10 dimensions' },
  { time: '08:44', level: 'INFO', message: 'System · Google Sheets sync completed — 4 RFPs refreshed' },
  { time: '08:30', level: 'WARN', message: 'RFP-003 · Low confidence (78%) detected — review recommended' },
];

const LEVEL_ORDER: Record<LogLevel, number> = { ERR: 0, WARN: 1, INFO: 2, OK: 3 };

const levelStyle: Record<LogLevel, string> = {
  OK:   String.raw`text-[color:var(--status-success,#22c55e)]`,
  INFO: String.raw`text-[color:var(--text-secondary,#8b92a0)]`,
  WARN: String.raw`text-[color:var(--status-warning,#eab308)]`,
  ERR:  String.raw`text-[color:var(--status-error,#ef4444)]`,
};

const levelDot: Record<LogLevel, string> = {
  OK:   'bg-[var(--status-success,#22c55e)]',
  INFO: 'bg-[var(--text-secondary,#8b92a0)]',
  WARN: 'bg-[var(--status-warning,#eab308)]',
  ERR:  'bg-[var(--status-error,#ef4444)]',
};

const ALL_LEVELS = ['all', 'OK', 'INFO', 'WARN', 'ERR'] as const;
type LevelFilter = (typeof ALL_LEVELS)[number];

function SortIcon({ sorted }: { sorted: 'asc' | 'desc' | false }) {
  if (sorted === 'asc')  return <ChevronUp   size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  if (sorted === 'desc') return <ChevronDown size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  return <ChevronsUpDown size={11} className="shrink-0 opacity-20 group-hover:opacity-50 transition-opacity" />;
}

const tableBodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};
const tableRowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

const col = createColumnHelper<ActivityEntry>();

export function RecentActivityLog() {
  const t = useTranslations('home.dashboard.activity');

  const [sorting, setSorting] = useState<SortingState>([{ id: 'time', desc: true }]);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  const data = useMemo(
    () => (levelFilter === 'all' ? DEMO_ENTRIES : DEMO_ENTRIES.filter((e) => e.level === levelFilter)),
    [levelFilter],
  );

  const columns = useMemo(
    () => [
      col.accessor('time', {
        header: t('colTime'),
        cell: (i) => (
          <span className={String.raw`font-mono text-[color:var(--text-secondary,#8b92a0)]`}>
            {i.getValue()}
          </span>
        ),
      }),
      col.accessor('level', {
        header: t('colLevel'),
        sortingFn: (a, b) =>
          LEVEL_ORDER[a.original.level] - LEVEL_ORDER[b.original.level],
        cell: (i) => {
          const lvl = i.getValue();
          return (
            <span className={`flex items-center gap-1.5 font-bold ${levelStyle[lvl]}`}>
              <span className={`size-[6px] rounded-full shrink-0 ${levelDot[lvl]}`} />
              {lvl}
            </span>
          );
        },
      }),
      col.accessor('message', {
        header: t('colMessage'),
        enableSorting: false,
        cell: (i) => (
          <span className={String.raw`text-[color:var(--text-primary,#f0f2f5)]`}>{i.getValue()}</span>
        ),
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <motion.div
      className={String.raw`rounded-[var(--radius-card,16px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] overflow-hidden`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
    >
      {/* ── Header ── */}
      <div
        className={String.raw`px-5 py-3.5 border-b border-[var(--border-default,rgba(255,255,255,0.14))] flex flex-wrap items-center gap-3`}
      >
        <h2
          className={String.raw`text-[color:var(--text-primary,#f0f2f5)] text-[13px] font-semibold uppercase tracking-wider mr-auto`}
        >
          {t('title')}
        </h2>

        {/* Level filter pills */}
        <div className="flex items-center gap-1">
          {ALL_LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
                levelFilter === lvl
                  ? 'bg-[var(--accent,#a100ff)] text-white'
                  : String.raw`text-[color:var(--text-secondary,#8b92a0)] hover:bg-[var(--bg-hover,#1e2330)]`
              }`}
            >
              {lvl !== 'all' && levelFilter !== lvl && (
                <span className={`size-[5px] rounded-full shrink-0 ${levelDot[lvl as LogLevel]}`} />
              )}
              {lvl === 'all' ? t('filterAll') : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className={String.raw`border-b border-[var(--border-default,rgba(255,255,255,0.14))]`}
              >
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={String.raw`px-5 py-2 text-left text-[11px] font-medium text-[color:var(--text-secondary,#8b92a0)]`}
                    >
                      {canSort ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="group flex items-center gap-1 hover:text-[color:var(--text-primary,#f0f2f5)] transition-colors"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortIcon sorted={sorted} />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <motion.tbody variants={tableBodyVariants} initial="hidden" animate="visible">
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                variants={tableRowVariants}
                className={String.raw`border-b border-[var(--border-default,rgba(255,255,255,0.06))] transition-colors hover:bg-[var(--bg-hover,#1e2330)]`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
