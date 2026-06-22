import type { Gate, DecideGateInput } from '../../domain/entities/Gate';
import type { Proposal } from '../../domain/entities/Proposal';
import type { Rfp } from '../../domain/entities/Rfp';
import type { RiskSupplier } from '../../domain/entities/Risk';
import type { ScoreSupplier } from '../../domain/entities/Score';
import type { Supplier } from '../../domain/entities/Supplier';
import type { Variable } from '../../domain/entities/Variable';
import type { IRfpRepository } from '../../domain/ports/IRfpRepository';

export class BEApiRfpRepository implements IRfpRepository {
  private readonly base = process.env.API_URL ?? 'http://localhost:3001/api/v1';

  constructor(private readonly token: string) {}

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      headers: { Authorization: `Bearer ${this.token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API ${res.status} GET ${path}`);
    return res.json() as Promise<T>;
  }

  findAllRfps(): Promise<Rfp[]> { return this.get('/rfps'); }
  findRfpById(rfpId: string): Promise<Rfp> { return this.get(`/rfps/${rfpId}`); }
  findSuppliersByRfpId(rfpId: string): Promise<Supplier[]> { return this.get(`/rfps/${rfpId}/proveedores`); }
  findProposalsByRfpId(rfpId: string): Promise<Proposal[]> { return this.get(`/rfps/${rfpId}/propuestas`); }
  findScoresByRfpId(rfpId: string): Promise<ScoreSupplier[]> { return this.get(`/rfps/${rfpId}/scores`); }
  findVariablesByRfpId(rfpId: string, supplierId?: string): Promise<Variable[]> {
    const qs = supplierId ? `?supplierId=${encodeURIComponent(supplierId)}` : '';
    return this.get(`/rfps/${rfpId}/variables${qs}`);
  }
  findRisksByRfpId(rfpId: string): Promise<RiskSupplier[]> { return this.get(`/rfps/${rfpId}/riesgo`); }
  findGatesByRfpId(rfpId: string): Promise<Gate[]> { return this.get(`/rfps/${rfpId}/gates`); }

  async decideGate(input: DecideGateInput): Promise<Gate> {
    const res = await fetch(`${this.base}/rfps/${input.rfpId}/gates/${input.gateId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: input.status,
        decidedBy: input.decidedBy,
        rationale: input.rationale,
      }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API ${res.status} PATCH /rfps/${input.rfpId}/gates/${input.gateId}`);
    return res.json() as Promise<Gate>;
  }
}
