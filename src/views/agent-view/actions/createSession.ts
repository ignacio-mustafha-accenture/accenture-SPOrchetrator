'use server';

import { createClient } from '@/shared/lib/supabase/server';

import { CreateSessionUseCase } from '../application/use-cases/CreateSessionUseCase';
import { BEApiChatRepository } from '../infrastructure/adapters/BEApiChatRepository';
import type { CreateSessionResult } from '../domain/ports/IChatRepository';

export async function createSession(lang?: string): Promise<CreateSessionResult> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const repo = new BEApiChatRepository(session?.access_token ?? '');
  return new CreateSessionUseCase(repo).execute(lang);
}
