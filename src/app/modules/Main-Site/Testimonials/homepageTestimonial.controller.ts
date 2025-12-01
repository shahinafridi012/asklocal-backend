import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { uploadToS3 } from "../../../shared/s3Upload";
import { HomepageTestimonialService } from "./homepageTestimonial.service";

/* ➕ Create */
export const createHomepageTestimonial = catchAsync(async (req, res) => {
  const result = await HomepageTestimonialService.create(req.body);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Testimonial created successfully",
    data: result,
  });
});

/* 📄 Get All */
export const getAllHomepageTestimonials = catchAsync(async (req, res) => {
  const sort = (req.query.sort as string) || "desc";
  const result = await HomepageTestimonialService.getAll(
    sort === "asc" ? "asc" : "desc"
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Testimonials fetched successfully",
    data: result,
  });
});

/* 🔍 Get by ID */
export const getHomepageTestimonialById = catchAsync(async (req, res) => {
  const result = await HomepageTestimonialService.getById(req.params.id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Testimonial fetched successfully",
    data: result,
  });
});

/* ✏️ Update */
export const updateHomepageTestimonial = catchAsync(async (req, res) => {
  const result = await HomepageTestimonialService.update(req.params.id, req.body);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Testimonial updated successfully",
    data: result,
  });
});

/* 🗑️ Delete One */
export const deleteHomepageTestimonial = catchAsync(async (req, res) => {
  const result = await HomepageTestimonialService.remove(req.params.id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Testimonial deleted successfully",
    data: result,
  });
});

/* 🗑️ Delete All */
export const deleteAllHomepageTestimonials = catchAsync(async (req, res) => {
  const result = await HomepageTestimonialService.removeAll();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All testimonials deleted successfully",
    data: result,
  });
});

/* 🔀 Update Sort Order */
export const updateSortOrder = catchAsync(async (req, res) => {
  const { sortedIds } = req.body;
  const result = await HomepageTestimonialService.updateSortOrder(sortedIds);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sort order updated successfully",
    data: result,
  });
});

/* 🖼️ Upload Image to S3 */
export const uploadHomepageImage = catchAsync(async (req, res) => {
  if (!req.file) throw new Error("No file uploaded");
  const imageUrl = await uploadToS3(req.file, "testimonials");
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Image uploaded successfully",
    data: { url: imageUrl },
  });
});
