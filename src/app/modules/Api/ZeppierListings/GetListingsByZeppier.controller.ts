// src/app/modules/listings/Listings.controller.ts
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { uploadToS3 } from "../../../shared/s3Upload";
// @ts-ignore – types for unzipper are optional
import * as unzipper from "unzipper";
import path from "path";
import { ListingsService } from "./GetListingsAgentByZeppier.service";

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
// admin Create Listings
// src/app/modules/listings/Listings.controller.ts  (add this handler)
export const AdminCreateListing = catchAsync(async (req, res) => {
  const { data } = req.body; // expects { data: { ...fields } }
  if (!data) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Missing 'data' object",
      data: null,
    });
  }

  // Create a 24h upload link window, status=pending
  const doc = await ListingsService.createFromZapier(data, 24);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing created (admin).",
    data: {
      listingId: doc._id,
      status: doc.status,
      uploadLinkExpiresAt: doc.uploadLinkExpiresAt,
    },
  });
});

// 1) Zapier → create listing + return 24h upload URL
export const WebhookListings = catchAsync(async (req, res) => {
  const payload = req.body;
  const listing = await ListingsService.createFromZapier(payload, 24);

  const uploadUrl = `${FRONTEND_BASE_URL}/upload/${listing._id}`;

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing created. Use the upload URL within 24 hours.",
    data: {
      listingId: listing._id,
      status: listing.status,
      uploadUrl,
      uploadLinkExpiresAt: listing.uploadLinkExpiresAt,
    },
  });
});

// 2) Validate upload link
export const CheckUpload = catchAsync(async (req, res) => {
  const { id } = req.params;
  let doc = await ListingsService.getById(id);

  if (!doc)
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Invalid upload link.",
      data: null,
    });

  // Mark as expired if needed
  doc = await ListingsService.expireIfNeeded(id);

  if (doc!.status === "expired")
    return sendResponse(res, {
      statusCode: httpStatus.GONE,
      success: false,
      message: "Upload link expired.",
      data: null,
    });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upload link valid.",
    data: {
      _id: doc!._id,
      status: doc!.status,
      uploadLinkExpiresAt: doc!.uploadLinkExpiresAt,
    },
  });
});

// 3) Upload images (files or ZIP) → S3 → mark readyToPublish
export const UploadImages = catchAsync(async (req: any, res) => {
  const { id } = req.params;
  const files = req.files;

  if (!files || !files.length) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No files uploaded.",
      data: null,
    });
  }

  const imageUrls: string[] = [];

  const pushUrl = (u: string) => imageUrls.push(u);

  // handle each uploaded file
  for (const file of files) {
    const isZip =
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed";

    if (!isZip) {
      const url = await uploadToS3(file, "listings");
      pushUrl(url);
      continue;
    }

    // ZIP → extract images → upload
    const directory = await unzipper.Open.buffer(file.buffer);
    const extracted: any[] = [];

    for (const entry of directory.files) {
      const name = entry.path.toLowerCase();
      if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp")) {
        const buffer = await entry.buffer();
        extracted.push({
          buffer,
          originalname: path.basename(entry.path),
          mimetype: "image/jpeg",
        });
      }
    }

    // upload in batches of 3
    for (let i = 0; i < extracted.length; i += 3) {
      const batch = extracted.slice(i, i + 3);
      const urls = await Promise.all(batch.map((f) => uploadToS3(f, "listings")));
      imageUrls.push(...urls);
    }
  }

  const updated = await ListingsService.addImagesAndMarkReady(id, imageUrls);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Uploaded ${imageUrls.length} image(s). Listing is now readyToPublish.`,
    data: {
      listingId: id,
      status: updated?.status,
      images: updated?.images || [],
    },
  });
});

// 4) Admin: publish
export const PublishListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updated = await ListingsService.publish(id);

  if (!updated) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Listing not found.",
      data: null,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing published.",
    data: updated,
  });
});

// 5) Admin: list all
export const GetAllListings = catchAsync(async (_req, res) => {
  const listings = await ListingsService.listAll();
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All listings",
    data: listings,
  });
});

// 6) Public: list published
export const GetPublicListings = catchAsync(async (_req, res) => {
  const listings = await ListingsService.listPublic();
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Published listings",
    data: listings,
  });
});

// 7) Single (admin or public resolver as you wish)
export const GetSingleListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await ListingsService.getOneLean(id);

  if (!listing) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Listing not found",
      data: null,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing",
    data: listing,
  });
});

// 8) Admin: delete
export const DeleteListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const removed = await ListingsService.remove(id);

  if (!removed) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Listing not found",
      data: null,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing deleted",
    data: removed,
  });
});
