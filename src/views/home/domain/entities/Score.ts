export interface ScoreDimension {
  dimensionId: string;
  dimensionName: string;
  score: number;
  weight: number | null;
}

export interface ScoreSupplier {
  supplierId: string;
  supplierName: string;
  dimensions: ScoreDimension[];
}
