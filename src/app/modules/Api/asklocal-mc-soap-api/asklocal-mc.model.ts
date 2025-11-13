// src/models/McSoapUser.ts

import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IMcSoapUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  amount: number;
  zipCode: string;
  additionalMassage?: string;

  verified: boolean;
  tcaReportXml?: string;
  createdAt: Date;
  updatedAt: Date;
}

const McSoapUserSchema = new Schema<IMcSoapUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    zipCode: { type: String, required: true },
    additionalMassage: { type: String },

    // System fields
    verified: { type: Boolean, default: false },
    tcaReportXml: { type: String },
  },
  { timestamps: true }
);

export const McSoapUser =
  models.McSoapUser || model<IMcSoapUser>("AsklocalMcSoapUser", McSoapUserSchema);
