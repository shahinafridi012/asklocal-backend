import express from "express";
import { UserFlowController } from "./UserFlow.controller";


const router = express.Router();
router.post("/user-info", UserFlowController.createUser);
router.post("/update-flow", UserFlowController.updateFlow);
router.post("/verify", UserFlowController.verifyCode);
router.post("/resend-code", UserFlowController.resendCode); // ⭐ ADDED



export const AccessYourConcisergeFlow = router;
