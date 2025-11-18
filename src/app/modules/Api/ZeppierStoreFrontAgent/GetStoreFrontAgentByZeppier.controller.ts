import { Request, Response } from "express";
import { ZapierService } from "./GetStoreFrontAgentByZeppier.service";

export class ZapierController {
  static async receive(req: Request, res: Response) {
    try {
      console.log("🔔 Zapier Webhook Received:", req.body);

      const savedData = await ZapierService.saveData(req.body);

      return res.status(200).json({
        success: true,
        message: "Zapier data saved successfully",
        data: savedData,
      });
    } catch (error) {
      console.error("❌ Webhook Error:", error);
      return res.status(500).json({ success: false, error });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const records = await ZapierService.getAll();

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (error) {
      console.error("❌ List Error:", error);
      return res.status(500).json({ success: false, error });
    }
  }
}
