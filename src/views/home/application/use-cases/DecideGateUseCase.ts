import type { IRfpRepository } from '../../domain/ports/IRfpRepository';
import type { Gate, DecideGateInput } from '../../domain/entities/Gate';

export class DecideGateUseCase {
  constructor(private readonly repo: IRfpRepository) {}
  execute(input: DecideGateInput): Promise<Gate> { return this.repo.decideGate(input); }
}
