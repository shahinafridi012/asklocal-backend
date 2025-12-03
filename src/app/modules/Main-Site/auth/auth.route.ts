// src/app/modules/Main-Site/auth/auth.routes.ts
import express from "express";
import {
  login,
  logout,
  me,
  forgotPassword,
  verifyCode,
  resetPassword,
  refreshToken,
} from "./auth.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshToken);
router.get("/me", verifyToken, me);
router.post("/logout", verifyToken, logout);

export const AuthRoutes = router;
