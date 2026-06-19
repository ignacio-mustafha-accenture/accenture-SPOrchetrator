import { useTranslations } from 'next-intl';
import { SuggestionChip } from '@/shared/ui';
import { sendMessage } from '../actions/sendMessage';
import { ChatInputArea } from '../components/ChatArea/ChatInputArea';
import { AgentChatShell } from '../components/AgentChatShell/AgentChatShell';

async function handleSuggestion(formData: FormData) {
  'use server';
  const message = formData.get('message') as string;
  if (message) await sendMessage('new', message);
}

type AgentViewPageProps = {
  userName?: string;
};

export function AgentViewPage({ userName = 'Ignacio' }: AgentViewPageProps) {
  const t = useTranslations('agentView');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('greetingMorning', { name: userName }) :
    hour < 18 ? t('greetingAfternoon', { name: userName }) :
    t('greetingEvening', { name: userName });

  const suggestions = [
    t('suggestions.createRfp'),
    t('suggestions.reviewSubmissions'),
    t('suggestions.checkSuppliers'),
    t('suggestions.scheduleMeeting'),
  ];

  return (
    <AgentChatShell>
      <div className="flex flex-col h-full">
        <div className="flex flex-1 flex-col gap-3 items-center justify-center min-h-0 overflow-clip pb-10 pt-14 px-6 xl:px-20 w-full">
          <h1 className="font-extrabold text-[var(--text-primary)] text-[22px] md:text-[28px] xl:text-[32px] text-center whitespace-nowrap">
            {greeting}
          </h1>
          <p className="font-normal leading-relaxed text-[var(--text-secondary)] text-[13px] md:text-[14px] xl:text-[16px] text-center">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-1.5 md:gap-2 items-start justify-center mt-1">
            {suggestions.map((suggestion) => (
              <SuggestionChip key={suggestion} action={handleSuggestion} message={suggestion}>
                {suggestion}
              </SuggestionChip>
            ))}
          </div>
        </div>

        <ChatInputArea />
      </div>
    </AgentChatShell>
  );
}
