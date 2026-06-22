export interface Variable {
  id: string;
  variableId: string;
  dimension: string;
  rfpId: string;
  supplierId: string;
  supplierName: string;
  value: string;
  confidence: number;
  flagged: boolean;
}
