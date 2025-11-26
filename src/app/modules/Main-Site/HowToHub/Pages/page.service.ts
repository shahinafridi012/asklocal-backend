import { Page } from "./page.model";
import { PageAttrs } from "./page.interface";

export const PageService = {
  async create(data: PageAttrs) {
    return Page.create(data);
  },
  async list() {
    return Page.find().sort({ createdAt: -1 });
  },
  async getBySlug(slug: string) {
    return Page.findOne({ slug });
  },
  async update(id: string, data: Partial<PageAttrs>) {
    return Page.findByIdAndUpdate(id, data, { new: true });
  },
  async remove(id: string) {
    return Page.findByIdAndDelete(id);
  },
};
