import { leadRepository } from '../repository/lead.repository';
import { ILeadDocument } from '../interfaces/lead.interface';
import { ICreateLeadDto, IUpdateLeadDto } from '../dto/lead.dto';
import { IJwtPayload, ILeadFilters, ILeadStats, IPaginatedResponse, UserRole } from '../../../types';
import { PaginationDto } from '../../../dto/pagination.dto';
import { ForbiddenError, NotFoundError } from '../../../utils/errors/AppError';

class LeadService {

    // Create 
    async createLead(dto: ICreateLeadDto, requestingUser: IJwtPayload): Promise<ILeadDocument> {
        return leadRepository.create(dto, requestingUser.userId);
    }

    // list
    async getLeads( filters: ILeadFilters, requestingUser: IJwtPayload,): Promise<IPaginatedResponse<ILeadDocument>> {
        const scopeCondition = this.buildScopeCondition(requestingUser);
        const pagination = new PaginationDto(filters.page, filters.limit);

        const { leads, total } = await leadRepository.findPaginated(
            { 
                ...filters, 
                page: pagination.page, 
                limit: pagination.limit 
            },
            scopeCondition,
        );

        return {
            data: leads,
            meta: pagination.buildMeta(total),
        };
    }

    // Get One lead by id
    async getLeadById(id: string, requestingUser: IJwtPayload): Promise<ILeadDocument> {
        const lead = await leadRepository.findById(id);
        if (!lead) throw new NotFoundError('Lead');
        this.assertAccess(lead, requestingUser);
        return lead;
    }

    // Update 
    async updateLead(id: string, dto: IUpdateLeadDto, requestingUser: IJwtPayload,): Promise<ILeadDocument> {
        const lead = await leadRepository.findById(id);
        if (!lead) throw new NotFoundError('Lead');
        this.assertAccess(lead, requestingUser);
        return leadRepository.update(lead, dto);
    }

    // delete
    async deleteLead(id: string, requestingUser: IJwtPayload): Promise<void> {
        const lead = await leadRepository.findById(id);
        if (!lead) throw new NotFoundError('Lead');
        this.assertAccess(lead, requestingUser);
        await leadRepository.delete(id);
    }

  // CSV Export
    async exportLeadsToCSV( 
        filters: Omit<ILeadFilters, 'page' | 'limit'>, 
        requestingUser: IJwtPayload, 
    ): Promise<ILeadDocument[]> {
        const scopeCondition = this.buildScopeCondition(requestingUser);
        return leadRepository.findAll(filters, scopeCondition);
    }

    // Stats
    async getLeadStats(requestingUser: IJwtPayload): Promise<ILeadStats> {
        const scopeCondition = this.buildScopeCondition(requestingUser);
        return leadRepository.getStats(scopeCondition);
    }

   // Sales users see only their own leads; Admins see all.
    private buildScopeCondition(requestingUser: IJwtPayload): Record<string, unknown> {
        if (requestingUser.role === UserRole.SALES) {
            return { 
                createdBy: requestingUser.userId 
            };
        }
        return {};
    }

    // Sales users can only access leads they created.
    // Admins have unrestricted access.
    private assertAccess(lead: ILeadDocument, requestingUser: IJwtPayload): void {
        if ( requestingUser.role !== UserRole.ADMIN && lead.createdBy.toString() !== requestingUser.userId ) {
            throw new ForbiddenError('You do not have access to this lead');
        }
    }
}

export const leadService = new LeadService();
