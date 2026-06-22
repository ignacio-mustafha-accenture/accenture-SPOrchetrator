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
import type { RiskRating, RiskSupplier } from '../../../domain/entities/Risk';
import { RiskCell } from './RiskCell';

type RiskRow = Record<string, RiskRating | string>;

const RISK_ORDER: Record<RiskRating, number> = { Bajo: 1, Medio: 2, Alto: 3, Crítico: 4 };
const ALL_MIN_LEVELS = ['all', 'Medio', 'Alto', 'Crítico'] as const;
type MinLevelFilter = (typeof ALL_MIN_LEVELS)[number];

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

export function RiskHeatmap({ risks }: { risks: RiskSupplier[] }) {
  const t = useTranslations('home.rfps.detail.risk');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [minLevel, setMinLevel] = useState<MinLevelFilter>('all');

  const allRows = useMemo<RiskRow[]>(() => {
    if (risks.length === 0) return [];
    const factors = risks[0].factors.map((f) => f.riskFactor);
    return factors.map((factor) => {
      const row: RiskRow = { factor };
      for (const supplier of risks) {
        const f = supplier.factors.find((f) => f.riskFactor === factor);
        row[supplier.supplierId] = f?.rating ?? 'Bajo';
      }
      return row;
    });
  }, [risks]);

  const data = useMemo<RiskRow[]>(() => {
    if (minLevel === 'all') return allRows;
    const threshold = RISK_ORDER[minLevel as RiskRating];
    return allRows.filter((row) =>
      risks.some((s) => RISK_ORDER[row[s.supplierId] as RiskRating] >= threshold),
    );
  }, [allRows, minLevel, risks]);

  const columns = useMemo<ColumnDef<RiskRow>[]>(
    () => [
      {
        id: 'factor',
        accessorFn: (row) => row.factor as string,
        header: () => t('colFactor'),
        cell: ({ getValue }) => (
          <span className={String.raw`text-[13px] text-[color:var(--text-primary,#f0f2f5)]`}>
            {getValue() as string}
          </span>
        ),
      },
      ...risks.map((s) => ({
        id: s.supplierId,
        accessorFn: (row: RiskRow) => row[s.supplierId] as RiskRating,
        header: () => s.supplierName,
        cell: ({ getValue }: { getValue: () => RiskRating }) => {
          const rating = getValue();
          return (
            <div className="flex justify-center">
              <RiskCell rating={rating} label={t(`rating.${rating}`)} />
            </div>
          );
        },
        sortingFn: (a: Row<RiskRow>, b: Row<RiskRow>) =>
          RISK_ORDER[a.original[s.supplierId] as RiskRating] -
          RISK_ORDER[b.original[s.supplierId] as RiskRating],
      })),
    ],
    [risks, t],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (risks.length === 0) {
    return (
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] py-6`}>
        {t('empty')}
      </p>
    );
  }

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 flex-wrap">
        {ALL_MIN_LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setMinLevel(lvl)}
            className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
              minLevel === lvl
                ? 'bg-[var(--accent,#a100ff)] text-white'
                : String.raw`text-[color:var(--text-secondary,#8b92a0)] hover:bg-[var(--bg-hover,#1e2330)]`
            }`}
          >
            {lvl === 'all' ? t('filterAll') : `${t(`rating.${lvl}`)}+`}
          </button>
        ))}
      </div>

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
                  {hg.headers.map((header, idx) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    const isFirst = idx === 0;
                    return (
                      <th
                        key={header.id}
                        className={`px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-[color:var(--text-secondary,#8b92a0)] ${isFirst ? 'text-left min-w-[200px]' : 'text-center min-w-[110px]'}`}
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
              {rows.map((row) => (
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
      )}
    </div>
  );
}
