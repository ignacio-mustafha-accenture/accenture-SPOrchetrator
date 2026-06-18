import type { IChatRepository } from '../../domain/ports/IChatRepository';
import type { ChatMessage } from '../../domain/entities/ChatMessage';

export class SendMessageUseCase {
  constructor(private readonly repo: IChatRepository) {}

  async execute(sessionId: string, content: string): Promise<ChatMessage> {
    return this.repo.sendMessage(sessionId, content);
  }
}
