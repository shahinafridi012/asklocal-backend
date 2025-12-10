import { Request, Response } from "express";
import { FaqService } from "./faq.service";

export const FaqController = {
  async getFaq(req: Request, res: Response) {
    try {
      const faq = await FaqService.getFaq();
      res.status(200).json({ success: true, data: faq });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async createFaq(req: Request, res: Response) {
    try {
      const file = req.file;
      const bodyData = JSON.parse(req.body.data);

      const faq = await FaqService.createFaq(bodyData, file);

      res.status(201).json({
        success: true,
        message: "FAQ page created successfully ✅",
        data: faq,
      });
    } catch (err: any) {
      console.error("FAQ create error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateFaq(req: Request, res: Response) {
    try {
      const file = req.file;
      const bodyData = JSON.parse(req.body.data);

      const faq = await FaqService.updateFaq(bodyData, file);

      res.status(200).json({
        success: true,
        message: "FAQ page updated successfully ✅",
        data: faq,
      });
    } catch (err: any) {
      console.error("FAQ update error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
