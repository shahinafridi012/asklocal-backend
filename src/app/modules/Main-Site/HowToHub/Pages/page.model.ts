import { Schema, model } from "mongoose";
import { PageDoc, PageModel } from "./page.interface";

const PageSchema = new Schema<PageDoc, PageModel>(
  {
    title: { type: String, required: true, trim: true },
    sectionTitle: { type: String},
    slug: { type: String, required: true, unique: true, lowercase: true },
    template: {
      type: String,
      enum: ["template1", "template2"],
      required: true,
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Page = model<PageDoc, PageModel>("Page", PageSchema);
