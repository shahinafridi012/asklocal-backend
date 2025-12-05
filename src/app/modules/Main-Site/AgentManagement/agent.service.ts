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
}
,
  async list(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: "active" | "inactive";
    minRating?: number; // optional filter, e.g., show only agents with >=4 stars
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

    // 🔹 Query Agents with selective fields (to optimize)
    const [items, total] = await Promise.all([
      Agent.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "first last email businessName category locations agentPhoto businessPhoto socialLinks reviews"
        )
        .lean(),
      Agent.countDocuments(filter),
    ]);

    // 🔹 Process reviews and rating summary
    const processed = items.map((agent: any) => {
      const reviews = Array.isArray(agent.reviews) ? agent.reviews : [];
      const totalReviews = reviews.length;
      const avgRating =
        totalReviews > 0
          ? reviews.reduce((sum: number, r: any) => sum + (r.stars || 0), 0) /
            totalReviews
          : 0;

      // Filter for good reviews if requested
      const goodReviews = minRating
        ? reviews.filter((r: any) => (r.stars || 0) >= minRating)
        : reviews;

      return {
        _id: agent._id,
        first: agent.first,
        last: agent.last,
        email: agent.email,
        businessName: agent.businessName,
        category: agent.category,
        locations: agent.locations || [],
        agentPhoto: agent.agentPhoto,
        businessPhoto: agent.businessPhoto,
        socialLinks: agent.socialLinks || {},
        totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
        reviews: goodReviews,
      };
    });

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

  // ✅ Get all reviews
  async getReviews(agentId: string) {
    const agent = await Agent.findById(agentId, "reviews");

    return agent?.reviews || [];
  },

  // ✅ Add review
  async addReview(agentId: string, review: any) {
    return Agent.findByIdAndUpdate(
      agentId,
      { $push: { reviews: review } },
      { new: true, fields: { reviews: 1 } }
    );
    
  },

  // ✅ Edit review
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

  // ✅ Delete one review
  async deleteReview(agentId: string, reviewId: string) {
    return Agent.findByIdAndUpdate(
      agentId,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true, fields: { reviews: 1 } }
    );
  },

  // ✅ Delete all reviews
  async clearReviews(agentId: string) {
    return Agent.findByIdAndUpdate(
      agentId,
      { $set: { reviews: [] } },
      { new: true, fields: { reviews: 1 } }
    );
  },
};
