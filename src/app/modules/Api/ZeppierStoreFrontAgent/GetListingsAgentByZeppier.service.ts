import { ListingsModel } from "./GetListingsByZeppier.model";

export class ListingsService {
  static async saveListing(payload: any) {
    return ListingsModel.create({ data: payload });
  }

  static async setExpiry(id: string, hours: number) {
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    return ListingsModel.findByIdAndUpdate(id, { expiresAt }, { new: true });
  }

  static async getListingById(id: string) {
    return ListingsModel.findById(id);
  }

  static async addImages(id: string, images: string[]) {
    return ListingsModel.findByIdAndUpdate(
      id,
      { $push: { images: { $each: images } } },
      { new: true }
    );
  }
}
