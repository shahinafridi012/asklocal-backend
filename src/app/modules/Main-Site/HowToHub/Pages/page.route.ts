import express from "express";
import { PageController } from "./page.controller";
import { upload } from "../../../../middlewares/multer";

const router = express.Router();

router.post("/upload", upload.single("file"), PageController.upload);
router.post("/", PageController.create);
router.get("/", PageController.list);
router.get("/:slug", PageController.getBySlug);
router.put("/:id", PageController.update);
router.delete("/:id", PageController.remove);

export const PagesRoute = router;
