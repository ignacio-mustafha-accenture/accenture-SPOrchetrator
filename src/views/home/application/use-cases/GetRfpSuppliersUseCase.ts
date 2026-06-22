import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Supplier } from '../../domain/entities/Supplier';

export class GetRfpSuppliersUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string): Promise<Supplier[]> { return this.repo.findSuppliersByRfpId(rfpId); }
}
