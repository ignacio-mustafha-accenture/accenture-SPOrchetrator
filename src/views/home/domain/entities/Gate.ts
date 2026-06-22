export type GateStatus = 'pending' | 'open' | 'approved' | 'rejected' | 'decided' | 'expired';

export interface Gate {
  gateId: string;
  rfpId: string;
  gateNumber: number;
  label: string;
  status: GateStatus;
  decidedBy: string | null;
  rationale: string | null;
  decisionDate: string | null;
  isIrreversible: boolean;
}

export interface DecideGateInput {
  rfpId: string;
  gateId: string;
  status: 'approved' | 'rejected';
  decidedBy: string;
  rationale?: string;
}
