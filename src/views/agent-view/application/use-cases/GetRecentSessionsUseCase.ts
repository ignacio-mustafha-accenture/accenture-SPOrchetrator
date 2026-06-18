import type { IChatRepository } from '../../domain/ports/IChatRepository';
import type { ChatSession } from '../../domain/entities/ChatSession';

export class GetRecentSessionsUseCase {
  constructor(private readonly repo: IChatRepository) {}

  async execute(): Promise<ChatSession[]> {
    return this.repo.getRecentSessions();
  }
}
