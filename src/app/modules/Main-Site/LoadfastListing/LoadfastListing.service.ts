import { ListingsModel } from "../../Api/ZeppierListings/GetListingsByZeppier.model";


export class LoadfastListingService {
  /**
   * ✅ Fetch listings fast: first image, price, address, city, state, and id
   * Uses $slice to only pull one image from Mongo
   */
  static async getFastListings(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const listings = await ListingsModel.find(
      { status: { $in: ["readyToPublish", "published"] } },
      {
        _id: 1,
        "data.price": 1,
        "data.address_1": 1,
        "data.city": 1,
        "data.state": 1,
        images: { $slice: 1 },
      }
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Clean response structure
    return listings.map((item) => ({
      _id: item._id,
      price: item.data?.price || "N/A",
      address: item.data?.address_1 || "",
      city: item.data?.city || "",
      state: item.data?.state || "",
      image: item.images?.[0] || "/no-image.jpg", // fallback
    }));
  }
}
