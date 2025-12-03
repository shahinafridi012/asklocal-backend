import express from "express";
import { login, logout, me } from "./auth.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, me);

export const AuthRoutes = router;
