import { Schema, model } from "mongoose";
import { IZapierData } from "./GetListingsByZeppier.interface";

const ZapierSchema = new Schema<IZapierData>(
  {
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

export const ZapierModel = model<IZapierData>("ZapierData", ZapierSchema);
