// src/app/modules/Admin/admin.model.ts

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IAdmin } from "./admin.interface";

// admin.model.ts
const AdminSchema = new Schema<IAdmin>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String },
    address: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Manager", "Editor"], default: "Admin" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    profileImage: { type: String },

    // 👇 required for your forgot/verify/reset flow
    verificationCode: { type: String, default: null },
    verificationCodeExpiry: { type: Date, default: null },
    resetToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Hash password before saving
// AdminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

export const AdminModel = model<IAdmin>("Admin", AdminSchema);
