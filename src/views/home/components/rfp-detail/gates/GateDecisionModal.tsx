'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { Gate } from '../../../domain/entities/Gate';
import { decideGate } from '../../../actions/decideGate';

const schema = z.object({
  status: z.enum(['approved', 'rejected']),
  decidedBy: z.string().min(2),
  rationale: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function GateDecisionModal({
  gate,
  onClose,
}: {
  gate: Gate;
  onClose: () => void;
}) {
  const t = useTranslations('home.rfps.detail.gates.modal');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'approved', decidedBy: '', rationale: '' },
  });

  const status = watch('status');

  const onSubmit = (data: FormValues) => {
    if (gate.isIrreversible && !data.rationale?.trim()) return;
    startTransition(async () => {
      try {
        await decideGate({
          rfpId: gate.rfpId,
          gateId: gate.gateId,
          status: data.status,
          decidedBy: data.decidedBy,
          rationale: data.rationale || undefined,
        });
        toast.success(t('success'));
        onClose();
      } catch {
        toast.error(t('error'));
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className={String.raw`absolute inset-0 bg-black/60`} />
      <div
        className={String.raw`relative w-full max-w-md rounded-[var(--radius-card,12px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-elevated,#181c23)] p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={String.raw`text-[color:var(--text-primary,#f0f2f5)] font-semibold text-[16px] mb-1`}>
          {t('title')}
        </h2>
        <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[13px] mb-5`}>
          {gate.label}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Decision toggle */}
          <div>
            <p className={String.raw`text-[color:var(--text-secondary,#8b92a0)] text-[11px] uppercase tracking-wider mb-2`}>
              {t('labelDecision')}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setValue('status', 'approved')}
                className={`flex-1 py-2 rounded-[8px] text-[13px] font-medium transition-colors border ${
                  status === 'approved'
                    ? String.raw`border-[var(--status-success,#22c55e)] bg-[rgba(34,197,94,0.12)] text-[color:var(--status-success,#22c55e)]`
                    : String.raw`border-[var(--border-default,rgba(255,255,255,0.14))] text-[color:var(--text-secondary,#8b92a0)]`
                }`}
              >
                {t('approve')}
              </button>
              <button
                type="button"
                onClick={() => setValue('status', 'rejected')}
                className={`flex-1 py-2 rounded-[8px] text-[13px] font-medium transition-colors border ${
                  status === 'rejected'
                    ? String.raw`border-[var(--status-error,#ef4444)] bg-[rgba(239,68,68,0.12)] text-[color:var(--status-error,#ef4444)]`
                    : String.raw`border-[var(--border-default,rgba(255,255,255,0.14))] text-[color:var(--text-secondary,#8b92a0)]`
                }`}
              >
                {t('reject')}
              </button>
            </div>
          </div>

          {/* Decided by */}
          <div>
            <label className={String.raw`block text-[color:var(--text-secondary,#8b92a0)] text-[11px] uppercase tracking-wider mb-1.5`}>
              {t('labelDecidedBy')}
            </label>
            <input
              {...register('decidedBy')}
              placeholder={t('placeholderDecidedBy')}
              className={String.raw`w-full rounded-[var(--radius-input,8px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-base,#0a0c10)] text-[color:var(--text-primary,#f0f2f5)] px-3 py-2 text-[13px] placeholder:text-[color:var(--text-secondary,#8b92a0)] focus:outline-none focus:border-[var(--accent,#a100ff)]`}
            />
            {errors.decidedBy && (
              <p className={String.raw`text-[color:var(--status-error,#ef4444)] text-[11px] mt-1`}>
                {errors.decidedBy.message}
              </p>
            )}
          </div>

          {/* Rationale */}
          <div>
            <label className={String.raw`block text-[color:var(--text-secondary,#8b92a0)] text-[11px] uppercase tracking-wider mb-1.5`}>
              {t('labelRationale')}
              {gate.isIrreversible && (
                <span className={String.raw`ml-2 text-[color:var(--status-warning,#eab308)]`}>
                  *
                </span>
              )}
            </label>
            <textarea
              {...register('rationale')}
              placeholder={t('placeholderRationale')}
              rows={3}
              className={String.raw`w-full rounded-[var(--radius-input,8px)] border border-[var(--border-default,rgba(255,255,255,0.14))] bg-[var(--bg-base,#0a0c10)] text-[color:var(--text-primary,#f0f2f5)] px-3 py-2 text-[13px] placeholder:text-[color:var(--text-secondary,#8b92a0)] focus:outline-none focus:border-[var(--accent,#a100ff)] resize-none`}
            />
            {gate.isIrreversible && (
              <p className={String.raw`text-[color:var(--status-warning,#eab308)] text-[11px] mt-1`}>
                {t('rationaleHint')}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={String.raw`flex-1 py-2 rounded-[8px] border border-[var(--border-default,rgba(255,255,255,0.14))] text-[color:var(--text-secondary,#8b92a0)] text-[13px] font-medium hover:border-[var(--text-secondary,#8b92a0)] transition-colors`}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={String.raw`flex-1 py-2 rounded-[8px] bg-[var(--accent,#a100ff)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50`}
            >
              {isPending ? '…' : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
