'use server';

import { MockChatRepository } from '../infrastructure/adapters/MockChatRepository';
import { SendMessageUseCase } from '../application/use-cases/SendMessageUseCase';
import type { ChatMessage } from '../domain/entities/ChatMessage';

export async function sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
  const repo = new MockChatRepository();
  return new SendMessageUseCase(repo).execute(sessionId, content);
}
