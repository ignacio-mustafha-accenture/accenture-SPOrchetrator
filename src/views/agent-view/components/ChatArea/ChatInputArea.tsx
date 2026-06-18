import { sendMessage } from '../../actions/sendMessage';
import { ChatAreaClient } from './ChatAreaClient';

type ChatInputAreaProps = {
  placeholder?: string;
};

export function ChatInputArea({ placeholder = 'Message BidIQ Agent…' }: ChatInputAreaProps) {
  return (
    <div className="bg-[var(--bg-surface)] md:bg-transparent border-t border-[var(--border-subtle)] md:border-none shrink-0 w-full px-3 md:px-6 pt-2 md:pt-3 pb-5 md:pb-6">
      <ChatAreaClient action={sendMessage} placeholder={placeholder} />
    </div>
  );
}
