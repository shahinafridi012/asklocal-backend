import { Router } from "express";
import { CheckUpload, UploadImages, WebhookListings } from "./GetListingsByZeppier.controller";
import { upload } from "../../../middlewares/multer";


const router = Router();

// Zapier → Send property details
router.post("/webhook", WebhookListings);

// Frontend → Validate link
router.get("/upload/:id", CheckUpload);

// Frontend → Upload images
router.post(
  "/upload/:id/images",
  upload.array("images"),
  UploadImages
);


export const ListingsRoutes = router;
