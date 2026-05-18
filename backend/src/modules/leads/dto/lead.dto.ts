import { LeadSource, LeadStatus, SortOrder } from "../../../types";


// create lead DTO
export interface ICreateLeadDto {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
}

// update lead DTO
export type IUpdateLeadDto = Partial<ICreateLeadDto>;

// lead filter DTO
export interface ILeadFilterDto {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

// lead response DTO
export interface ILeadResponseDto {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// csv row DTO
export interface ILeadCsvRowDto {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
}

// stats DTO
export interface ILeadStatsDto {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}
