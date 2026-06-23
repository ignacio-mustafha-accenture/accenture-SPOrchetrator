'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { Button, Input, LogoMark, PasswordStrength } from '@/shared/ui';
import { createClient } from '@/shared/lib/supabase/client';

import { type PasswordStrengthLevel } from '../../types';

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof resetSchema>;

const CARD = String.raw`bg-[var(--bg-elevated,#181c23)] border border-[var(--border-default,rgba(255,255,255,0.14))] border-solid flex flex-col gap-[var(--spacing-16,16px)] items-start w-full max-w-[420px] px-8 py-9 rounded-[var(--radius-card,16px)] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.35)]`;

function computeStrength(password: string): PasswordStrengthLevel | null {
  if (!password) return null;
  const len = password.length;
  if (len < 6) return '1-Weak';
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (len >= 12 && score >= 3) return '4-Strong';
  if (len >= 8 && score >= 2) return '3-Good';
  return '2-Fair';
}

export function ResetPasswordForm(): React.JSX.Element {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');
  const strength = computeStrength(passwordValue);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      setServerError(t('errors.generic'));
      return;
    }
    router.push('/login');
  };

  return (
    <div className={CARD}>
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
          label={t('password')}
          type="password"
          className="w-full"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        {strength && <PasswordStrength level={strength} className="w-full" />}
        <Input
          label={t('confirmPassword')}
          type="password"
          className="w-full"
          errorMessage={errors.confirmPassword?.message}
          {...register('confirmPassword')}
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
    </div>
  );
}
