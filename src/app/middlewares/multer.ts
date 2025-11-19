import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),  // store files in RAM
});
