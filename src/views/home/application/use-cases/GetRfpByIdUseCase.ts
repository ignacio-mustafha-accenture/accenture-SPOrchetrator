import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Rfp } from '../../domain/entities/Rfp';

export class GetRfpByIdUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string): Promise<Rfp> { return this.repo.findRfpById(rfpId); }
}
