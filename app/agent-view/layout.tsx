import { AgentViewLayout } from '@/views/agent-view/layout/AgentViewLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AgentViewLayout>{children}</AgentViewLayout>;
}
