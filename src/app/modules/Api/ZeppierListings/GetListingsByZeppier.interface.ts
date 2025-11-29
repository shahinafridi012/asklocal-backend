import { Types } from "mongoose";

export type ListingStatus = "pending" | "readyToPublish" | "published" | "expired";
export interface IListings {
  _id?: string | Types.ObjectId;
  data: any;                     // raw Zapier payload
  images: string[];              // uploaded image URLs
  status: ListingStatus;         // visibility control
  uploadLinkExpiresAt: Date | null;  // 24h window for uploads
  createdAt?: Date;
  updatedAt?: Date;
}