import express from "express";
import { AgentController } from "./agent.controller";
import { upload } from "../../../middlewares/multer";
import { uploadToS3 } from "../../../shared/s3Upload";


 const router= express.Router();

// Image upload (S3) — returns { url }
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const url = await uploadToS3(req.file,"agents");
    return res.status(200).json({ success: true, message: "Uploaded", url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// CRUD
router.post("/", AgentController.create);
router.get("/", AgentController.list);
router.get("/:id", AgentController.getById);
router.put("/:id", AgentController.update);
router.delete("/:id", AgentController.remove);


export const AgentsRoute = router;