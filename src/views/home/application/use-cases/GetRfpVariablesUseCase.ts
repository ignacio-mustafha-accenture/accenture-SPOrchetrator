import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Variable } from '../../domain/entities/Variable';

export class GetRfpVariablesUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string, supplierId?: string): Promise<Variable[]> {
    return this.repo.findVariablesByRfpId(rfpId, supplierId);
  }
}
