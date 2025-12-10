import express from "express";
import { upload } from "../../../middlewares/multer";
import { PrivacyController } from "./page.controller";

const router = express.Router();

/**
 * @route GET /api/v1/privacy
 * @desc Get Privacy Policy data
 */
router.get("/", PrivacyController.getPrivacy);

/**
 * @route POST /api/v1/privacy
 * @desc Create or Update Privacy Policy
 */
router.post("/", PrivacyController.createOrUpdate);

/**
 * @route PUT /api/v1/privacy
 * @desc Explicit update
 */
router.put("/", PrivacyController.updatePrivacy);

/**
 * @route POST /api/v1/privacy/upload
 * @desc Upload hero image
 */
router.post("/upload", upload.single("file"), PrivacyController.uploadHero);

export const PrivacyRoutes = router;
