import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { RiskSupplier } from '../../domain/entities/Risk';

export class GetRfpRisksUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string): Promise<RiskSupplier[]> { return this.repo.findRisksByRfpId(rfpId); }
}
