import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { ScoreSupplier } from '../../domain/entities/Score';

export class GetRfpScoresUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(rfpId: string): Promise<ScoreSupplier[]> { return this.repo.findScoresByRfpId(rfpId); }
}
