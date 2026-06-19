'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { Button, Card, Checkbox, Divider, Input, LogoMark } from '@/shared/ui';
import { createClient } from '@/shared/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm(): React.JSX.Element {
  const t = useTranslations('auth.login');
  const tc = useTranslations('common');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(t('errors.generic'));
      return;
    }
    router.push('/home');
  };

  return (
    <Card>
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <LogoMark
          className={String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-[var(--radius-logo,8px)] size-[32px]`}
          text={tc('logoText')}
        />
        <p
          className={String.raw`font-semibold leading-normal text-[color:var(--text-primary,#f0f2f5)] text-[length:var(--font-size-xl,15px)] text-center whitespace-nowrap`}
        >
          {tc('appNameFull')}
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
        <Input
          label={t('password')}
          type="password"
          className="w-full"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        <Controller
          name="rememberMe"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)}>
              {t('rememberMe')}
            </Checkbox>
          )}
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

      <Button variant="Ghost" className="w-full" onClick={() => router.push('/forgot-password')}>
        {t('forgotPassword')}
      </Button>

      <Divider label={t('or')} />

      <Button variant="Secondary" className="w-full">
        {t('sso')}
      </Button>
    </Card>
  );
}
