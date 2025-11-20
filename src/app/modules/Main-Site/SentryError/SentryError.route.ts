import { Router } from "express";
import { ErrorLogController } from "./SentryError.controller";

const router = Router();

// Frontend → send errors
router.post("/frontend", ErrorLogController.logFrontendError);

// Admin dashboard → fetch logs
router.get("/all", ErrorLogController.getAllErrors);

export const SentryError = router;
