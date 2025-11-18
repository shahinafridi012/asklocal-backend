import express from "express";
import { PartnerFlowController } from "./asklocalPartner.controller";

const router = express.Router();

router.post("/Create", PartnerFlowController.createUser);
router.post("/verify", PartnerFlowController.verifyCode);
router.post("/resend-code", PartnerFlowController.resendCode);

export const PartnerFlowRoutes = router;
