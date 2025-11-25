import mongoose, { Schema, Document } from "mongoose";
import { IBlog } from "./blogManagement.interface";

export interface IBlogModel extends IBlog, Document {}

const blogSchema = new Schema<IBlogModel>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    heroUrl: String,
    contentHtml: { type: String, required: true },
    showOnHome: { type: Boolean, default: false },
    wordCount: Number,
    readingTime: Number,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export const Blog = mongoose.model<IBlogModel>("Blog", blogSchema);
