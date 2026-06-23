'use client';

import { ChatInput } from '@/shared/ui';

type ChatAreaClientProps = {
  onSubmit: (value: string) => void;
  isPending?: boolean;
  placeholder?: string;
};

export function ChatAreaClient({ onSubmit, isPending = false, placeholder }: ChatAreaClientProps) {
  return (
    <ChatInput
      placeholder={placeholder}
      onSubmit={onSubmit}
      disabled={isPending}
    />
  );
}
