export interface ILeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}