import express from "express";
import multer from "multer";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "./admin.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔐 Admin Routes
router.post(
  "/",
  upload.single("profileImage"),
  createAdmin
);

router.get("/", getAllAdmins);
router.get("/:id",  getAdminById);
router.put(
  "/:id",
 
  upload.single("profileImage"),
  updateAdmin
);
router.delete("/:id", deleteAdmin);

export const AdminRoutes = router;
