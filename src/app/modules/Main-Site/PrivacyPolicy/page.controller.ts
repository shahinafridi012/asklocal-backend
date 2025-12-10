import { Request, Response } from "express";
import { uploadToS3 } from "../../../shared/s3Upload";
import { PrivacyService } from "./page.service";

export const PrivacyController = {
  // 🟢 Get Privacy Policy
  async getPrivacy(req: Request, res: Response) {
    try {
      const page = await PrivacyService.get();
      res.status(200).json({ success: true, data: page });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🟡 Create or Update
  async createOrUpdate(req: Request, res: Response) {
    try {
      const { hero, content } = req.body;
      const parsedHero = typeof hero === "string" ? JSON.parse(hero) : hero;

      const result = await PrivacyService.createOrUpdate({
        hero: parsedHero,
        content,
      });

      res.status(200).json({
        success: true,
        message: "Privacy Policy saved successfully",
        data: result,
      });
    } catch (err: any) {
      console.error("Privacy save error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🟠 Explicit Update
  async updatePrivacy(req: Request, res: Response) {
    try {
      const { hero, content } = req.body;
      const parsedHero = typeof hero === "string" ? JSON.parse(hero) : hero;

      const updated = await PrivacyService.update({
        hero: parsedHero,
        content,
      });

      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Privacy Policy not found" });

      res
        .status(200)
        .json({ success: true, message: "Privacy updated successfully", data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🔵 Upload Hero Image
  async uploadHero(req: Request, res: Response) {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });

      const url = await uploadToS3(req.file, "privacy");
      res.status(200).json({ success: true, url });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
