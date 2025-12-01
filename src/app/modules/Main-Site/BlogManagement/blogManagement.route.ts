import express from "express";
import { upload } from "../../../middlewares/multer";
import { uploadToS3 } from "../../../shared/s3Upload";
import { BlogController } from "./blog.management.Controller";
import { verifyToken } from "../../../middlewares/auth.middleware";


const router = express.Router();

// Upload image to S3
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const url = await uploadToS3(req.file!,"blog");
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CRUD operations
router.post("/", verifyToken, BlogController.createBlog);
router.get("/",  BlogController.getAllBlogs);
router.get("/:id",  BlogController.getBlogById);
router.put("/:id", verifyToken, BlogController.updateBlog);
router.delete("/:id", verifyToken, BlogController.deleteBlog);

export const BlogRoutes = router;
