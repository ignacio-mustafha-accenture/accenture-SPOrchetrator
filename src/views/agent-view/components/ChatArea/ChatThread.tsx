'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../domain/entities/ChatMessage';
import { ChatMessageBubble } from './ChatMessageBubble';

type ChatThreadProps = {
  messages: ChatMessage[];
  isPending?: boolean;
};

export function ChatThread({ messages, isPending = false }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isPending]);

  function gapBefore(index: number): string {
    if (index === 0) return '';
    return messages[index - 1].role === messages[index].role ? 'mt-1' : 'mt-4';
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 py-4 md:py-6">
      <div className="flex flex-col w-full px-3 sm:px-5">
        {messages.map((msg, i) => (
          <div key={msg.id} className={gapBefore(i)}>
            <ChatMessageBubble message={msg} />
          </div>
        ))}

        {isPending && (
          <div className="mt-4 flex items-end gap-2">
            <div className="shrink-0 mb-0.5">
              <div className="size-7 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm">
                <span className="text-white text-[10px] font-bold leading-none tracking-tight">
                  IQ
                </span>
              </div>
            </div>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-[4px] px-4 py-3">
              <div className="flex gap-[5px] items-center h-[14px]">
                <span className="size-[5px] rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0ms]" />
                <span className="size-[5px] rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:160ms]" />
                <span className="size-[5px] rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:320ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}
