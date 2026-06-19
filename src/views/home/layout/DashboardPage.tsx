import { useTranslations } from 'next-intl';
import { Badge, LogoMark } from '@/shared/ui';

export function DashboardPage() {
  const t = useTranslations('home.dashboard');

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 pb-16">
      <LogoMark
        className={String.raw`bg-[var(--accent,#a100ff)] flex items-center justify-center rounded-[var(--radius-logo,8px)] size-[56px]`}
        text="IQ"
      />

      <Badge variant="Accent">{t('badge')}</Badge>

      <div className="flex flex-col items-center gap-3 text-center max-w-[420px]">
        <h1 className={String.raw`font-extrabold text-[color:var(--text-primary,#f0f2f5)] text-[22px] md:text-[26px] leading-snug`}>
          {t('heading')}
        </h1>
        <p className={String.raw`font-normal text-[color:var(--text-secondary,#8b92a0)] text-[14px] leading-relaxed`}>
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
