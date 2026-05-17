import { LeadSource, LeadStatus, SortOrder } from "../enums/lead.enum";

export interface ILeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}