'use server';

import { MockChatRepository } from '../infrastructure/adapters/MockChatRepository';
import { GetRecentSessionsUseCase } from '../application/use-cases/GetRecentSessionsUseCase';
import type { ChatSession } from '../domain/entities/ChatSession';

export async function getRecentSessions(): Promise<ChatSession[]> {
  const repo = new MockChatRepository();
  return new GetRecentSessionsUseCase(repo).execute();
}
