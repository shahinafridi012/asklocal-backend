import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { LoadfastListingService } from "./LoadfastListing.service";
import { Cache } from "../../../shared/redis";

export const GetLoadfastListings = catchAsync(async (req, res) => {
  const cacheKey = "loadfast:listings";
  const start = Date.now();

  const cached = await Cache.get(cacheKey);
  if (cached) {
    console.log("⏱ From Redis:", Date.now() - start, "ms");
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Loaded from Redis cache",
      data: cached,
    });
  }

  const listings = await LoadfastListingService.getFastListings();
  await Cache.set(cacheKey, listings, 60);

  console.log("⏱ From Mongo:", Date.now() - start, "ms");

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Loaded from MongoDB",
    data: listings,
  });
});
