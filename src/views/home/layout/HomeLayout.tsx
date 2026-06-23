import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { createClient } from '@/shared/lib/supabase/server';

import { HomeViewShell } from '../components/HomeViewShell/HomeViewShell';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export async function HomeLayout({ children }: HomeLayoutProps) {
  const [tc, supabase] = await Promise.all([
    getTranslations('common'),
    createClient(),
  ]);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <HomeViewShell
      userName={displayName}
      userEmail={user.email}
      userInitials={initials}
      userRole={tc('roles.procurementManager')}
      agentOnline
    >
      {children}
    </HomeViewShell>
  );
}
