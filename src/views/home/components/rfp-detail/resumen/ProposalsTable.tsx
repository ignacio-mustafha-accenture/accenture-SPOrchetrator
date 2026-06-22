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
import { Badge } from '@/shared/ui';
import type { Proposal, ProposalStatus } from '../../../domain/entities/Proposal';
import { formatDate } from '@/shared/lib/formatDate';

const statusVariant: Record<ProposalStatus, 'Success' | 'Warning' | 'Neutral' | 'Error'> = {
  confirmed: 'Success',
  review: 'Warning',
  pending: 'Neutral',
  rejected: 'Error',
};

const ALL_STATUSES = ['all', 'confirmed', 'review', 'pending', 'rejected'] as const;
type StatusFilter = (typeof ALL_STATUSES)[number];

function SortIcon({ sorted }: { sorted: 'asc' | 'desc' | false }) {
  if (sorted === 'asc')  return <ChevronUp   size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  if (sorted === 'desc') return <ChevronDown size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  return <ChevronsUpDown size={11} className="shrink-0 opacity-20 group-hover:opacity-50 transition-opacity" />;
}

const tbodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const trVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

const col = createColumnHelper<Proposal>();

export function ProposalsTable({ proposals }: { proposals: Proposal[] }) {
  const t = useTranslations('home.rfps.detail.proposals');

  const [sorting, setSorting] = useState<SortingState>([{ id: 'submissionDate', desc: true }]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const data = useMemo(
    () => statusFilter === 'all' ? proposals : proposals.filter((p) => p.status === statusFilter),
    [proposals, statusFilter],
  );

  const columns = useMemo(
    () => [
      col.accessor('supplierName', {
        header: t('colSupplier'),
        cell: (i) => <span className="text-[13px]">{i.getValue()}</span>,
      }),
      col.accessor('submissionDate', {
        header: t('colDate'),
        cell: (i) => (
          <span className={String.raw`font-mono text-[12px] text-[color:var(--text-secondary,#8b92a0)]`}>
            {formatDate(i.getValue())}
          </span>
        ),
      }),
      col.accessor('globalConfidence', {
        header: t('colConfidence'),
        cell: (i) => (
          <span className="font-mono text-[12px]">
            {(Number(i.getValue()) * 100).toFixed(0)}%
          </span>
        ),
      }),
      col.accessor('status', {
        header: t('colStatus'),
        cell: (i) => (
          <Badge variant={statusVariant[i.getValue()]} size="sm">{t(`status.${i.getValue()}`)}</Badge>
        ),
        sortingFn: (a, b) =>
          ALL_STATUSES.indexOf(a.original.status) - ALL_STATUSES.indexOf(b.original.status),
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

  if (proposals.length === 0) {
    return (
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] py-6`}>
        {t('empty')}
      </p>
    );
  }

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        className="flex items-center gap-1 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
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
            {s === 'all' ? t('filterAll') : t(`status.${s}`)}
          </button>
        ))}
      </motion.div>

      {rows.length === 0 ? (
        <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] py-4`}>
          {t('empty')}
        </p>
      ) : (
        <div className={String.raw`overflow-x-auto overflow-hidden rounded-[var(--radius-card,12px)] border border-[var(--border-default,rgba(255,255,255,0.14))]`}>
          <table className="w-full border-collapse">
            <thead className={String.raw`bg-[var(--bg-elevated,#181c23)] border-b border-[var(--border-default,rgba(255,255,255,0.14))]`}>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={String.raw`px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[color:var(--text-secondary,#8b92a0)]`}
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
            <motion.tbody variants={tbodyVariants} initial="hidden" animate="visible">
              {rows.map((row) => (
                <motion.tr
                  key={row.id}
                  variants={trVariants}
                  className={String.raw`border-b border-[var(--border-default,rgba(255,255,255,0.08))] hover:bg-[var(--bg-elevated,#181c23)] transition-colors last:border-0`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={String.raw`px-4 py-3 text-[13px] text-[color:var(--text-primary,#f0f2f5)]`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
}
