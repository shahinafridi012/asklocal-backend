import { Schema, model } from "mongoose";

export interface ITerms {
  hero: {
    image: string;
    title: string;
    description: string;
  };
  content: string;
}

const TermsSchema = new Schema<ITerms>(
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

export const Terms = model<ITerms>("Terms", TermsSchema);
