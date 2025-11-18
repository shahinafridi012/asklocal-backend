import { Router } from "express";
import { ZapierController } from "./GetListingsByZeppier.controller";

const router = Router();

router.post("/all-listings", ZapierController.receive);
router.get("/listings", ZapierController.list);

export const GetStoreFrontAgent = router;
