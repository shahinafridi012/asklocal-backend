import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { SettingsService } from "./generalsettings.service";
import sendResponse from "../../../utils/sendResponse";
import { uploadToS3 } from "../../../shared/s3Upload";

export const getSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.getSettings();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Settings fetched successfully",
    data: result,
  });
});

export const updateSettings = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await SettingsService.updateSettings(payload);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Settings updated successfully",
    data: result,
  });
});

export const uploadSettingsImage = catchAsync(async (req, res) => {
  if (!req.file) throw new Error("No file uploaded");
  const imageUrl = await uploadToS3(req.file, "listings");

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Image uploaded successfully",
    data: { url: imageUrl },
  });
});
