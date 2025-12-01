import express from "express";
import multer from "multer";
import {
  createHomepageTestimonial,
  getAllHomepageTestimonials,
  getHomepageTestimonialById,
  updateHomepageTestimonial,
  deleteHomepageTestimonial,
  deleteAllHomepageTestimonials,
  updateSortOrder,
  uploadHomepageImage,
} from "./homepageTestimonial.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CRUD
router.post("/", createHomepageTestimonial);
router.get("/", getAllHomepageTestimonials);
router.get("/:id", getHomepageTestimonialById);
router.put("/:id", updateHomepageTestimonial);
router.delete("/:id", deleteHomepageTestimonial);
router.delete("/", deleteAllHomepageTestimonials);

// Sort
router.put("/sort/update", updateSortOrder);

// Upload
router.post("/upload", upload.single("file"), uploadHomepageImage);

export const HomepageTestimonialRoutes = router;
