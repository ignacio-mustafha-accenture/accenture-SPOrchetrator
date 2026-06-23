'use client';

import type { ChatMessage } from '../../domain/entities/ChatMessage';

type ChatMessageBubbleProps = {
  message: ChatMessage;
};

function renderContent(text: string) {
  return text.split('\n').map((line, li) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <span key={li}>
        {li > 0 && <br />}
        {parts.map((part, pi) =>
          pi % 2 === 1 ? (
            <strong key={pi} className="font-semibold">
              {part}
            </strong>
          ) : (
            part
          ),
        )}
      </span>
    );
  });
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="shrink-0 mb-0.5">
        {!isUser ? (
          <div className="size-7 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm">
            <span className="text-white text-[10px] font-bold leading-none tracking-tight">IQ</span>
          </div>
        ) : (
          <div className="size-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-center">
            <span className="text-[var(--text-secondary)] text-[10px] font-semibold leading-none">Yo</span>
          </div>
        )}
      </div>

      {/* Bubble — max-w is % of the flex parent (full thread width) */}
      <div
        className={[
          'max-w-[75%] sm:max-w-[65%] lg:max-w-[55%]',
          'px-3.5 py-2.5 text-[13px] md:text-[14px] leading-relaxed break-words',
          isUser
            ? 'bg-[var(--accent)] text-white rounded-2xl rounded-br-[4px]'
            : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-[4px]',
        ].join(' ')}
      >
        {renderContent(message.content)}
      </div>
    </div>
  );
}
