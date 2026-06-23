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

import type { Supplier } from '../../../domain/entities/Supplier';

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

const col = createColumnHelper<Supplier>();

export function SuppliersTable({ suppliers }: { suppliers: Supplier[] }) {
  const t = useTranslations('home.rfps.detail.suppliers');

  const [sorting, setSorting] = useState<SortingState>([{ id: 'compositeScore', desc: true }]);
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    if (!search.trim()) return suppliers;
    const q = search.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q),
    );
  }, [suppliers, search]);

  const columns = useMemo(
    () => [
      col.accessor('name', {
        header: t('colName'),
        cell: (i) => <span className="font-medium">{i.getValue()}</span>,
      }),
      col.accessor('email', {
        header: t('colEmail'),
        enableSorting: false,
        cell: (i) => (
          <span className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[12px]`}>
            {i.getValue()}
          </span>
        ),
      }),
      col.accessor('country', {
        header: t('colCountry'),
        cell: (i) => <span>{i.getValue()}</span>,
      }),
      col.accessor('compositeScore', {
        header: t('colScore'),
        cell: (i) => {
          const score = Number(i.getValue());
          return (
            <div className="flex items-center gap-2 min-w-[100px]">
              <div className={String.raw`flex-1 max-w-[80px] h-[4px] rounded-full bg-[var(--border-default,rgba(255,255,255,0.14))]`}>
                <div
                  className={String.raw`h-full rounded-full bg-[var(--accent,#a100ff)]`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
              <span className={String.raw`font-mono text-[12px] text-[color:var(--text-secondary,#8b92a0)] w-8 text-right`}>
                {score.toFixed(0)}
              </span>
            </div>
          );
        },
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

  if (suppliers.length === 0) {
    return (
      <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] py-6`}>
        {t('empty')}
      </p>
    );
  }

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative self-start">
        <Search
          size={13}
          className={String.raw`absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary,#8b92a0)] pointer-events-none`}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className={String.raw`w-[220px] rounded-[8px] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-base,#0a0c10)] pl-8 pr-3 py-1.5 text-[12px] text-[color:var(--text-primary,#f0f2f5)] placeholder:text-[color:var(--text-secondary,#8b92a0)] outline-none transition-colors focus:border-[var(--accent,#a100ff)]`}
        />
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
