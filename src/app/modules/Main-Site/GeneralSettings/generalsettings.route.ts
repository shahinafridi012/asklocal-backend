import express from "express";

import {
  getSettings,
  updateSettings,
  uploadSettingsImage,
} from "./generalsettings.controller";
import { upload } from "../../../middlewares/multer";
import { verifyToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, getSettings);
router.post("/", verifyToken, updateSettings);
router.post("/upload", verifyToken, upload.single("file"), uploadSettingsImage);

export const GeneralSettingsRoute = router;
