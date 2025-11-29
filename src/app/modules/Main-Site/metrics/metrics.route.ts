// src/app/modules/metrics/metrics.routes.ts
import { Router } from "express";
import { MetricsController } from "./metrics.controller";

const router = Router();

router.post("/", MetricsController.create);
router.get("/", MetricsController.getAll);
router.get("/:route", MetricsController.getByRoute);

// 🧹 Clear ALL metrics
router.delete("/clear", MetricsController.clearAll);

// 🧹 Cleanup (delete metrics older than 30 days)
router.delete("/cleanup", MetricsController.cleanup);

export const MetricsRoutes = router;
