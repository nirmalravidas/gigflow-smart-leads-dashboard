
// Enums
export const UserRole = { 
    ADMIN: 'admin', 
    SALES: 'sales' 
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const LeadStatus = { 
    NEW: 'New', 
    CONTACTED: 'Contacted', 
    QUALIFIED: 'Qualified', 
    LOST: 'Lost' 
} as const;

export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus];

export const LeadSource = { 
    WEBSITE: 'Website', 
    INSTAGRAM: 'Instagram', 
    REFERRAL: 'Referral' 
} as const;
export type LeadSource = typeof LeadSource[keyof typeof LeadSource];

export const SortOrder = { 
    LATEST: 'latest', 
    OLDEST: 'oldest' 
} as const;
export type SortOrder = typeof SortOrder[keyof typeof SortOrder];

// User
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

// Auth
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ISignupDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ISigninDto {
  email: string;
  password: string;
}

// Leads
export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: { _id: string; name: string; email: string } | null;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLeadDto {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
}

export type IUpdateLeadDto = Partial<ICreateLeadDto>;

export interface ILeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

export interface ILeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}

// Pagination
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

// API Response
export interface IApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}
