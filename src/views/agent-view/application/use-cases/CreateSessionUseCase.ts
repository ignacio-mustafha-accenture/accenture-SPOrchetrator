import type { CreateSessionResult, IChatRepository } from '../../domain/ports/IChatRepository';

export class CreateSessionUseCase {
  constructor(private readonly repo: IChatRepository) {}

  execute(lang?: string): Promise<CreateSessionResult> {
    return this.repo.createSession(lang);
  }
}
