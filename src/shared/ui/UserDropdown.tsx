'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe, LogOut, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';

import { setLocale } from '@/shared/lib/setLocale';

import { Avatar } from './Avatar';

type UserDropdownProps = {
  className?: string;
  /** Extra classes applied to the trigger <button> */
  triggerClassName?: string;
  /** Show the user's name next to the avatar in the trigger */
  showName?: boolean;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  onSignOut?: () => void;
};

export function UserDropdown({
  className,
  triggerClassName,
  showName = false,
  userName = 'User',
  userEmail = '',
  userInitials = 'U',
  onSignOut,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const router = useRouter();
  const locale = useLocale();
  const currentLang = locale.toUpperCase() as 'EN' | 'ES';

  const tc = useTranslations('common');

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function handleLanguageChange(lang: 'EN' | 'ES') {
    if (lang.toLowerCase() === locale) return;
    startTransition(async () => {
      await setLocale(lang.toLowerCase() as 'en' | 'es');
      router.refresh();
    });
  }

  return (
    <div ref={ref} className={clsx('relative shrink-0', className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={tc('aria.userMenu')}
        className={clsx('flex items-center justify-center gap-[8px]', triggerClassName)}
      >
        <Avatar initials={userInitials} size="S" />
        {showName && userName && (
          <span className={String.raw`font-semibold text-[length:var(--font-size-xs,11px)] whitespace-nowrap hidden xl:block`}>
            {userName}
          </span>
        )}
      </button>

      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ originX: 1, originY: 0 }}
          className={clsx(
            String.raw`absolute right-0 top-[calc(100%+8px)] z-50`,
            String.raw`border border-solid flex flex-col items-start py-[8px] rounded-[var(--radius-card,16px)] w-[240px]`,
            String.raw`bg-[var(--bg-elevated)] border-[var(--border-default)]`,
            String.raw`shadow-[0_8px_32px_rgba(0,0,0,0.24)]`,
          )}
        >
          {/* User info */}
          <div className="flex gap-[12px] items-center px-[16px] py-[14px] w-full overflow-clip">
            <div
              className={String.raw`flex items-center justify-center rounded-[var(--radius-full,9999px)] shrink-0 size-[30px] bg-[var(--accent,#a100ff)]`}
            >
              <p
                className={String.raw`font-bold leading-normal text-[color:var(--text-on-accent,white)] text-[length:var(--font-size-xs,11px)] text-center whitespace-nowrap`}
              >
                {userInitials}
              </p>
            </div>
            <div className="flex flex-col gap-[3px] items-start min-w-0 flex-1">
              <p
                className={String.raw`font-bold text-[length:var(--font-size-md,13px)] text-[color:var(--text-primary)] truncate w-full`}
              >
                {userName}
              </p>
              <p
                className={String.raw`font-normal text-[length:var(--font-size-xs,11px)] text-[color:var(--text-secondary)] truncate w-full`}
              >
                {userEmail}
              </p>
            </div>
          </div>

          <div className={String.raw`h-px w-full bg-[var(--border-divider)]`} />
          <div className="h-[4px] w-full shrink-0" />

          {/* Appearance */}
          <div className="flex items-center justify-between px-[14px] py-[10px] w-full">
            <div className="flex gap-[10px] items-center shrink-0">
              {isDark ? (
                <Moon className={String.raw`size-[16px] text-[color:var(--text-primary)]`} strokeWidth={1.5} />
              ) : (
                <Monitor className={String.raw`size-[16px] text-[color:var(--text-primary)]`} strokeWidth={1.5} />
              )}
              <p className={String.raw`font-medium text-[length:var(--font-size-md,13px)] text-[color:var(--text-primary)] whitespace-nowrap`}>
                {tc('appearance')}
              </p>
            </div>
            <div className={String.raw`flex gap-[2px] p-[3px] rounded-[var(--radius-tag,6px)] bg-[var(--bg-glass)]`}>
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={clsx(
                    String.raw`flex items-center justify-center px-[8px] py-[4px] rounded-[var(--radius-tag,6px)] transition-colors duration-150`,
                    resolvedTheme === t
                      ? String.raw`bg-[var(--bg-hover)] text-[color:var(--text-primary)]`
                      : String.raw`text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]`,
                  )}
                >
                  <p className={String.raw`font-medium text-[length:var(--font-size-xs,11px)] whitespace-nowrap`}>
                    {t === 'light' ? tc('themeLight') : tc('themeDark')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between px-[14px] py-[10px] w-full">
            <div className="flex gap-[10px] items-center shrink-0">
              <Globe
                className={clsx(
                  String.raw`size-[16px] text-[color:var(--text-primary)]`,
                  isPending && 'opacity-50',
                )}
                strokeWidth={1.5}
              />
              <p className={String.raw`font-medium text-[length:var(--font-size-md,13px)] text-[color:var(--text-primary)] whitespace-nowrap`}>
                {tc('language')}
              </p>
            </div>
            <div className={String.raw`flex gap-[2px] p-[3px] rounded-[var(--radius-tag,6px)] bg-[var(--bg-glass)]`}>
              {(['EN', 'ES'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  disabled={isPending}
                  className={clsx(
                    String.raw`flex items-center justify-center px-[8px] py-[4px] rounded-[var(--radius-tag,6px)] transition-colors duration-150`,
                    currentLang === lang
                      ? String.raw`bg-[var(--bg-hover)] text-[color:var(--text-primary)]`
                      : String.raw`text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]`,
                    isPending && 'opacity-50 cursor-wait',
                  )}
                >
                  <p className={String.raw`font-medium text-[length:var(--font-size-xs,11px)] whitespace-nowrap`}>
                    {lang}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[4px] w-full shrink-0" />
          <div className={String.raw`h-px w-full bg-[var(--border-divider)]`} />
          <div className="h-[4px] w-full shrink-0" />

          {/* Sign out */}
          <button
            onClick={() => {
              onSignOut?.();
              setOpen(false);
            }}
            className={String.raw`flex items-center px-[14px] py-[10px] w-full hover:bg-[var(--bg-hover)] transition-colors duration-150`}
          >
            <div className="flex gap-[10px] items-center shrink-0">
              <LogOut className={String.raw`size-[16px] text-[color:var(--status-error)]`} strokeWidth={1.5} />
              <p className={String.raw`font-medium text-[length:var(--font-size-md,13px)] text-[color:var(--status-error)] whitespace-nowrap`}>
                {tc('signOut')}
              </p>
            </div>
          </button>

          <div className="h-[4px] w-full shrink-0" />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
