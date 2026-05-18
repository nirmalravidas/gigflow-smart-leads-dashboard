import { Document } from 'mongoose';
import { ICreateLeadDto, IUpdateLeadDto } from '../dto/lead.dto';
import { IJwtPayload, ILead, ILeadFilters, ILeadStats, IPaginatedResponse } from '../../../types';

// Lead Document Interface
export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

// Lead Service Interface
export interface ILeadService {
  createLead(dto: ICreateLeadDto, requestingUser: IJwtPayload): Promise<ILeadDocument>;
  getLeads(filters: ILeadFilters, requestingUser: IJwtPayload): Promise<IPaginatedResponse<ILeadDocument>>;
  getLeadById(id: string, requestingUser: IJwtPayload): Promise<ILeadDocument>;
  updateLead(id: string, dto: IUpdateLeadDto, requestingUser: IJwtPayload): Promise<ILeadDocument>;
  deleteLead(id: string, requestingUser: IJwtPayload): Promise<void>;
  exportLeadsToCSV(filters: Omit<ILeadFilters, 'page' | 'limit'>, requestingUser: IJwtPayload): Promise<ILeadDocument[]>;
  getLeadStats(requestingUser: IJwtPayload): Promise<ILeadStats>;
}

// Lead Repository Interface
export interface ILeadRepository {
  findById(id: string): Promise<ILeadDocument | null>;
  findPaginated(query: ILeadQuery, page: number, limit: number, sort: 1 | -1): Promise<{ 
    leads: ILeadDocument[]; 
    total: number 
    }>;
  findAll(query: ILeadQuery, sort: 1 | -1): Promise<ILeadDocument[]>;
  create(dto: ICreateLeadDto & { createdBy: string }): Promise<ILeadDocument>;
  update(lead: ILeadDocument, dto: IUpdateLeadDto): Promise<ILeadDocument>;
  delete(id: string): Promise<void>;
  aggregateStats(matchStage: Record<string, unknown>): Promise<ILeadStats>;
}

// Lead DAO Interface
export interface ILeadDao {
  findById(id: string): Promise<ILeadDocument | null>;
  findWithFilters(query: Record<string, unknown>, options: ILeadQueryOptions): Promise<ILeadDocument[]>;
  count(query: Record<string, unknown>): Promise<number>;
  create(data: Record<string, unknown>): Promise<ILeadDocument>;
  save(lead: ILeadDocument): Promise<ILeadDocument>;
  deleteById(id: string): Promise<void>;
}

// Lead Query Types
export interface ILeadQuery {
  status?: string;
  source?: string;
  createdBy?: string;
  $or?: Array<{ 
        name?: { $regex: string; $options: string }; 
        email?: { $regex: string; $options: string } 
    }>;
}

export interface ILeadQueryOptions {
  sort: { createdAt: 1 | -1 };
  skip: number;
  limit: number;
  populate: Array<{ path: string; select: string }>;
}
