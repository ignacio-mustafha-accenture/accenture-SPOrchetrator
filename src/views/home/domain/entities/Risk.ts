export type RiskRating = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export interface RiskFactor {
  riskFactor: string;
  rating: RiskRating;
  observation: string | null;
}

export interface RiskSupplier {
  supplierId: string;
  supplierName: string;
  factors: RiskFactor[];
}
