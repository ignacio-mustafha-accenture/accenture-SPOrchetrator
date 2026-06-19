import { getTranslations } from 'next-intl/server';
import { createClient } from '@/shared/lib/supabase/server';
import { AgentViewShell } from '../components/AgentViewShell/AgentViewShell';
import { getRecentSessions } from '../actions/getSessions';

type AgentViewLayoutProps = {
  children: React.ReactNode;
};

export async function AgentViewLayout({ children }: AgentViewLayoutProps) {
  const [tc, ta, supabase, sessions] = await Promise.all([
    getTranslations('common'),
    getTranslations('agentView'),
    createClient(),
    getRecentSessions(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Ignacio';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AgentViewShell
      userName={displayName}
      userEmail={user?.email}
      userInitials={initials}
      userRole={tc('roles.procurementManager')}
      recentSessions={sessions}
      recentLabel={ta('recentLabel')}
      agentOnline
    >
      {children}
    </AgentViewShell>
  );
}
