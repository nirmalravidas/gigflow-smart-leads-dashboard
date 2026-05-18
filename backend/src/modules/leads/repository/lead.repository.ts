import { ILeadFilters, SortOrder } from "@/types";
import { leadDao } from "../dao/dao.lead";
import { ILeadDocument } from "../interfaces/lead.interface";
import { PaginationDto } from "@/dto/pagination.dto";

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