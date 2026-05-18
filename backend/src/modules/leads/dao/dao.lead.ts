import { ILeadDocument } from "../interfaces/lead.interface";
import { LeadModel } from "../model/lead.model";

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
}

export const leadDao = new LeadDao();