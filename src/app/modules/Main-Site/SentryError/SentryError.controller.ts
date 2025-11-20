import { Request, Response } from "express";
import { ErrorLogService } from "./SentryError.service";

export class ErrorLogController {
  // Frontend error logging
  static async logFrontendError(req: Request, res: Response) {
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
  }

  // Backend errors will use global middleware
  // But frontend can fetch logs for dashboard
  static async getAllErrors(req: Request, res: Response) {
    const logs = await ErrorLogService.getAll();
    res.json({ success: true, logs });
  }
}
