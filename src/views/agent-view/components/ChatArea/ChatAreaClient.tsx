'use client';

import { useTransition } from 'react';
import { ChatInput } from '@/shared/ui';

type ChatAreaClientProps = {
  action: (sessionId: string, content: string) => Promise<unknown>;
  placeholder?: string;
};

export function ChatAreaClient({ action, placeholder }: ChatAreaClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (value: string) => {
    startTransition(() => {
      action('new', value);
    });
  };

  return (
    <ChatInput
      placeholder={placeholder}
      onSubmit={handleSubmit}
      disabled={isPending}
    />
  );
}
