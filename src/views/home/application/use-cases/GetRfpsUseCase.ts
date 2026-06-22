import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Rfp } from '../../domain/entities/Rfp';

export class GetRfpsUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(): Promise<Rfp[]> { return this.repo.findAllRfps(); }
}
