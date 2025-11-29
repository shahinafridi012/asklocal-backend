// src/app/modules/listings/Listings.routes.ts
import { Router } from "express";

import { upload } from "../../../middlewares/multer"; // memoryStorage
import { AdminCreateListing, CheckUpload, DeleteListing, GetAllListings, GetPublicListings, GetSingleListing, PublishListing, UploadImages, WebhookListings } from "./GetListingsByZeppier.controller";

const router = Router();
router.post("/admin", AdminCreateListing);   
// Zapier → send property
router.post("/webhook", WebhookListings);

// Validate upload link
router.get("/upload/:id", CheckUpload);

// Upload images (images[] or a .zip)
router.post("/upload/:id/images", upload.array("images"), UploadImages);

// Admin
router.get("/all", GetAllListings);
router.put("/:id/publish", PublishListing);
router.delete("/:id", DeleteListing);

// Public
router.get("/public", GetPublicListings);

// Single
router.get("/:id", GetSingleListing);

export const ListingsRoutes = router;
