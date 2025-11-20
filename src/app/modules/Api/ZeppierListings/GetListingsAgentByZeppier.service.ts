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

  // NEW: Get all listings fully formatted
  static async getAllListings() {
    const listings = await ListingsModel.find().lean();

    return listings.map((l: any) => {
      const banner = l.images?.length ? l.images[0] : null;

      return {
        _id: l._id,
        banner,
        images: l.images || [],
        expiresAt: l.expiresAt,
        data: l.data,
      };
    });
  }

  // ⭐ NEW: Get one listing formatted (banner + images)
  static async getSingleListingFormatted(id: string) {
    const listing = await ListingsModel.findById(id).lean();

    if (!listing) return null;

    const banner = listing.images?.length ? listing.images[0] : null;

    return {
      _id: listing._id,
      banner,
      images: listing.images || [],
      expiresAt: listing.expiresAt,
      data: listing.data,
    };
  }
}
