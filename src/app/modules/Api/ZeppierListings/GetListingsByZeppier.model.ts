// src/app/modules/listings/Listings.model.ts
import { Schema, model, Types } from "mongoose";
import { IListings } from "./GetListingsByZeppier.interface";




const ListingsSchema = new Schema<IListings>(
  {
    data: { type: Object, required: true },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "readyToPublish", "published", "expired"],
      default: "pending",
      index: true,
    },
    uploadLinkExpiresAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

export const ListingsModel = model<IListings>("Listings", ListingsSchema);
