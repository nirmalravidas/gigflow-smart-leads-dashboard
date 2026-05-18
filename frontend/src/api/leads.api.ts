import api from './client';
import type {
  IApiResponse,
  ILead,
  ILeadFilters,
  ILeadStats,
  ICreateLeadDto,
  IUpdateLeadDto,
  IPaginatedResponse,
} from '../types';

const buildParams = (filters: ILeadFilters): Record<string, string | number> => {
  const params: Record<string, string | number> = {};
  if (filters.status)  params['status']  = filters.status;
  if (filters.source)  params['source']  = filters.source;
  if (filters.search)  params['search']  = filters.search;
  if (filters.sort)    params['sort']    = filters.sort;
  if (filters.page)    params['page']    = filters.page;
  if (filters.limit)   params['limit']   = filters.limit;
  return params;
};

export const leadsApi = {
  getLeads: (filters: ILeadFilters = {}) =>
    api.get<IApiResponse<IPaginatedResponse<ILead>>>('/leads', { params: buildParams(filters) }),

  getLead: (id: string) =>
    api.get<IApiResponse<ILead>>(`/leads/${id}`),

  createLead: (dto: ICreateLeadDto) =>
    api.post<IApiResponse<ILead>>('/leads', dto),

  updateLead: (id: string, dto: IUpdateLeadDto) =>
    api.put<IApiResponse<ILead>>(`/leads/${id}`, dto),

  deleteLead: (id: string) =>
    api.delete<IApiResponse>(`/leads/${id}`),

  getStats: () =>
    api.get<IApiResponse<ILeadStats>>('/leads/stats'),

  exportCSV: (filters: Omit<ILeadFilters, 'page' | 'limit'> = {}) =>
    api.get('/leads/export', {
      params: buildParams(filters),
      responseType: 'blob',
    }),
};
