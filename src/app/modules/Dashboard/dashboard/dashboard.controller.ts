import { Request, Response } from "express";
import { AdminModel } from "../../Main-Site/admin/admin.model";
import { Agent } from "../../Main-Site/AgentManagement/agent.model";
import { ErrorLogService } from "../../Main-Site/SentryError/SentryError.service";
import { ListingsModel } from "../../Api/ZeppierListings/GetListingsByZeppier.model";


export class DashboardController {
  static async getOverview(_req: Request, res: Response) {
    try {
      // Count all collections
      const [adminCount, agentCount, errorCount, listing] = await Promise.all([
        AdminModel.countDocuments(),
        Agent.countDocuments(),
        ErrorLogService.countAll ? ErrorLogService.countAll() : 0,
        ListingsModel.countDocuments(),
      ]);

      // Response object
      const data = {
        admins: adminCount,
        agents: agentCount,
        errorLogs: errorCount,
        listings: listing,
      };

      res.json({ success: true, data });
    } catch (error) {
      console.error("Dashboard count error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load dashboard overview",
      });
    }
  }
}
