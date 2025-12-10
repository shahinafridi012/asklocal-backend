import { uploadToS3 } from "../../../shared/s3Upload";
import { FaqModel } from "./faq.model";

export const FaqService = {
  async getFaq() {
    return await FaqModel.findOne();
  },

  async createFaq(data: any, file?: Express.Multer.File) {
    let imageUrl = data.hero.image;

    if (file) {
      imageUrl = await uploadToS3(file, "faq");
    }

    const faq = await FaqModel.create({
      hero: {
        image: imageUrl,
        title: data.hero.title,
        description: data.hero.description,
      },
      faqs: data.faqs,
    });

    return faq;
  },

  async updateFaq(data: any, file?: Express.Multer.File) {
    const existing = await FaqModel.findOne();
    if (!existing) throw new Error("FAQ page not found to update");

    let imageUrl = existing.hero.image;
    if (file) {
      imageUrl = await uploadToS3(file, "faq");
    }

    existing.hero = {
      image: imageUrl,
      title: data.hero.title,
      description: data.hero.description,
    };
    existing.faqs = data.faqs;

    await existing.save();
    return existing;
  },
};
