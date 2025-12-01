import { Schema, model } from "mongoose";
import { IHomepageTestimonial } from "./homepageTestimonial.interface";

const HomepageTestimonialSchema = new Schema<IHomepageTestimonial>(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 5 },
    content: { type: String, required: true },
    image: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HomepageTestimonialModel = model<IHomepageTestimonial>(
  "HomepageTestimonial",
  HomepageTestimonialSchema
);
