import mongoose, { Schema, Document } from "mongoose";
import { IErrorLog } from "./SentryError.interface";


export interface IErrorLogDocument extends IErrorLog, Document {}

const ErrorLogSchema = new Schema(
  {
    source: { type: String, enum: ["backend", "frontend"], required: true },
    message: { type: String, required: true },
    stack: { type: String },
    route: { type: String },
    method: { type: String },
    statusCode: { type: Number },
    user: {
      id: { type: String },
      email: { type: String },
    },
    extra: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const ErrorLog = mongoose.model<IErrorLogDocument>(
  "ErrorLog",
  ErrorLogSchema
);
