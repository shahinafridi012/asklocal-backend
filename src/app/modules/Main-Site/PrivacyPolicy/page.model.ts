import { Schema, model } from "mongoose";

export interface IPrivacy {
  hero: {
    image: string;
    title: string;
    description: string;
  };
  content: string;
}

const PrivacySchema = new Schema<IPrivacy>(
  {
    hero: {
      image: { type: String },
      title: { type: String },
      description: { type: String },
    },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Privacy = model<IPrivacy>("Privacy", PrivacySchema);
