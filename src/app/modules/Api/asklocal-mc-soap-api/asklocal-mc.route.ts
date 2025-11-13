import express from "express";
import { AsklocalMcSoapUserController } from "./asklocal-mc.controller";

const router = express.Router();

// CREATE SOAP USER
router.post(
  "/create-mc-soap-user",
  AsklocalMcSoapUserController.CreateMcSoapUser
);

// You can add more routes later ↓
// router.get("/all", AsklocalMcSoapUserController.GetAllUsers);
// router.get("/:email", AsklocalMcSoapUserController.GetUserByEmail);

export const AsklocalMcSoapUserRoutes = router;
