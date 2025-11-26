import { Request, Response } from "express";
import { ErrorLogService } from "./SentryError.service";

export class ErrorLogController {
  // 🔹 Log Frontend Error
  static async logFrontendError(req: Request, res: Response) {
    try {
      const { message, stack, url, user, extra } = req.body;

      const log = await ErrorLogService.createErrorLog({
        source: "frontend",
        message,
        stack,
        route: url,
        method: "CLIENT",
        user,
        extra,
      });

      res.json({ success: true, log });
    } catch (error) {
      console.error("Frontend log error:", error);
      res.status(500).json({ success: false, message: "Error logging frontend error" });
    }
  }

  // 🔹 Fetch All Logs (Frontend + Backend)
  static async getAllErrors(req: Request, res: Response) {
    try {
      const logs = await ErrorLogService.getAll();
      res.json({ success: true, logs });
    } catch (error) {
      console.error("Fetch logs error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch logs" });
    }
  }

  // 🔹 Delete Single Log
  static async deleteError(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ErrorLogService.deleteById(id);
      if (!deleted) return res.status(404).json({ success: false, message: "Log not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete log error:", error);
      res.status(500).json({ success: false, message: "Failed to delete log" });
    }
  }

  // 🔹 Clear All Logs
  static async clearAllErrors(_req: Request, res: Response) {
    try {
      await ErrorLogService.clearAll();
      res.json({ success: true });
    } catch (error) {
      console.error("Clear logs error:", error);
      res.status(500).json({ success: false, message: "Failed to clear logs" });
    }
  }
}
