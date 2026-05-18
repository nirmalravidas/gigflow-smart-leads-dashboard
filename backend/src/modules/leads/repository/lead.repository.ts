import { ILeadFilters, ILeadStats, SortOrder } from "../../../types";
import { leadDao } from "../dao/dao.lead";
import { ILeadDocument } from "../interfaces/lead.interface";
import { PaginationDto } from "../../../dto/pagination.dto";
import { ICreateLeadDto, IUpdateLeadDto } from "../dto/lead.dto";

class LeadRepository {

    // find lead a single lead by ID
    findById(id: string): Promise<ILeadDocument | null> {
        return leadDao.findById(id);
    }

    // Find leads with pagination, filtering, and sorting
    async findPaginated( filters: ILeadFilters, scopeCondition: Record<string, unknown>,): Promise<{ leads: ILeadDocument[]; total: number }> {
        const query = this.buildQuery(filters, scopeCondition);
        const sort = this.buildSort(filters.sort);
        const pagination = new PaginationDto(filters.page, filters.limit);

        const [leads, total] = await Promise.all([
            leadDao.findWithOptions(query, {
                sort,
                skip: pagination.skip,
                limit: pagination.limit,
                populate: [],
            }),
            leadDao.count(query),
        ]);

        return { leads, total };
    }

    // find all matching leads without pagination
    findAll( filters: Omit<ILeadFilters, 'page' | 'limit'>, scopeCondition: Record<string, unknown>, ): Promise<ILeadDocument[]> {
        const query = this.buildQuery(filters, scopeCondition);
        const sort = this.buildSort(filters.sort);
        return leadDao.findAll(query, sort);
    }


    // Create a new lead.
    create( dto: ICreateLeadDto, createdBy: string, ): Promise<ILeadDocument> {
        return leadDao.create({ ...dto, createdBy });
    }

  // Apply DTO updates to a lead document and persist.
    async update(lead: ILeadDocument, dto: IUpdateLeadDto): Promise<ILeadDocument> {
        Object.assign(lead, dto);
        return leadDao.save(lead);
    }

 
    // delete lead by id
    delete(id: string): Promise<void> {
        return leadDao.deleteById(id);
    }

  // Get aggregated stats for a set of leads.
    getStats(scopeCondition: Record<string, unknown>): Promise<ILeadStats> {
        return leadDao.getStats(scopeCondition);
    }

    // helpers
    private buildQuery( filters: Omit<ILeadFilters, 'page' | 'limit'>, scopeCondition: Record<string, unknown>, ): Record<string, unknown> {
        const query: Record<string, unknown> = { ...scopeCondition };

        if (filters.status) {
            query['status'] = filters.status;
        }

        if (filters.source) {
            query['source'] = filters.source;
        }

        if (filters.search) {
            const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query['$or'] = [
                { name: { $regex: escaped, $options: 'i' } },
                { email: { $regex: escaped, $options: 'i' } },
            ];
        }

        return query;
    }

    private buildSort(sort?: SortOrder): { createdAt: 1 | -1 } {
        return { createdAt: sort === SortOrder.OLDEST ? 1 : -1 };
    }
}

export const leadRepository = new LeadRepository();
