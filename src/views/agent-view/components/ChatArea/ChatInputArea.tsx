import { useTranslations } from 'next-intl';
import { sendMessage } from '../../actions/sendMessage';
import { ChatAreaClient } from './ChatAreaClient';

type ChatInputAreaProps = {
  placeholder?: string;
};

export function ChatInputArea({ placeholder }: ChatInputAreaProps) {
  const t = useTranslations('agentView');
  const resolvedPlaceholder = placeholder ?? t('inputPlaceholder');
  return (
    <div className="bg-[var(--bg-surface)] md:bg-transparent border-t border-[var(--border-subtle)] md:border-none shrink-0 w-full px-3 md:px-6 pt-2 md:pt-3 pb-5 md:pb-6">
      <ChatAreaClient action={sendMessage} placeholder={resolvedPlaceholder} />
    </div>
  );
}
