export type RfpStatus = 'parsing' | 'evaluacion' | 'aprobacion' | 'completo';
export type StageStatus = 'running' | 'done' | 'hitl';

export interface Rfp {
  rfpId: string;
  name: string;
  categoryId: string;
  categoryName: string;
  estimatedValueUsd: number;
  deadline: string;
  status: RfpStatus;
  progressPct: number;
  invitedSuppliers: number;
  stage: string | null;
  activeAgent: string | null;
  stageStatus: StageStatus | null;
  globalConfidence: number | null;
  architecture: string | null;
}
