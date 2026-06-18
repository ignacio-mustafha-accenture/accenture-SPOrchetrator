import { SuggestionChip } from '@/shared/ui';
import { sendMessage } from '../actions/sendMessage';
import { ChatInputArea } from '../components/ChatArea/ChatInputArea';

const SUGGESTIONS = [
  'Create an RFP for cleaning services',
  'Review open RFP submissions',
  'Check supplier performance',
  'Schedule evaluation meeting',
];

async function handleSuggestion(formData: FormData) {
  'use server';
  const message = formData.get('message') as string;
  if (message) await sendMessage('new', message);
}

type AgentViewPageProps = {
  userName?: string;
};

export function AgentViewPage({ userName = 'Ignacio' }: AgentViewPageProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? `Good morning, ${userName}` :
    hour < 18 ? `Good afternoon, ${userName}` :
    `Good evening, ${userName}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 flex-col gap-3 items-center justify-center min-h-0 overflow-clip pb-10 pt-14 px-6 xl:px-20 w-full">
        <h1 className="font-extrabold text-[var(--text-primary)] text-[22px] md:text-[28px] xl:text-[32px] text-center whitespace-nowrap">
          {greeting}
        </h1>
        <p className="font-normal leading-relaxed text-[var(--text-secondary)] text-[13px] md:text-[14px] xl:text-[16px] text-center">
          How can I help with your procurement workflow today?
        </p>
        <div className="flex flex-wrap gap-1.5 md:gap-2 items-start justify-center mt-1">
          {SUGGESTIONS.map((suggestion) => (
            <SuggestionChip key={suggestion} action={handleSuggestion} message={suggestion}>
              {suggestion}
            </SuggestionChip>
          ))}
        </div>
      </div>

      <ChatInputArea />
    </div>
  );
}
