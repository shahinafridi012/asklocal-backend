import express from "express";
import { AsklocalMcSoapUserController } from "./asklocal-mc.controller";

const router = express.Router();

// CREATE SOAP USER
router.post("/create-mc-soap-user", AsklocalMcSoapUserController.CreateMcSoapUser);

// GET ALL SOAP USERS
router.get("/all", AsklocalMcSoapUserController.GetAllMcSoapUsers);

// DELETE SINGLE SOAP USER
router.delete("/:id", AsklocalMcSoapUserController.DeleteMcSoapUser);
router.delete("/clear/all", AsklocalMcSoapUserController.ClearAllMcSoapUsers);

export const AsklocalMcSoapUserRoutes = router;
