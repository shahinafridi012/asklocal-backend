import { FilterQuery } from "mongoose";
import { Agent } from "./agent.model";
import { AgentAttrs, AgentDoc } from "./agent.interface";

export const AgentService = {
  async create(data: AgentAttrs): Promise<AgentDoc> {
    return Agent.create(data);
  },

  async update(id: string, data: Partial<AgentAttrs>): Promise<AgentDoc | null> {
    return Agent.findByIdAndUpdate(id, data, { new: true });
  },

  async remove(id: string): Promise<AgentDoc | null> {
    return Agent.findByIdAndDelete(id);
  },

  async getById(id: string): Promise<AgentDoc | null> {
    return Agent.findById(id);
  },

  async list(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: "active" | "inactive";
  }) {
    const { page = 1, limit = 10, q, status } = params;

    const filter: FilterQuery<AgentDoc> = {};
    if (q) {
      filter.$or = [
        { first: { $regex: q, $options: "i" } },
        { last: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { businessName: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Agent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Agent.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  },
};
