import { PipelineStage } from "mongoose";
import { ILeadDocument, ILeadQueryOptions } from "../interfaces/lead.interface";
import { LeadModel } from "../model/lead.model";
import { ILeadStats } from "../../../types";

const POPULATE_CONFIG = [
  { path: 'createdBy', select: 'name email' },
  { path: 'assignedTo', select: 'name email' },
];

class LeadDao {

    // find a single lead by id
    async findById(id: string): Promise<ILeadDocument | null>{
        return LeadModel.findById(id)
            .populate(POPULATE_CONFIG[0]!)
            .populate(POPULATE_CONFIG[1]!);
    }

    // find leads matching a raw query with pagination + sort + populate
    async findWithOptions( query: Record<string, unknown>, options: ILeadQueryOptions, ): Promise<ILeadDocument[]> {
        return LeadModel.find(query)
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .populate(POPULATE_CONFIG[0]!)
        .populate(POPULATE_CONFIG[1]!)
        .lean() as unknown as ILeadDocument[];
    }

    // create a new lead document
    async create(data: Record<string, unknown>): Promise<ILeadDocument> {
        return LeadModel.create(data);
    }

    // save a mutated lead document
    async save(lead: ILeadDocument): Promise<ILeadDocument> {
        await lead.save();
        return lead.populate([POPULATE_CONFIG[0]!, POPULATE_CONFIG[1]!]);
    }

    // delete a lead by id
    async deleteById(id: string): Promise<void> {
        await LeadModel.findByIdAndDelete(id);
    }

    // Find all leads matching query without pagination
    async findAll( query: Record<string, unknown>, sort: { createdAt: 1 | -1 }, ): Promise<ILeadDocument[]> {
        return LeadModel.find(query)
            .sort(sort)
            .populate(POPULATE_CONFIG[0]!)
            .populate(POPULATE_CONFIG[1]!)
            .lean() as unknown as ILeadDocument[];
    }

    // count documents matching a query
    async count(query: Record<string, unknown>): Promise<number> {
        return LeadModel.countDocuments(query);
    }

    // run an aggregation pipline (used for stats)
    async aggregate(pipeline: PipelineStage[]): Promise<Record<string, unknown>[]> {
            return LeadModel.aggregate(pipeline);
    }

    // retrieve aggregated stats
    async getStats(matchCondition: Record<string, unknown>): Promise<ILeadStats> {
        const matchStage: PipelineStage = { $match: matchCondition };
        const groupByStatus: PipelineStage = { 
            $group: { 
                _id: '$status', 
                count: { 
                    $sum: 1 
                }
             } 
        };
        const groupBySource: PipelineStage = { 
            $group: { 
                _id: '$source', 
                count: { 
                    $sum: 1 
                } 
            } 
        };

        const [statusStats, sourceStats, totalResult] = await Promise.all([
        LeadModel.aggregate([matchStage, groupByStatus]),
        LeadModel.aggregate([matchStage, groupBySource]),
        LeadModel.countDocuments(matchCondition),
        ]);

        return {
            total: totalResult,
            byStatus: statusStats.reduce<Record<string, number>>((acc, cur) => {
                acc[cur._id as string] = cur.count as number;
                return acc;
            }, {}),
            bySource: sourceStats.reduce<Record<string, number>>((acc, cur) => {
                acc[cur._id as string] = cur.count as number;
                return acc;
            }, {}),
        };
    }
}

export const leadDao = new LeadDao();
