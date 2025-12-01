// src/app/modules/Notification/notification.model.ts
import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["admin", "user", "system"], default: "system" },
    createdBy: { type: String, default: "System" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Auto-delete notifications after 7 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export const NotificationModel = model("Notification", NotificationSchema);
