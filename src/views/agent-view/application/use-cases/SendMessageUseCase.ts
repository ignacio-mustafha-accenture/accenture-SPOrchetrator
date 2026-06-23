import type { IChatRepository, SendMessageResult } from '../../domain/ports/IChatRepository';

export class SendMessageUseCase {
  constructor(private readonly repo: IChatRepository) {}

  execute(sessionId: string, content: string, lang?: string): Promise<SendMessageResult> {
    return this.repo.sendMessage(sessionId, content, lang);
  }
}
