// src/app/modules/listings/Listings.routes.ts
import { Router } from "express";
import { upload } from "../../../middlewares/multer";

import {
  AdminCreateListing,
  CheckUpload,
  DeleteListing,
  DeleteListingImage,
  GetAllListings,
  GetPublicListings,
  GetSingleListing,
  PublishListing,
  UpdateListing,
  UploadImages,
  WebhookListings,
} from "./GetListingsByZeppier.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";


const router = Router();

// Admin → Create Listing
router.post("/admin", verifyToken, AdminCreateListing);

// Zapier → Create via webhook
router.post("/webhook", WebhookListings);

// Validate upload link
router.get("/upload/:id", CheckUpload);

// Upload images (images[] or ZIP)
router.post("/upload/:id/images", upload.array("images"), UploadImages);

// ✅ Admin → Update Listing
router.put("/:id", verifyToken, UpdateListing);

// ✅ Admin → Delete specific image
router.delete("/:id/images/:index", verifyToken, DeleteListingImage);

// Admin → Publish Listing
router.put("/:id/publish", verifyToken, PublishListing);

// Admin → Delete Listing
router.delete("/:id",verifyToken, DeleteListing);

// Admin → All Listings
router.get("/all", GetAllListings);

// Public → Published Listings
router.get("/public", GetPublicListings);

// Single Listing
router.get("/:id", GetSingleListing);

export const ListingsRoutes = router;
