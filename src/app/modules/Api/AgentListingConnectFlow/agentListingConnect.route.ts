import express from "express";
import { ListingAgentConnectController } from "./agentListingConnect.controller";

const router = express.Router();

// CREATE USER + SEND OTP
router.post("/create", ListingAgentConnectController.createUser);

// VERIFY OTP
router.post("/verify", ListingAgentConnectController.verifyCode);

// RESEND OTP
router.post("/resend", ListingAgentConnectController.resendCode);

export const ListingAgentConnectRoutes = router;
