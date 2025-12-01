// src/app/modules/Notification/notification.routes.ts
import express from "express";
import { NotificationController } from "./Controller&Service";

const router = express.Router();

router.get("/", NotificationController.getAll);
router.patch("/:id/read", NotificationController.markAsRead);

export const NotificationRoutes = router;
