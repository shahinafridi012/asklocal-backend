import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { uploadToS3 } from "../../../shared/s3Upload";
import { ListingsService } from "./GetListingsAgentByZeppier.service";

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
    message: "Listing saved! Share upload URL with user.",
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
      message: "No images uploaded",
      data: undefined
    });
  }

  console.log("📸 Total images uploaded:", files.length);

  const urls: string[] = [];

  for (const file of files) {
    const url = await uploadToS3(file);
    urls.push(url);
  }

  // 🔥 SAVE IMAGES INSIDE DATABASE
  const updatedListing = await ListingsService.addImages(id, urls);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Images uploaded successfully!",
    data: {
      listingId: id,
      count: urls.length,
      images: updatedListing?.images || urls
    },
  });
});


