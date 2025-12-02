import express from "express";
import { forgotPassword, login, logout, me, resetPassword, verifyResetCode } from "./auth.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

// Auth
router.post("/login", login);                     // sets cookie
router.post("/logout", verifyToken, logout);                   // clears cookie
router.get("/me", verifyToken, me);               // returns current admin

// Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export const AuthRoutes =  router;
