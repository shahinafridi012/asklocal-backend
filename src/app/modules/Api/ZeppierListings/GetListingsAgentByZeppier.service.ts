// src/app/modules/listings/Listings.service.ts

import { ListingsModel } from "./GetListingsByZeppier.model";

export class ListingsService {
  static async createFromZapier(payload: any, linkHours = 24) {
    const uploadLinkExpiresAt = new Date(Date.now() + linkHours * 60 * 60 * 1000);
    return ListingsModel.create({
      data: payload,
      status: "pending",
      uploadLinkExpiresAt,
      images: [],
    });
  }

  static async getById(id: string) {
    return ListingsModel.findById(id);
  }

  static async getOneLean(id: string) {
    return ListingsModel.findById(id).lean();
  }

  static async addImagesAndMarkReady(id: string, urls: string[]) {
    const updated = await ListingsModel.findByIdAndUpdate(
      id,
      {
        $push: { images: { $each: urls } },
        $set: { status: "readyToPublish" },
      },
      { new: true }
    );
    return updated;
  }

  static async publish(id: string) {
    return ListingsModel.findByIdAndUpdate(
      id,
      { $set: { status: "published" } },
      { new: true }
    );
  }

  static async expireIfNeeded(id: string) {
    const doc = await ListingsModel.findById(id);
    if (!doc) return null;
    if (doc.uploadLinkExpiresAt && doc.uploadLinkExpiresAt < new Date() && doc.status === "pending") {
      doc.status = "expired";
      await doc.save();
    }
    return doc;
  }

  // Admin view: all
  static async listAll() {
    return ListingsModel.find().sort({ createdAt: -1 }).lean();
  }

  // Public view: only published
  static async listPublic() {
    return ListingsModel.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async remove(id: string) {
    return ListingsModel.findByIdAndDelete(id);
  }
}
