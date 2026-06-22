'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { Button, Input, LogoMark } from '@/shared/ui';
import { createClient } from '@/shared/lib/supabase/client';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof forgotSchema>;

type Step = 'request' | 'sent';

const CARD = String.raw`bg-[var(--bg-elevated,#181c23)] border border-[var(--border-default,rgba(255,255,255,0.14))] border-solid w-full max-w-[420px] px-8 py-9 rounded-[var(--radius-card,16px)] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.35)]`;

const STEP_INNER = 'flex flex-col gap-[var(--spacing-16,16px)] items-start w-full';

const STEP_TRANSITION = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 36,
  mass: 0.8,
};

const RESEND_SECONDS = 60;

export function ForgotPasswordForm(): React.JSX.Element {
  const t = useTranslations('auth.forgotPassword');
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');
  const [serverError, setServerError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (step !== 'sent') return;
    setSecondsLeft(RESEND_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const sendInstructions = async (email: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setServerError(t('errors.generic'));
      return false;
    }
    return true;
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const ok = await sendInstructions(values.email);
    if (ok) {
      setSubmittedEmail(values.email);
      setStep('sent');
    }
  };

  const onResend = async () => {
    if (secondsLeft > 0) return;
    setServerError(null);
    const ok = await sendInstructions(submittedEmail);
    if (ok) setStep('sent');
  };

  return (
    <div className={clsx(CARD, 'overflow-hidden relative')}>
      {/*
        initial={false} skips the enter animation on first mount — the page-level
        template.tsx already handles the card's entrance. AnimatePresence only
        fires when `step` changes (request → sent).
      */}
      <AnimatePresence mode="wait" initial={false}>
        {step === 'request' ? (
          <motion.div
            key="request"
            className={STEP_INNER}
            initial={{ opacity: 0, x: '-6%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-6%' }}
            transition={STEP_TRANSITION}
          >
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <LogoMark
                className={String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-[var(--radius-logo,8px)] size-[32px]`}
                text="IQ"
              />
              <p
                className={String.raw`font-semibold leading-normal text-[color:var(--text-primary,#f0f2f5)] text-[length:var(--font-size-xl,15px)] text-center whitespace-nowrap`}
              >
                {t('title')}
              </p>
              <p
                className={String.raw`font-medium leading-normal text-[color:var(--text-secondary,#8b92a0)] text-[length:var(--font-size-sm,12px)] text-center whitespace-nowrap`}
              >
                {t('subtitle')}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[var(--spacing-16,16px)] items-start w-full"
              noValidate
            >
              <Input
                label={t('email')}
                type="email"
                placeholder={t('emailPlaceholder')}
                className="w-full"
                errorMessage={errors.email?.message}
                {...register('email')}
              />
              {serverError && (
                <p
                  className={clsx(
                    String.raw`font-normal leading-normal text-[color:var(--status-error,#ef4444)] text-[length:var(--font-size-xs,11px)]`,
                  )}
                >
                  {serverError}
                </p>
              )}
              <Button type="submit" variant="Primary" disabled={isSubmitting} className="w-full">
                {t('submit')}
              </Button>
            </form>

            <Button variant="Ghost" className="w-full" onClick={() => router.push('/login')}>
              {t('backToLogin')}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            className={STEP_INNER}
            initial={{ opacity: 0, x: '6%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '6%' }}
            transition={STEP_TRANSITION}
          >
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <LogoMark
                className={String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-[var(--radius-logo,8px)] size-[32px]`}
                text="IQ"
              />
              <div
                className={String.raw`bg-[var(--accent-dim,rgba(161,0,255,0.15))] flex items-center justify-center rounded-[24px] size-[48px]`}
              >
                <span
                  className={String.raw`font-bold text-[color:var(--accent,#a100ff)] text-[20px] leading-none`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              </div>
              <p
                className={String.raw`font-semibold leading-normal text-[color:var(--text-primary,#f0f2f5)] text-[length:var(--font-size-xl,15px)] text-center whitespace-nowrap`}
              >
                {t('sentTitle')}
              </p>
              <p
                className={String.raw`font-medium leading-normal text-[color:var(--text-secondary,#8b92a0)] text-[length:var(--font-size-sm,12px)] text-center whitespace-nowrap`}
              >
                {t('sentSubtitle')}
              </p>
            </div>

            <Button
              variant="Ghost"
              className="w-full"
              disabled={secondsLeft > 0}
              onClick={onResend}
            >
              {secondsLeft > 0
                ? t('resendIn', { seconds: secondsLeft })
                : t('resendNow')}
            </Button>

            <Button variant="Ghost" className="w-full" onClick={() => router.push('/login')}>
              {t('backToLogin')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
