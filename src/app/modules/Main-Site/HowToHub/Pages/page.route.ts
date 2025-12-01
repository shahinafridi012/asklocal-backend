import express from "express";
import { PageController } from "./page.controller";
import { upload } from "../../../../middlewares/multer";
import { verifyToken } from "../../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), PageController.upload);
router.post("/", verifyToken, PageController.create);
router.get("/",  PageController.list);
router.get("/:slug",PageController.getBySlug);
router.put("/:id", verifyToken, PageController.update);
router.delete("/:id", verifyToken, PageController.remove);

export const PagesRoute = router;
