import { Request, Response } from "express";
import { uploadToS3 } from "../../../shared/s3Upload";
import { TermsService } from "./page.srevice";

export const TermsController = {
  // 🟢 Get Terms
  async getTerms(req: Request, res: Response) {
    try {
      const terms = await TermsService.get();
      res.status(200).json({ success: true, data: terms });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🟡 Create or Update
  async createOrUpdate(req: Request, res: Response) {
    try {
      const { hero, content } = req.body;
      const parsedHero = typeof hero === "string" ? JSON.parse(hero) : hero;

      const result = await TermsService.createOrUpdate({
        hero: parsedHero,
        content,
      });

      res.status(200).json({
        success: true,
        message: "Terms of Use saved successfully",
        data: result,
      });
    } catch (err: any) {
      console.error("Terms save error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🟠 Explicit Update
  async updateTerms(req: Request, res: Response) {
    try {
      const { hero, content } = req.body;
      const parsedHero = typeof hero === "string" ? JSON.parse(hero) : hero;

      const updated = await TermsService.update({
        hero: parsedHero,
        content,
      });

      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Terms page not found" });

      res
        .status(200)
        .json({ success: true, message: "Terms updated successfully", data: updated });
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

      const url = await uploadToS3(req.file, "terms");
      res.status(200).json({ success: true, url });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
