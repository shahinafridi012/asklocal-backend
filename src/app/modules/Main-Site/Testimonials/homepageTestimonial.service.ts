import { IHomepageTestimonial } from "./homepageTestimonial.interface";
import { HomepageTestimonialModel } from "./homepageTestimonial.model";

export const HomepageTestimonialService = {
  async create(data: Partial<IHomepageTestimonial>) {
    const count = await HomepageTestimonialModel.countDocuments();
    const newItem = new HomepageTestimonialModel({
      ...data,
      sortOrder: count + 1,
    });
    return newItem.save();
  },

  async getAll(sort: "asc" | "desc" = "desc") {
    return HomepageTestimonialModel.find().sort({
      sortOrder: sort === "asc" ? 1 : -1,
    });
  },

  async getById(id: string) {
    return HomepageTestimonialModel.findById(id);
  },

  async update(id: string, data: Partial<IHomepageTestimonial>) {
    return HomepageTestimonialModel.findByIdAndUpdate(id, data, { new: true });
  },

  async remove(id: string) {
    return HomepageTestimonialModel.findByIdAndDelete(id);
  },

  async removeAll() {
    return HomepageTestimonialModel.deleteMany({});
  },

  async updateSortOrder(sortedIds: string[]) {
    const updates = sortedIds.map((id, index) =>
      HomepageTestimonialModel.findByIdAndUpdate(id, { sortOrder: index + 1 })
    );
    await Promise.all(updates);
    return true;
  },
};
