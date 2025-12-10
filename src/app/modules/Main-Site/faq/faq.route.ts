import express from "express";
import { FaqController } from "./faq.controller";
import { upload } from "../../../middlewares/multer";
import { uploadToS3 } from "../../../shared/s3Upload";

const router = express.Router();

/**
 * @route GET /api/v1/faq
 * @desc Fetch FAQ data
 */
router.get("/", FaqController.getFaq);

/**
 * @route POST /api/v1/faq
 * @desc Create new FAQ page (with optional image)
 */
router.post("/", upload.single("file"), FaqController.createFaq);

/**
 * @route PUT /api/v1/faq
 * @desc Update existing FAQ
 */
router.put("/", upload.single("file"), FaqController.updateFaq);

/**
 * @route POST /api/v1/faq/upload
 * @desc Upload hero image separately (used by admin panel)
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const url = await uploadToS3(req.file, "faq");
    res.status(200).json({ success: true, url });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message || "S3 upload failed" });
  }
});

export const FaqRoutes = router;
