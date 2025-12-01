// src/app/modules/Notification/notification.controller.ts
import { Request, Response } from "express";
import { NotificationModel } from "./notification.model";

export const NotificationController = {
  // 🔹 Get all recent notifications
  async getAll(req: Request, res: Response) {
    const notifications = await NotificationModel.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: notifications });
  },

  // 🔹 Mark as read
  async markAsRead(req: Request, res: Response) {
    await NotificationModel.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true, message: "Notification marked as read" });
  },
};
