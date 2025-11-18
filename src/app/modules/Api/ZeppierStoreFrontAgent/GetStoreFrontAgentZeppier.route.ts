import { Router } from "express";
import { ZapierController } from "./GetStoreFrontAgentByZeppier.controller";

const router = Router();

router.post("/agents", ZapierController.receive);
router.get("/list", ZapierController.list);

export const GetStoreFrontAgent = router;
