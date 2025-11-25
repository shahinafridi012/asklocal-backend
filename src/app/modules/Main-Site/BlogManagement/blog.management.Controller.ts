import httpStatus from "http-status";
import { BlogService } from "./blogManagement.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

export const BlogController = {
  createBlog: catchAsync(async (req, res) => {
    const result = await BlogService.createBlog(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  }),

  getAllBlogs: catchAsync(async (req, res) => {
    const result = await BlogService.getAllBlogs();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blogs fetched successfully",
      data: result,
    });
  }),

  getBlogById: catchAsync(async (req, res) => {
    const result = await BlogService.getBlogById(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog fetched successfully",
      data: result,
    });
  }),

  updateBlog: catchAsync(async (req, res) => {
    const result = await BlogService.updateBlog(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  }),

  deleteBlog: catchAsync(async (req, res) => {
    const result = await BlogService.deleteBlog(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog deleted successfully",
      data: result,
    });
  }),
};
