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
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { Badge } from '@/shared/ui';
import type { Variable } from '../../../domain/entities/Variable';
import type { Supplier } from '../../../domain/entities/Supplier';

function SortIcon({ sorted }: { sorted: 'asc' | 'desc' | false }) {
  if (sorted === 'asc')  return <ChevronUp   size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  if (sorted === 'desc') return <ChevronDown size={11} className="shrink-0 text-[color:var(--accent,#a100ff)]" />;
  return <ChevronsUpDown size={11} className="shrink-0 opacity-20 group-hover:opacity-50 transition-opacity" />;
}

const tbodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const trVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
};

const col = createColumnHelper<Variable>();

export function VariablesSection({
  variables,
  suppliers,
}: {
  variables: Variable[];
  suppliers: Supplier[];
}) {
  const t = useTranslations('home.rfps.detail.variables');

  const [sorting, setSorting] = useState<SortingState>([{ id: 'confidence', desc: true }]);
  const [supplierId, setSupplierId] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    let rows = variables;
    if (supplierId) rows = rows.filter((v) => v.supplierId === supplierId);
    if (flaggedOnly) rows = rows.filter((v) => v.flagged);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (v) =>
          v.variableId.toLowerCase().includes(q) ||
          v.dimension.toLowerCase().includes(q) ||
          v.supplierName.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [variables, supplierId, flaggedOnly, search]);

  const columns = useMemo(
    () => [
      col.accessor('variableId', {
        header: t('colVariable'),
        cell: (i) => (
          <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)] font-mono text-[11px]`}>
            {i.getValue()}
          </span>
        ),
      }),
      col.accessor('dimension', {
        header: t('colDimension'),
        cell: (i) => <span className="text-[13px]">{i.getValue()}</span>,
      }),
      col.accessor('supplierName', {
        header: t('colSupplier'),
        cell: (i) => <span className="text-[13px]">{i.getValue()}</span>,
      }),
      col.accessor('value', {
        header: t('colValue'),
        enableSorting: false,
        cell: (i) => (
          <span className={String.raw`text-[13px] text-[color:var(--text-secondary,#8b92a0)]`}>
            {i.getValue() || '—'}
          </span>
        ),
      }),
      col.accessor('confidence', {
        header: t('colConfidence'),
        cell: (i) => (
          <span className="font-mono text-[12px]">
            {(Number(i.getValue()) * 100).toFixed(0)}%
          </span>
        ),
      }),
      col.accessor('flagged', {
        header: t('colFlagged'),
        cell: (i) => i.getValue() ? <Badge variant="Error">!</Badge> : null,
        sortingFn: (a, b) => Number(a.original.flagged) - Number(b.original.flagged),
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

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Filters row ── */}
      <div className="flex flex-wrap items-center gap-2">
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

        {/* Flagged toggle */}
        <button
          onClick={() => setFlaggedOnly((v) => !v)}
          className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
            flaggedOnly
              ? 'bg-[var(--status-error,#ef4444)] text-white'
              : String.raw`text-[color:var(--text-secondary,#8b92a0)] hover:bg-[var(--bg-hover,#1e2330)]`
          }`}
        >
          {t('filterFlagged')}
        </button>

        {/* Supplier pills */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSupplierId('')}
            className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
              supplierId === ''
                ? 'bg-[var(--accent,#a100ff)] text-white'
                : String.raw`text-[color:var(--text-secondary,#8b92a0)] hover:bg-[var(--bg-hover,#1e2330)]`
            }`}
          >
            {t('filterAll')}
          </button>
          {suppliers.map((s) => (
            <button
              key={s.supplierId}
              onClick={() => setSupplierId(s.supplierId)}
              className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
                supplierId === s.supplierId
                  ? 'bg-[var(--accent,#a100ff)] text-white'
                  : String.raw`text-[color:var(--text-secondary,#8b92a0)] hover:bg-[var(--bg-hover,#1e2330)]`
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
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

      {/* ── Footer ── */}
      {rows.length > 0 && (
        <p className={String.raw`text-[11px] text-[color:var(--text-secondary,#8b92a0)]`}>
          {t('rows', { count: rows.length, total: variables.length })}
        </p>
      )}
    </div>
  );
}
