import { createClient } from '@/shared/lib/supabase/server';
import { AgentViewShell } from '../components/AgentViewShell/AgentViewShell';
import { getRecentSessions } from '../actions/getSessions';

type AgentViewLayoutProps = {
  children: React.ReactNode;
};

export async function AgentViewLayout({ children }: AgentViewLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const sessions = await getRecentSessions();

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
      userInitials={initials}
      userRole="Procurement Manager"
      recentSessions={sessions}
      recentLabel="RECENT"
      agentOnline
    >
      {children}
    </AgentViewShell>
  );
}
