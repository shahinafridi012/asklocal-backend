import express from "express";
import { AgentController } from "./agent.controller";
import { upload } from "../../../middlewares/multer";
import { uploadToS3 } from "../../../shared/s3Upload";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

// Image upload (S3) — returns { url }
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    const url = await uploadToS3(req.file, "agents");
    return res.status(200).json({ success: true, message: "Uploaded", url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// CRUD
router.post("/", verifyToken, AgentController.create);
router.get("/", AgentController.list);
router.get("/:id", AgentController.getById);

// 🔹 Get agent by slug (must come before /:id)
router.get("/profile/:slug", AgentController.getBySlug);

router.put("/:id", verifyToken, AgentController.update);
router.delete("/:id", verifyToken, AgentController.remove);

// Reviews
router.get("/:id/reviews", AgentController.getReviews);
router.post("/:id/reviews", AgentController.addReview); // user/admin
router.put("/:id/reviews/:reviewId", verifyToken, AgentController.editReview);
router.delete(
  "/:id/reviews/:reviewId",
  verifyToken,
  AgentController.deleteReview
);
router.delete("/:id/reviews", verifyToken, AgentController.clearReviews);

router.post("/upload-review-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });

    const url = await uploadToS3(req.file, "reviews");
    return res.status(200).json({ success: true, message: "Uploaded", url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});
export const AgentsRoute = router;
