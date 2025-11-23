import express from "express";

import {
  getSettings,
  updateSettings,
  uploadSettingsImage,
} from "./generalsettings.controller";
import { upload } from "../../../middlewares/multer";

const router = express.Router();

router.get("/", getSettings);
router.post("/", updateSettings);
router.post("/upload", upload.single("file"), uploadSettingsImage);

export const GeneralSettingsRoute = router;
