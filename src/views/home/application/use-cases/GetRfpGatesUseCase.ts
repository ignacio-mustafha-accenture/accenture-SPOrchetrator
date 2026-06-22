import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Gate } from '../../domain/entities/Gate';

export class GetRfpGatesUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string): Promise<Gate[]> { return this.repo.findGatesByRfpId(rfpId); }
}
