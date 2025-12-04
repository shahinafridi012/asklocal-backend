import { Router } from "express";
import { GetLoadfastListings } from "./LoadfastListing.controller";

const router = Router();

// Public → optimized lightweight listings
router.get("/", GetLoadfastListings);

export const LoadfastListingRoutes = router;
