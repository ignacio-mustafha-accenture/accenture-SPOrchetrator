import { useTranslations } from 'next-intl';
import { AgentCard } from '../components/AgentCard/AgentCard';

export function AgentsPage() {
  const t = useTranslations('home');

  const agents = [
    {
      id: 'bidiq',
      name: t('agents.bidiq.name'),
      description: t('agents.bidiq.description'),
      status: 'active' as const,
      href: '/agent-view',
    },
    {
      id: 'supplier-intel',
      name: t('agents.supplierIntel.name'),
      description: t('agents.supplierIntel.description'),
      status: 'coming-soon' as const,
    },
    {
      id: 'contract-manager',
      name: t('agents.contractManager.name'),
      description: t('agents.contractManager.description'),
      status: 'coming-soon' as const,
    },
    {
      id: 'spend-analyzer',
      name: t('agents.spendAnalyzer.name'),
      description: t('agents.spendAnalyzer.description'),
      status: 'coming-soon' as const,
    },
  ];

  const badgeActiveLabel = t('agents.active');
  const badgeComingSoonLabel = t('agents.comingSoon');

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex flex-col gap-2 px-6 md:px-8 pt-8 pb-6 shrink-0">
        <h1 className={String.raw`font-extrabold text-[color:var(--text-primary,#f0f2f5)] text-[20px] md:text-[24px] leading-tight`}>
          {t('agents.title')}
        </h1>
        <p className={String.raw`font-normal text-[color:var(--text-secondary,#8b92a0)] text-[13px] md:text-[14px]`}>
          {t('agents.subtitle')}
        </p>
      </div>

      <div className="px-6 md:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              description={agent.description}
              status={agent.status}
              href={'href' in agent ? agent.href : undefined}
              badgeActiveLabel={badgeActiveLabel}
              badgeComingSoonLabel={badgeComingSoonLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
