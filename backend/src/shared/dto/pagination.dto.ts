import { IPaginationMeta } from "../types";

export class PaginationDto {
    page: number;
    limit: number;

    constructor(page?: number, limit?: number){
        this.page = Math.max(1, page ?? 1);
        this.limit = Math.min(100, Math.max(1, limit ?? 10));
    }

    get skip(): number {
        return (this.page - 1) * this.limit;
    }

    buildMeta(total: number): IPaginationMeta {
        const totalPages = Math.ceil(total/this.limit);
        return {
            total,
            page: this.page,
            limit: this.limit,
            totalPages,
            hasNextPage: this.page < totalPages,
            hasPrevPage: this.page > 1,

        };
    }
}