export type ProposalStatus = 'confirmed' | 'review' | 'pending' | 'rejected';

export interface Proposal {
  proposalId: string;
  rfpId: string;
  supplierId: string;
  supplierName: string;
  submissionDate: string;
  status: ProposalStatus;
  globalConfidence: number;
}
