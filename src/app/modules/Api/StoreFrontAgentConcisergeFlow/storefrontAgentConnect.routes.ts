import express from "express";
import {
  sendVerificationCode,
  verifyCode,
  saveAgentConnect,
  getAllAgentConnects,
  getAgentConnectById,
  updateAgentConnect,
  deleteAgentConnect,
} from "./storefrontAgentConnect.controller";

const router = express.Router();

// 🔹 User-facing routes
router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/save", saveAgentConnect);

// 🔹 Admin CRUD routes
router.get("/", getAllAgentConnects);
router.get("/:id", getAgentConnectById);
router.patch("/:id", updateAgentConnect);
router.delete("/:id", deleteAgentConnect);

export const StorefrontAgentConnectRoutes = router;
