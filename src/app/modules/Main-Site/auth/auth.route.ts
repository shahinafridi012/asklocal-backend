import express from "express";
import { login, logout, me } from "./auth.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.get("/me", verifyToken, me);
router.post("/logout", verifyToken, logout);

export const AuthRoutes = router;
