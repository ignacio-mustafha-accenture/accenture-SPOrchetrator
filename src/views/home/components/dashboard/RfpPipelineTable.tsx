'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { Badge } from '@/shared/ui';
import type { Rfp, RfpStatus } from '../../domain/entities/Rfp';
import { RfpProgressBar } from './RfpProgressBar';
import { RfpStageChip } from './RfpStageChip';
import { RfpStageStatus } from './RfpStageStatus';
import { formatDate } from '@/shared/lib/formatDate';

const statusVariant: Record<RfpStatus, 'Neutral' | 'Accent' | 'Warning' | 'Success'> = {
  parsing: 'Neutral',
  evaluacion: 'Accent',
  aprobacion: 'Warning',
  completo: 'Success',
};

function confidenceColor(val: number | null) {
  if (val == null) return String.raw`text-[color:var(--text-secondary,#8b92a0)]`;
  if (val >= 85) return String.raw`text-[color:var(--status-success,#22c55e)] font-semibold`;
  if (val >= 70) return String.raw`text-[color:var(--status-warning,#eab308)] font-semibold`;
  return String.raw`text-[color:var(--status-error,#ef4444)] font-semibold`;
}

function formatUsd(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val}`;
}

function SortIcon({ sorted }: { sorted: 'asc' | 'desc' | false }) {
  if (sorted === 'asc') return <ChevronUp size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  if (sorted === 'desc') return <ChevronDown size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  return <ChevronsUpDown size={11} className="shrink-0 opacity-20 group-hover:opacity-50 transition-opacity" />;
}

const tableBodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const tableRowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

const col = createColumnHelper<Rfp>();
const ALL_STATUSES = ['all', 'parsing', 'evaluacion', 'aprobacion', 'completo'] as const;
type StatusFilter = (typeof ALL_STATUSES)[number];

export function RfpPipelineTable({ rfps }: { rfps: Rfp[] }) {
  const t = useTranslations('home.dashboard.pipeline');
  const tStatus = useTranslations('home.rfps.card.status');
  const ts = useTranslations('home.dashboard.stageStatus');

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const data = useMemo(() => {
    let rows = rfps;
    if (statusFilter !== 'all') rows = rows.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.rfpId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.categoryName.toLowerCase().includes(q) ||
          (r.activeAgent?.toLowerCase().includes(q) ?? false) ||
          (r.architecture?.toLowerCase().includes(q) ?? false),
      );
    }
    return rows;
  }, [rfps, statusFilter, search]);

  const columns = useMemo(
    () => [
      col.accessor('rfpId', {
        header: t('colRfp'),
        cell: (i) => (
          <Link
            href={`/home/rfps/${i.getValue()}`}
            className={String.raw`font-mono font-semibold text-[color:var(--accent,#a100ff)] hover:underline`}
          >
            {i.getValue()}
          </Link>
        ),
      }),
      col.accessor('name', {
        header: t('colName'),
        cell: (i) => (
          <Link
            href={`/home/rfps/${i.row.original.rfpId}`}
            className={String.raw`block max-w-[180px] truncate text-[color:var(--text-primary,#f0f2f5)] hover:underline`}
          >
            {i.getValue()}
          </Link>
        ),
      }),
      col.accessor('categoryName', {
        header: t('colCategory'),
        cell: (i) => (
          <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)]`}>{i.getValue()}</span>
        ),
      }),
      col.accessor('estimatedValueUsd', {
        header: t('colValue'),
        cell: (i) => (
          <span className={String.raw`font-mono text-[color:var(--text-primary,#f0f2f5)]`}>
            {formatUsd(i.getValue())}
          </span>
        ),
      }),
      col.accessor('invitedSuppliers', {
        header: t('colSuppliers'),
        cell: (i) => (
          <span className={String.raw`block text-center text-[color:var(--text-secondary,#8b92a0)]`}>
            {i.getValue()}
          </span>
        ),
      }),
      col.accessor('deadline', {
        header: t('colDeadline'),
        cell: (i) => (
          <span className={String.raw`font-mono text-[color:var(--text-secondary,#8b92a0)]`}>
            {formatDate(i.getValue())}
          </span>
        ),
      }),
      col.accessor('status', {
        header: t('colStatus'),
        cell: (i) => (
          <Badge variant={statusVariant[i.getValue()] ?? 'Neutral'}>{tStatus(i.getValue())}</Badge>
        ),
      }),
      col.accessor('progressPct', {
        header: t('colProgress'),
        cell: (i) => (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1">
              <RfpProgressBar pct={i.getValue()} />
            </div>
            <span className={String.raw`text-[11px] text-[color:var(--text-secondary,#8b92a0)] w-[32px] text-right`}>
              {i.getValue()}%
            </span>
          </div>
        ),
      }),
      col.accessor('stageStatus', {
        header: t('colStageStatus'),
        cell: (i) => (
          <RfpStageStatus status={i.getValue()} label={i.getValue() ? ts(i.getValue()!) : ''} />
        ),
        enableSorting: false,
      }),
      col.accessor('stage', {
        header: t('colStage'),
        cell: (i) => <RfpStageChip stage={i.getValue()} />,
      }),
      col.accessor('activeAgent', {
        header: t('colAgent'),
        cell: (i) => (
          <span className={String.raw`block max-w-[160px] truncate text-[color:var(--text-secondary,#8b92a0)]`}>
            {i.getValue() ?? '—'}
          </span>
        ),
      }),
      col.accessor('globalConfidence', {
        header: t('colConfidence'),
        cell: (i) => (
          <span className={`font-mono ${confidenceColor(i.getValue())}`}>
            {i.getValue() != null ? `${i.getValue()}%` : '—'}
          </span>
        ),
        sortUndefined: 'last',
      }),
      col.accessor('architecture', {
        header: t('colArchitecture'),
        cell: (i) => (
          <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)]`}>
            {i.getValue() ?? '—'}
          </span>
        ),
      }),
    ],
    [t, tStatus, ts],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <motion.div
      className={String.raw`rounded-[var(--radius-card,16px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] overflow-hidden`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
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

        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className={String.raw`absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary,#8b92a0)] pointer-events-none`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className={String.raw`w-[200px] rounded-[8px] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-base,#0a0c10)] pl-8 pr-3 py-1.5 text-[12px] text-[color:var(--text-primary,#f0f2f5)] placeholder:text-[color:var(--text-secondary,#8b92a0)] outline-none transition-colors focus:border-[var(--accent,#a100ff)]`}
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--accent,#a100ff)] text-white'
                  : String.raw`text-[color:var(--text-secondary,#8b92a0)] hover:bg-[var(--bg-hover,#1e2330)]`
              }`}
            >
              {s === 'all' ? t('filterAll') : tStatus(s)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        {visibleRows.length === 0 ? (
          <p
            className={String.raw`py-10 text-center text-[color:var(--text-secondary,#8b92a0)] text-[13px]`}
          >
            {t('empty')}
          </p>
        ) : (
          <table className="w-full text-[12px] whitespace-nowrap">
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
                        className={String.raw`px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[color:var(--text-secondary,#8b92a0)]`}
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
              {visibleRows.map((row) => (
                <motion.tr
                  key={row.id}
                  variants={tableRowVariants}
                  className={String.raw`border-b border-[var(--border-default,rgba(255,255,255,0.06))] transition-colors hover:bg-[var(--bg-hover,#1e2330)]`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        )}
      </div>

      {/* ── Footer ── */}
      {visibleRows.length > 0 && (
        <div
          className={String.raw`border-t border-[var(--border-default,rgba(255,255,255,0.06))] px-5 py-2.5`}
        >
          <span className={String.raw`text-[11px] text-[color:var(--text-secondary,#8b92a0)]`}>
            {t('rows', { count: visibleRows.length, total: rfps.length })}
          </span>
        </div>
      )}
    </motion.div>
  );
}
