// src/app/modules/Admin/admin.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AdminModel } from "./admin.model";
import bcrypt from "bcrypt";
import { uploadToS3 } from "../../../shared/s3Upload";

// 🟢 Create new admin
export const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phoneNumber, address, role } =
    req.body;

  const existing = await AdminModel.findOne({ email });
  if (existing)
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin already exists",
      data: null,
    });

  let imageUrl = "";
  if (req.file) {
    // you can upload to S3 or use base64/local upload
    imageUrl = await uploadToS3(req.file,"profile-images");
  }

  const admin = await AdminModel.create({
    firstName,
    lastName,
    email: email.trim().toLowerCase(),
    password,
    phoneNumber,
    address,
    role,
    profileImage: imageUrl || null,
  });

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully",
    data: admin,
  });
});

// 🟢 Get all admins
export const getAllAdmins = catchAsync(async (_req: Request, res: Response) => {
  const admins = await AdminModel.find().select("-password");
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All admins fetched successfully",
    data: admins,
  });
});

// 🟢 Get one admin
export const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const admin = await AdminModel.findById(req.params.id).select("-password");
  if (!admin)
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Admin not found",
      data: null,
    });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin fetched successfully",
    data: admin,
  });
});

// 🟢 Update admin
export const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  if (req.file) {
    updateData.profileImage = await uploadToS3(req.file,"profile-images");
  }

  const updated = await AdminModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).select("-password");

  if (!updated)
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Admin not found",
      data: null,
    });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully",
    data: updated,
  });
});

// 🟢 Delete admin
export const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await AdminModel.findByIdAndDelete(id);

  if (!deleted)
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Admin not found",
      data: null,
    });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully",
    data: deleted,
  });
});
