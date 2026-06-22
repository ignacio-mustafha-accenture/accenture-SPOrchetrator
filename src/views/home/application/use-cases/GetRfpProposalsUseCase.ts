import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Proposal } from '../../domain/entities/Proposal';

export class GetRfpProposalsUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string): Promise<Proposal[]> { return this.repo.findProposalsByRfpId(rfpId); }
}
