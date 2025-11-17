import mongoose, { Schema, Document } from "mongoose";
import { IUserFlow } from "./UserFlow.interface";

export interface IUserFlowDocument extends IUserFlow, Document {}

const UserFlowSchema = new Schema<IUserFlowDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    flowType: { type: String, enum: ["buyer", "seller", "refinance", "agent"] },
    code: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserFlowModel = mongoose.model<IUserFlowDocument>(
  "UserFlow",
  UserFlowSchema
);
