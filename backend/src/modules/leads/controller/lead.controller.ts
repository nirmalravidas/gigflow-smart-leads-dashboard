import { Request, Response, NextFunction } from 'express';
import { leadService } from '../service/lead.service';
import { HttpStatus, IAuthenticatedRequest, ILeadFilters, LeadSource, LeadStatus, SortOrder } from '../../../types';
import { sendPaginated, sendSuccess } from '../../../utils/apiResponse';
import { ValidationError } from '../../../utils/errors/AppError';

// extract a scalar query param 
const qs = (val: unknown): string | undefined => {
    if (typeof val === 'string') return val || undefined;
    if (Array.isArray(val) && typeof val[0] === 'string') return val[0] || undefined;
    return undefined;
};

const parseEnum = <T extends Record<string, string>>(
    enumObj: T,
    value: string | undefined,
    field: string,
): T[keyof T] | undefined => {
    if (!value) return undefined;
    const values = Object.values(enumObj) as string[];
    if (!values.includes(value)) {
        throw new ValidationError(`Invalid ${field}`);
    }
    return value as T[keyof T];
};

const parseNumber = (value: string | undefined, field: string, defaultValue: number): number => {
    if (!value) return defaultValue;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
        throw new ValidationError(`Invalid ${field}`);
    }
    return n;
};

const ps = (val: string | string[] | undefined): string =>
  Array.isArray(val) ? (val[0] ?? '') : (val ?? '');

// Lead Controller
class LeadController {
    async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;
            const lead = await leadService.createLead(req.body, authReq.user);
            sendSuccess(res, 'Lead created successfully', lead, HttpStatus.CREATED);
        } catch (error) {
            next(error);
        }
    }

    async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;

            const statusParam = qs(req.query['status']);
            const sourceParam = qs(req.query['source']);
            const sortParam = qs(req.query['sort']);

            const filters: ILeadFilters = {
                status: parseEnum(LeadStatus, statusParam, 'status'),
                source: parseEnum(LeadSource, sourceParam, 'source'),
                search: qs(req.query['search']),
                sort: parseEnum(SortOrder, sortParam, 'sort') ?? SortOrder.LATEST,
                page: parseNumber(qs(req.query['page']), 'page', 1),
                limit: parseNumber(qs(req.query['limit']), 'limit', 10),
            };

            const result = await leadService.getLeads(filters, authReq.user);
            sendPaginated(res, 'Leads fetched successfully', result.data, result.meta);
        } catch (error) {
            next(error);
        }
    }

    async getLeadById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;
            const lead = await leadService.getLeadById(ps(req.params['id']), authReq.user);
            sendSuccess(res, 'Lead fetched successfully', lead);
        } catch (error) {
            next(error);
        }
    }

    async updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;
            const lead = await leadService.updateLead(ps(req.params['id']), req.body, authReq.user);
            sendSuccess(res, 'Lead updated successfully', lead);
        } catch (error) {
            next(error);
        }
    }

    async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;
            await leadService.deleteLead(ps(req.params['id']), authReq.user);
            sendSuccess(res, 'Lead deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;

            const statusParam = qs(req.query['status']);
            const sourceParam = qs(req.query['source']);
            const sortParam = qs(req.query['sort']);

            const filters: Omit<ILeadFilters, 'page' | 'limit'> = {
                status: parseEnum(LeadStatus, statusParam, 'status'),
                source: parseEnum(LeadSource, sourceParam, 'source'),
                search: qs(req.query['search']),
                sort: parseEnum(SortOrder, sortParam, 'sort') ?? SortOrder.LATEST,
            };

            const leads = await leadService.exportLeadsToCSV(filters, authReq.user);

            const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Notes', 'Assigned To', 'Created By', 'Created At'];

            const sanitize = (val: string): string =>
                `"${String(val ?? '').replace(/"/g, '""')}"`;

            const rows = leads.map((lead) => {
                const assignedTo = (lead.assignedTo as unknown as { name?: string } | null)?.name ?? '';
                const createdBy = (lead.createdBy as unknown as { name?: string } | null)?.name ?? '';
                return [
                lead._id.toString(),
                sanitize(lead.name),
                lead.email,
                lead.status,
                lead.source,
                sanitize(lead.notes ?? ''),
                sanitize(assignedTo),
                sanitize(createdBy),
                new Date(lead.createdAt).toISOString(),
                ].join(',');
            });

            const csvContent = [headers.join(','), ...rows].join('\n');
            const filename = `leads-export-${Date.now()}.csv`;

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(HttpStatus.OK).send(csvContent);
        } catch (error) {
            next(error);
        }   
    }

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as IAuthenticatedRequest;
            const stats = await leadService.getLeadStats(authReq.user);
            sendSuccess(res, 'Lead stats fetched successfully', stats);
        } catch (error) {
            next(error);
        }
    }
}

export const leadController = new LeadController();
