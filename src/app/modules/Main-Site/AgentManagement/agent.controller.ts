import { Request, Response } from "express";
import { AgentService } from "./agent.service";
import { AgentAttrs } from "./agent.interface";
import bcrypt from "bcrypt";

const ok = (res: Response, data: any, message = "OK") =>
  res.status(200).json({ success: true, message, data });

const created = (res: Response, data: any, message = "Created") =>
  res.status(201).json({ success: true, message, data });

const bad = (res: Response, message = "Bad Request") =>
  res.status(400).json({ success: false, message });

export const AgentController = {
  // POST /agents
  create: async (req: Request, res: Response) => {
    try {
      const {
        first,
        last,
        email,
        pwd,
        businessName,
        lineOfBusiness,
        category,
        status,
        descriptionHtml,
        agentPhoto,
        businessPhoto,
        locations,
        hours,
      } = req.body as any;

      if (!first || !last || !email || !pwd || !businessName) {
        return bad(res, "Missing required fields");
      }

      const pwdHash = await bcrypt.hash(pwd, 10);

      const payload: AgentAttrs = {
        first,
        last,
        email,
        pwdHash,
        businessName,
        lineOfBusiness: lineOfBusiness || "",
        category: category || "Real Estate",
        status: status === "inactive" ? "inactive" : "active",
        descriptionHtml: descriptionHtml || "",
        agentPhoto: agentPhoto || "",
        businessPhoto: businessPhoto || "",
        locations: Array.isArray(locations) ? locations : [],
        hours,
      };

      const doc = await AgentService.create(payload);
      return created(res, doc, "Agent created successfully");
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // GET /agents
  list: async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const q = (req.query.q as string) || undefined;
      const status = (req.query.status as "active" | "inactive") || undefined;

      const data = await AgentService.list({ page, limit, q, status });
      return ok(res, data, "Agents fetched successfully");
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // GET /agents/:id
  getById: async (req: Request, res: Response) => {
    try {
      const doc = await AgentService.getById(req.params.id);
      if (!doc)
        return res
          .status(404)
          .json({ success: false, message: "Agent not found" });
      return ok(res, doc, "Agent fetched");
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // Get Agent by slug
  getBySlug: async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug.toLowerCase();

      const agents = await AgentService.listAll(); // or Agent.find()
      const found = agents.find((a) => {
        const generatedSlug = a.businessName
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        return generatedSlug === slug;
      });

      if (!found) {
        return res
          .status(404)
          .json({ success: false, message: "Agent not found for slug" });
      }

      return res.status(200).json({ success: true, data: found });
    } catch (e: any) {
      return res
        .status(500)
        .json({ success: false, message: e.message || "Server error" });
    }
  },

  // PUT /agents/:id
  update: async (req: Request, res: Response) => {
    try {
      const data = { ...req.body } as any;

      // If incoming raw pwd, hash it to pwdHash and remove pwd
      if (data.pwd) {
        data.pwdHash = await bcrypt.hash(data.pwd, 10);
        delete data.pwd;
      }

      const doc = await AgentService.update(req.params.id, data);
      if (!doc)
        return res
          .status(404)
          .json({ success: false, message: "Agent not found" });
      return ok(res, doc, "Agent updated successfully");
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // DELETE /agents/:id
  remove: async (req: Request, res: Response) => {
    try {
      const doc = await AgentService.remove(req.params.id);
      if (!doc)
        return res
          .status(404)
          .json({ success: false, message: "Agent not found" });
      return ok(res, doc, "Agent deleted");
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
  // Add Review (user or admin)
  addReview: async (req: Request, res: Response) => {
    try {
      const { name, image, rating, comment, addedBy } = req.body;
      console.log(req.body);
      if (!name || !rating)
        return res
          .status(400)
          .json({ success: false, message: "Name and rating required" });

      const review = {
        name,
        image,
        rating,
        comment,
        addedBy: addedBy || "user",
      };

      const agent = await AgentService.addReview(req.params.id, review);
      return res
        .status(201)
        .json({ success: true, message: "Review added", data: agent });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // Get All Reviews
  getReviews: async (req: Request, res: Response) => {
    try {
      const data = await AgentService.getReviews(req.params.id);
      return res
        .status(200)
        .json({ success: true, message: "Reviews fetched", data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // Edit Review
  editReview: async (req: Request, res: Response) => {
    try {
      const { name, image, rating, comment } = req.body;
      const updated = await AgentService.editReview(
        req.params.id,
        req.params.reviewId,
        {
          name,
          image,
          rating,
          comment,
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Review updated", data: updated });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  //  Delete One Review
  deleteReview: async (req: Request, res: Response) => {
    try {
      const data = await AgentService.deleteReview(
        req.params.id,
        req.params.reviewId
      );
      return res
        .status(200)
        .json({ success: true, message: "Review deleted", data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  // Delete All Reviews
  clearReviews: async (req: Request, res: Response) => {
    try {
      const data = await AgentService.clearReviews(req.params.id);
      return res
        .status(200)
        .json({ success: true, message: "All reviews cleared", data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
};
