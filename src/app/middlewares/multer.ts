import multer from "multer";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Allow images
  if (allowedImageTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  // Allow ZIP files
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed"
  ) {
    return cb(null, true);
  }

  cb(new Error("Only images or ZIP files are allowed"), false);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // Allow ZIP up to 200MB
  },
});
