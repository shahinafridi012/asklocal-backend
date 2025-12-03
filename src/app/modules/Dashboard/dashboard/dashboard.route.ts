import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = Router();

// Admin Dashboard → Counts summary
router.get("/overview", DashboardController.getOverview);

export const DashboardRoute = router;
