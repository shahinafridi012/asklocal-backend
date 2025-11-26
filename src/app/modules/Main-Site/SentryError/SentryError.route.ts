import { Router } from "express";
import { ErrorLogController } from "./SentryError.controller";

const router = Router();

// Frontend → send errors
router.post("/frontend", ErrorLogController.logFrontendError);

// Admin dashboard → fetch all errors
router.get("/all", ErrorLogController.getAllErrors);

// Admin → delete one log
router.delete("/:id", ErrorLogController.deleteError);

// Admin → clear all logs
router.delete("/clear/all", ErrorLogController.clearAllErrors);

export const SentryError = router;
