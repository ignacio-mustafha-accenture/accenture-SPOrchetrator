'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { SendMessageUseCase } from '../application/use-cases/SendMessageUseCase';
import { BEApiChatRepository } from '../infrastructure/adapters/BEApiChatRepository';
import type { SendMessageResult } from '../domain/ports/IChatRepository';

export async function sendMessage(
  sessionId: string,
  content: string,
  lang?: string,
): Promise<SendMessageResult> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const repo = new BEApiChatRepository(session?.access_token ?? '');
  return new SendMessageUseCase(repo).execute(sessionId, content, lang);
}
