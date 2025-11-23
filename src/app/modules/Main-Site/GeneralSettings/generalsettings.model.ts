import mongoose, { Schema, Document } from "mongoose";
import { ISettings } from "./generalsettings.interface";

export interface ISettingsModel extends ISettings, Document {}

const SettingsSchema = new Schema<ISettingsModel>(
  {
    siteTitle: String,
    businessAddress: String,
    supportMail: String,
    hotline: String,
    workHour: String,
    logoUrl: String,
    faviconUrl: String,
    facebook: String,
    instagram: String,
    twitter: String,
    seoTitle: String,
    seoDescription: String,
    smtpHost: String,
    smtpPort: String,
    smtpUser: String,
    smtpPass: String,
    headerTitle: String,
    footerText: String,
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettingsModel>(
  "GeneralSettings",
  SettingsSchema
);
