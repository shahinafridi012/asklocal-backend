import mongoose, { Schema, Document } from "mongoose";

export interface IFaq extends Document {
  hero: {
    image: string;
    title: string;
    description: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

const faqSchema = new Schema<IFaq>(
  {
    hero: {
      image: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const FaqModel = mongoose.model<IFaq>("Faq", faqSchema);
