import { Agent } from "./agent.model";
import { AgentAttrs, AgentDoc } from "./agent.interface";

export const AgentService = {
  async create(data: AgentAttrs): Promise<AgentDoc> {
    return Agent.create(data);
  },

  async update(
    id: string,
    data: Partial<AgentAttrs>
  ): Promise<AgentDoc | null> {
    return Agent.findByIdAndUpdate(id, data, { new: true });
  },

  async remove(id: string): Promise<AgentDoc | null> {
    return Agent.findByIdAndDelete(id);
  },

  async getById(id: string): Promise<AgentDoc | null> {
    return Agent.findById(id);
  },

  async listAll(): Promise<AgentDoc[]> {
    return Agent.find();
  },
  async list(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: "active" | "inactive";
    minRating?: number; // optional filter
  }) {
    const { page = 1, limit = 10, q, status, minRating } = params;

    const filter: any = {};

    // 🔹 Search Filter
    if (q) {
      filter.$or = [
        { first: { $regex: q, $options: "i" } },
        { last: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { businessName: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { "locations.0": { $regex: q, $options: "i" } },
      ];
    }

    // 🔹 Status Filter
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    // 🔹 Fetch all fields (no .select())
    const [items, total] = await Promise.all([
      Agent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Agent.countDocuments(filter),
    ]);

    // 🔹 Add avgRating + totalReviews (keep this extra info)
    const processed = items
      .map((agent: any) => {
        const reviews = Array.isArray(agent.reviews) ? agent.reviews : [];
        const totalReviews = reviews.length;
        const avgRating =
          totalReviews > 0
            ? reviews.reduce((sum: number, r: any) => sum + (r.stars || 0), 0) /
              totalReviews
            : 0;

        // Apply minRating filter if passed
        if (minRating && avgRating < minRating) return null;

        return {
          ...agent, // keep all fields
          totalReviews,
          avgRating: Number(avgRating.toFixed(1)),
        };
      })
      .filter(Boolean);

    return {
      success: true,
      data: {
        items: processed,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // Get all reviews
  async getReviews(agentId: string) {
    const agent = await Agent.findById(agentId, "reviews");

    return agent?.reviews || [];
  },

  // Add review
  async addReview(agentId: string, review: any) {
    return Agent.findByIdAndUpdate(
      agentId,
      { $push: { reviews: review } },
      { new: true, fields: { reviews: 1 } }
    );
  },

  // Edit review
  async editReview(agentId: string, reviewId: string, updated: any) {
    return Agent.findOneAndUpdate(
      { _id: agentId, "reviews._id": reviewId },
      {
        $set: {
          "reviews.$.name": updated.name,
          "reviews.$.image": updated.image,
          "reviews.$.rating": updated.rating,
          "reviews.$.comment": updated.comment,
        },
      },
      { new: true, fields: { reviews: 1 } }
    );
  },

  //  Delete one review
  async deleteReview(agentId: string, reviewId: string) {
    return Agent.findByIdAndUpdate(
      agentId,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true, fields: { reviews: 1 } }
    );
  },

  //  Delete all reviews
  async clearReviews(agentId: string) {
    return Agent.findByIdAndUpdate(
      agentId,
      { $set: { reviews: [] } },
      { new: true, fields: { reviews: 1 } }
    );
  },
};
