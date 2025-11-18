import { Schema, model } from "mongoose";
import { IPartnerFlow } from "./asklocalPartner.interface";

const PartnerFlowSchema = new Schema<IPartnerFlow>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mlsLicense: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    code: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PartnerFlowModel = model<IPartnerFlow>(
  "PartnerFlow",
  PartnerFlowSchema
);
