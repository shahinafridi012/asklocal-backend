import { ITerms, Terms } from "./page.model";


export class TermsService {
  // ✅ Create or Update (Upsert)
  static async createOrUpdate(data: ITerms) {
    const existing = await Terms.findOne();
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
      return existing;
    } else {
      const terms = await Terms.create(data);
      return terms;
    }
  }

  // ✅ Explicit update method
  static async update(data: ITerms) {
    const existing = await Terms.findOne();
    if (!existing) return null;
    Object.assign(existing, data);
    return await existing.save();
  }

  // ✅ Get Terms of Use page
  static async get() {
    return await Terms.findOne();
  }
}
