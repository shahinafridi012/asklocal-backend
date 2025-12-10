import express from "express";
import { upload } from "../../../middlewares/multer";
import { TermsController } from "./page.controller";

const router = express.Router();

/**
 * @route GET /api/v1/terms
 * @desc Get Terms of Use
 */
router.get("/", TermsController.getTerms);

/**
 * @route POST /api/v1/terms
 * @desc Create or Update Terms of Use (auto)
 */
router.post("/", TermsController.createOrUpdate);

/**
 * @route PUT /api/v1/terms
 * @desc Explicit update
 */
router.put("/", TermsController.updateTerms);

/**
 * @route POST /api/v1/terms/upload
 * @desc Upload hero image for Terms page
 */
router.post("/upload", upload.single("file"), TermsController.uploadHero);

export const TermsRoutes = router;
