import { IPrivacy, Privacy } from "./page.model";

export class PrivacyService {
  // ✅ Create or Update (Upsert)
  static async createOrUpdate(data: IPrivacy) {
    const existing = await Privacy.findOne();
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
      return existing;
    } else {
      const page = await Privacy.create(data);
      return page;
    }
  }

  // ✅ Explicit Update
  static async update(data: IPrivacy) {
    const existing = await Privacy.findOne();
    if (!existing) return null;
    Object.assign(existing, data);
    return await existing.save();
  }

  // ✅ Get Privacy Policy page
  static async get() {
    return await Privacy.findOne();
  }
}
