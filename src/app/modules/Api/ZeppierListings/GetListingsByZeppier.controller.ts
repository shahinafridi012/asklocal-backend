import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { uploadToS3 } from "../../../shared/s3Upload";
import { ListingsService } from "./GetListingsAgentByZeppier.service";
import path from "path";
import * as unzipper from "unzipper";

const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";

// 1) Zapier webhook → save listing + create 24h upload URL
export const WebhookListings = catchAsync(async (req, res) => {
  const payload = req.body;

  console.log("🔥 New Listing From Zapier:", payload);

  const listing = await ListingsService.saveListing(payload);

  await ListingsService.setExpiry(listing._id, 24); // 24 hours

  const uploadUrl = `${FRONTEND_BASE_URL}/upload/${listing._id}`;

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing saved Upload Your images Usings This Url",
    data: {
      listingId: listing._id,
      uploadUrl,
      expiresIn: "24 hours",
    },
  });
});

// 2) Validate upload link
export const CheckUpload = catchAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await ListingsService.getListingById(id);

  if (!listing)
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Invalid upload link",
      data: undefined,
    });

  if (listing.expiresAt && listing.expiresAt < new Date())
    return sendResponse(res, {
      statusCode: httpStatus.GONE,
      success: false,
      message: "Upload link expired",
      data: undefined,
    });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upload link valid",
    data: listing,
  });
});

// 3) Upload images → S3 → Save URLs
export const UploadImages = catchAsync(async (req: any, res) => {
  const files = req.files;
  const { id } = req.params;

  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No files uploaded",
      data: undefined,
    });
  }

  const imageUrls: string[] = [];

  // Batch uploader to avoid overload
  const uploadBatch = async (batch: any[]) => {
    const results = await Promise.all(
      batch.map((f) => uploadToS3(f, "listings"))
    );
    imageUrls.push(...results);
  };

  for (const file of files) {
    // ZIP case
    if (
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed"
    ) {
      console.log("📦 ZIP detected → extracting images...");

      const directory = await unzipper.Open.buffer(file.buffer);
      const extractedImages: any[] = [];

      for (const entry of directory.files) {
        const fileName = entry.path.toLowerCase();

        if (
          fileName.endsWith(".jpg") ||
          fileName.endsWith(".jpeg") ||
          fileName.endsWith(".png") ||
          fileName.endsWith(".webp")
        ) {
          const buffer = await entry.buffer();
          extractedImages.push({
            buffer,
            originalname: path.basename(entry.path),
            mimetype: "image/jpeg",
          });
        }
      }

      console.log("📸 Extracted images from ZIP:", extractedImages.length);

      // Upload ZIP images in batches of 3
      for (let i = 0; i < extractedImages.length; i += 3) {
        const batch = extractedImages.slice(i, i + 3);
        await uploadBatch(batch);
      }
    } else {
      // Normal image upload
      const url = await uploadToS3(file, "listings");
      imageUrls.push(url);
    }
  }

  // Save URLs to database
  await ListingsService.addImages(id, imageUrls);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Uploaded ${imageUrls.length} images successfully!`,
    data: {
      listingId: id,
      count: imageUrls.length,
      images: imageUrls,
    },
  });
});
export const GetAllListings = catchAsync(async (req, res) => {
  const listings = await ListingsService.getAllListings();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All listings retrieved",
    data: listings,
  });
});

export const GetSingleListing = catchAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await ListingsService.getSingleListingFormatted(id);

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
    message: "Listing retrieved",
    data: listing,
  });
});
