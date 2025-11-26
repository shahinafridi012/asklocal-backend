import { Request, Response } from "express";
import { PageService } from "./page.service";
import sendResponse from "../../../../utils/sendResponse";
import catchAsync from "../../../../utils/catchAsync";
import { uploadToS3 } from "../../../../shared/s3Upload";

export const PageController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const doc = await PageService.create(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Page created successfully",
      data: doc,
    });
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const docs = await PageService.list();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Pages fetched successfully",
      data: docs,
    });
  }),

  getBySlug: catchAsync(async (req: Request, res: Response) => {
    const doc = await PageService.getBySlug(req.params.slug);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Page fetched successfully",
      data: doc,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const doc = await PageService.update(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Page updated successfully",
      data: doc,
    });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const doc = await PageService.remove(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Page deleted successfully",
      data: doc,
    });
  }),

  upload: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "No file provided",
        data: undefined,
      });
    }

    const url = await uploadToS3(req.file, "pages"); // uploads to S3 under "pages/"
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Image uploaded successfully",
      data: { url },
    });
  }),
};
