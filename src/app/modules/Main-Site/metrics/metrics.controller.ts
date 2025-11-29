// src/app/modules/metrics/metrics.controller.ts
import { Request, Response } from "express";
import { MetricsService } from "./metrics.service";

export class MetricsController {
  static async create(req: Request, res: Response) {
    try {
      const result = await MetricsService.createMetric(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const metrics = await MetricsService.getAll();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getByRoute(req: Request, res: Response) {
    try {
      const { route } = req.params;
      const metrics = await MetricsService.getByRoute(route);
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ Clear all metrics
  // ✅ Fix this function
  static async clearAll(req: Request, res: Response) {
    try {
      // 🔹 FIX: add parentheses to actually run the function
      const deleted = await MetricsService.clearAll();
      console.log("Deleted metrics:", deleted);
      res.json({ success: true, deleted });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to clear metrics",
      });
    }
  }

  // ✅ Cleanup old metrics
  static async cleanup(req: Request, res: Response) {
    try {
      const deleted = await MetricsService.cleanupOld(30);
      console.log("Cleaned old metrics:", deleted);
      res.json({ success: true, deleted });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Error during cleanup",
      });
    }
  }
}
