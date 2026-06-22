import type { Gate, DecideGateInput } from '../entities/Gate';
import type { Proposal } from '../entities/Proposal';
import type { Rfp } from '../entities/Rfp';
import type { RiskSupplier } from '../entities/Risk';
import type { ScoreSupplier } from '../entities/Score';
import type { Supplier } from '../entities/Supplier';
import type { Variable } from '../entities/Variable';

export interface IRfpRepository {
  findAllRfps(): Promise<Rfp[]>;
  findRfpById(rfpId: string): Promise<Rfp>;
  findSuppliersByRfpId(rfpId: string): Promise<Supplier[]>;
  findProposalsByRfpId(rfpId: string): Promise<Proposal[]>;
  findScoresByRfpId(rfpId: string): Promise<ScoreSupplier[]>;
  findVariablesByRfpId(rfpId: string, supplierId?: string): Promise<Variable[]>;
  findRisksByRfpId(rfpId: string): Promise<RiskSupplier[]>;
  findGatesByRfpId(rfpId: string): Promise<Gate[]>;
  decideGate(input: DecideGateInput): Promise<Gate>;
}
