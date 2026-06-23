'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Row,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

import type { ScoreSupplier } from '../../../domain/entities/Score';
import { ScoreCell } from './ScoreCell';

type ScoreRow = Record<string, number | null | string>;

function SortIcon({ sorted }: { sorted: 'asc' | 'desc' | false }) {
  if (sorted === 'asc')  return <ChevronUp   size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  if (sorted === 'desc') return <ChevronDown size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  return <ChevronsUpDown size={11} className="shrink-0 opacity-20 group-hover:opacity-50 transition-opacity" />;
}

const tbodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};
const trVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function ScoreMatrix({ scores }: { scores: ScoreSupplier[] }) {
  const t = useTranslations('home.rfps.detail.scores');
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo<ScoreRow[]>(() => {
    if (scores.length === 0) return [];
    const dimensions = scores[0].dimensions.map((d) => d.dimensionName);
    return dimensions.map((dimName) => {
      const row: ScoreRow = { dimensionName: dimName };
      for (const supplier of scores) {
        const dim = supplier.dimensions.find((d) => d.dimensionName === dimName);
        row[supplier.supplierId] = dim != null ? Number(dim.score) : null;
      }
      return row;
    });
  }, [scores]);

  const columns = useMemo<ColumnDef<ScoreRow>[]>(
    () => [
      {
        id: 'dimensionName',
        accessorFn: (row) => row.dimensionName as string,
        header: () => t('colDimension'),
        cell: ({ getValue }) => (
          <span className={String.raw`text-[13px] text-[color:var(--text-primary,#f0f2f5)]`}>
            {getValue() as string}
          </span>
        ),
      },
      ...scores.map((s) => ({
        id: s.supplierId,
        accessorFn: (row: ScoreRow) => row[s.supplierId] as number | null,
        header: () => s.supplierName,
        cell: ({ getValue }: { getValue: () => unknown }) => (
          <div className="flex justify-center">
            <ScoreCell score={getValue() as number | null} />
          </div>
        ),
        sortingFn: (a: Row<ScoreRow>, b: Row<ScoreRow>) => {
          const va = (a.original[s.supplierId] as number | null) ?? -Infinity;
          const vb = (b.original[s.supplierId] as number | null) ?? -Infinity;
          return va - vb;
        },
      })),
    ],
    [scores, t],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (scores.length === 0) {
    return (
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] py-6`}>
        {t('empty')}
      </p>
    );
  }

  return (
    <div className={String.raw`overflow-x-auto overflow-hidden rounded-[var(--radius-card,12px)] border border-[var(--border-default,rgba(255,255,255,0.14))]`}>
      <table className="w-full border-collapse">
        <thead className={String.raw`bg-[var(--bg-elevated,#181c23)] border-b border-[var(--border-default,rgba(255,255,255,0.14))]`}>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header, idx) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const isFirst = idx === 0;
                return (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-[color:var(--text-secondary,#8b92a0)] ${isFirst ? 'text-left min-w-[180px]' : 'text-center min-w-[100px]'}`}
                  >
                    {canSort ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className={`group flex items-center gap-1 hover:text-[color:var(--text-primary,#f0f2f5)] transition-colors ${isFirst ? '' : 'mx-auto'}`}
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
          {table.getRowModel().rows.map((row) => (
            <motion.tr
              key={row.id}
              variants={trVariants}
              className={String.raw`border-b border-[var(--border-default,rgba(255,255,255,0.08))] last:border-0`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
