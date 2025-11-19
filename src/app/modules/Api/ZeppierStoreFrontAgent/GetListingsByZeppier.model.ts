import { Schema, model } from "mongoose";
import { IListings } from "./GetListingsByZeppier.interface";

const ListingsSchema = new Schema<IListings>(
  {
    data: { type: Object, required: true },
    expiresAt: { type: Date, default: null },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Auto-delete after expiresAt
ListingsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ListingsModel = model<IListings>("Listings", ListingsSchema);
