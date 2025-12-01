import { Document } from "mongoose";

export interface IHomepageTestimonial extends Document {
  name: string;
  rating: number;
  content: string;
  image?: string;
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}
